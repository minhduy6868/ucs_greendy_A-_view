import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Settings, Download, Upload, Trash2, Edit3, SkipForward, SkipBack, X, Check } from 'lucide-react';
import GraphCanvas from './GraphCanvas';
import AlgorithmControls from './AlgorithmControls';
import StepVisualization from './StepVisualization';
import NodeEditPanel from './NodeEditPanel';
import EdgeEditPanel from './EdgeEditPanel';

export interface Node {
  id: string;
  x: number;
  y: number;
  cost: number;
  heuristic: number;
  isStart?: boolean;
  isGoal?: boolean;
  isVisited?: boolean;
  isInFrontier?: boolean;
  isCurrent?: boolean;
  parent?: string;
  pathCost?: number;
  gCost?: number;
  fCost?: number;
}

export interface Edge {
  from: string;
  to: string;
  cost: number;
  isInPath?: boolean;
  isBeingExplored?: boolean;
}

export interface AlgorithmStep {
  step: number;
  action: string;
  currentNode: string;
  frontier: { nodeId: string; pathCost: number; heuristic: number; fCost: number; parent?: string }[];
  visited: string[];
  description: string;
  pathCost?: number;
  heuristic?: number;
  totalCost?: number;
  currentPath: string[];
  exploredEdges: string[];
  finalPath?: string[];
}

const InteractiveDemo: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'S', x: 100, y: 200, cost: 0, heuristic: 10, isStart: true },
    { id: 'A', x: 200, y: 100, cost: 0, heuristic: 8 },
    { id: 'B', x: 200, y: 300, cost: 0, heuristic: 6 },
    { id: 'C', x: 350, y: 150, cost: 0, heuristic: 4 },
    { id: 'D', x: 350, y: 250, cost: 0, heuristic: 3 },
    { id: 'G', x: 500, y: 200, cost: 0, heuristic: 0, isGoal: true }
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { from: 'S', to: 'A', cost: 3 },
    { from: 'S', to: 'B', cost: 5 },
    { from: 'A', to: 'C', cost: 4 },
    { from: 'B', to: 'D', cost: 3 },
    { from: 'C', to: 'G', cost: 3 },
    { from: 'D', to: 'G', cost: 5 }
  ]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'ucs' | 'greedy' | 'astar'>('astar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [mode, setMode] = useState<'view' | 'edit' | 'addNode' | 'addEdge'>('view');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [speed, setSpeed] = useState(1000);
  const [showSettings, setShowSettings] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editingEdge, setEditingEdge] = useState<{ from: string; to: string } | null>(null);
  const [autoRun, setAutoRun] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && algorithmSteps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= algorithmSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, algorithmSteps.length, speed]);

  // Auto-run when algorithm or graph changes
  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(() => {
        runAlgorithm();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedAlgorithm, nodes, edges, autoRun]);

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const buildPath = (nodeId: string, parentMap: Map<string, string>): string[] => {
    const path: string[] = [];
    let current = nodeId;
    while (current) {
      path.unshift(current);
      current = parentMap.get(current) || '';
    }
    return path;
  };

  const runAlgorithm = useCallback(() => {
    const startNode = nodes.find(n => n.isStart);
    const goalNode = nodes.find(n => n.isGoal);
    
    if (!startNode || !goalNode) {
      setShowError('Vui lòng đặt điểm start và goal!');
      return;
    }

    const steps: AlgorithmStep[] = [];
    const frontier: { nodeId: string; pathCost: number; heuristic: number; fCost: number; parent?: string }[] = [];
    const visited: Set<string> = new Set();
    const parentMap: Map<string, string> = new Map();
    const exploredEdges: Set<string> = new Set();

    // Initialize
    const startHeuristic = startNode.heuristic;
    const startFCost = selectedAlgorithm === 'ucs' ? 0 : 
                      selectedAlgorithm === 'greedy' ? startHeuristic : 
                      0 + startHeuristic;
    
    frontier.push({ 
      nodeId: startNode.id, 
      pathCost: 0, 
      heuristic: startHeuristic,
      fCost: startFCost
    });

    steps.push({
      step: 0,
      action: 'initialize',
      currentNode: startNode.id,
      frontier: [...frontier],
      visited: [],
      description: `Khởi tạo frontier với node ${startNode.id}`,
      currentPath: [startNode.id],
      exploredEdges: [],
      pathCost: 0,
      heuristic: startHeuristic,
      totalCost: startFCost
    });

    let stepCount = 1;
    let foundGoal = false;
    
    while (frontier.length > 0 && stepCount < 50 && !foundGoal) {
      let currentIndex = 0;
      
      // Choose next node based on algorithm
      switch (selectedAlgorithm) {
        case 'ucs':
          currentIndex = frontier.reduce((minIdx, curr, idx) => 
            curr.pathCost < frontier[minIdx].pathCost ? idx : minIdx, 0);
          break;
        case 'greedy':
          currentIndex = frontier.reduce((minIdx, curr, idx) => 
            curr.heuristic < frontier[minIdx].heuristic ? idx : minIdx, 0);
          break;
        case 'astar':
          currentIndex = frontier.reduce((minIdx, curr, idx) => 
            curr.fCost < frontier[minIdx].fCost ? idx : minIdx, 0);
          break;
      }

      const current = frontier.splice(currentIndex, 1)[0];

      if (visited.has(current.nodeId)) continue;
      
      visited.add(current.nodeId);
      const currentPath = buildPath(current.nodeId, parentMap);
      
      steps.push({
        step: stepCount,
        action: 'visit',
        currentNode: current.nodeId,
        frontier: [...frontier],
        visited: Array.from(visited),
        description: `Thăm node ${current.nodeId} (${selectedAlgorithm === 'ucs' ? `g=${current.pathCost}` : 
                     selectedAlgorithm === 'greedy' ? `h=${current.heuristic}` : 
                     `f=${current.fCost}, g=${current.pathCost}, h=${current.heuristic}`})`,
        pathCost: current.pathCost,
        heuristic: current.heuristic,
        totalCost: current.fCost,
        currentPath: currentPath,
        exploredEdges: Array.from(exploredEdges)
      });

      if (current.nodeId === goalNode.id) {
        foundGoal = true;
        const finalPath = buildPath(current.nodeId, parentMap);
        steps.push({
          step: stepCount + 1,
          action: 'found',
          currentNode: current.nodeId,
          frontier: [],
          visited: Array.from(visited),
          description: `🎉 Tìm thấy goal! Đường đi tối ưu: ${finalPath.join(' → ')} (Chi phí: ${current.pathCost})`,
          finalPath: finalPath,
          currentPath: finalPath,
          exploredEdges: Array.from(exploredEdges)
        });
        break;
      }

      // Expand neighbors
      const neighbors = edges.filter(e => e.from === current.nodeId);
      for (const edge of neighbors) {
        const neighbor = nodes.find(n => n.id === edge.to);
        if (neighbor && !visited.has(neighbor.id)) {
          const newPathCost = current.pathCost + edge.cost;
          const neighborHeuristic = neighbor.heuristic;
          const neighborFCost = selectedAlgorithm === 'ucs' ? newPathCost : 
                               selectedAlgorithm === 'greedy' ? neighborHeuristic : 
                               newPathCost + neighborHeuristic;

          // Check if we already have this node in frontier with higher cost
          const existingIndex = frontier.findIndex(f => f.nodeId === neighbor.id);
          if (existingIndex >= 0) {
            if (newPathCost < frontier[existingIndex].pathCost) {
              frontier[existingIndex] = { 
                nodeId: neighbor.id, 
                pathCost: newPathCost, 
                heuristic: neighborHeuristic,
                fCost: neighborFCost,
                parent: current.nodeId 
              };
              parentMap.set(neighbor.id, current.nodeId);
            }
          } else {
            frontier.push({ 
              nodeId: neighbor.id, 
              pathCost: newPathCost, 
              heuristic: neighborHeuristic,
              fCost: neighborFCost,
              parent: current.nodeId 
            });
            parentMap.set(neighbor.id, current.nodeId);
          }
          
          exploredEdges.add(`${edge.from}-${edge.to}`);
        }
      }

      stepCount++;
    }

    if (!foundGoal && frontier.length === 0) {
      steps.push({
        step: stepCount,
        action: 'failed',
        currentNode: '',
        frontier: [],
        visited: Array.from(visited),
        description: '❌ Không tìm thấy đường đi đến goal!',
        currentPath: [],
        exploredEdges: Array.from(exploredEdges)
      });
    }

    setAlgorithmSteps(steps);
    setCurrentStep(0);
  }, [nodes, edges, selectedAlgorithm]);

  const togglePlayback = () => {
    if (algorithmSteps.length === 0) {
      runAlgorithm();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const resetDemo = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(0);
    setAlgorithmSteps([]);
    setNodes(prev => prev.map(node => ({
      ...node,
      isVisited: false,
      isInFrontier: false,
      isCurrent: false,
      parent: undefined,
      pathCost: undefined,
      gCost: undefined,
      fCost: undefined
    })));
    setEdges(prev => prev.map(edge => ({
      ...edge,
      isInPath: false,
      isBeingExplored: false
    })));
  };

  const addNode = (x: number, y: number) => {
    const existingIds = nodes.map(n => n.id);
    let newId = 'A';
    for (let i = 0; i < 26; i++) {
      const id = String.fromCharCode(65 + i);
      if (!existingIds.includes(id) && id !== 'S' && id !== 'G') {
        newId = id;
        break;
      }
    }
    
    const newNode: Node = {
      id: newId,
      x,
      y,
      cost: 0,
      heuristic: Math.floor(Math.random() * 10) + 1
    };
    setNodes(prev => [...prev, newNode]);
    setMode('view');
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    setEditingNode(null);
    if (autoRun) {
      resetDemo();
    }
  };

  const addEdge = (fromId: string, toId: string) => {
    // Check if edge already exists
    const existingEdge = edges.find(e => e.from === fromId && e.to === toId);
    if (existingEdge) {
      setShowError(`Edge từ ${fromId} đến ${toId} đã tồn tại!`);
      return;
    }
    
    const cost = Math.floor(Math.random() * 5) + 1;
    const newEdge: Edge = { from: fromId, to: toId, cost };
    setEdges(prev => [...prev, newEdge]);
    if (autoRun) {
      resetDemo();
    }
  };

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  };

  const updateNodeHeuristic = (nodeId: string, heuristic: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, heuristic } : node
    ));
    if (autoRun) {
      resetDemo();
    }
  };

  const updateEdgeCost = (fromId: string, toId: string, cost: number) => {
    setEdges(prev => prev.map(edge => 
      edge.from === fromId && edge.to === toId ? { ...edge, cost } : edge
    ));
    if (autoRun) {
      resetDemo();
    }
  };

  const setStartNode = (nodeId: string) => {
    setNodes(prev => prev.map(node => ({
      ...node,
      isStart: node.id === nodeId,
      isGoal: node.isGoal && node.id !== nodeId
    })));
    if (autoRun) {
      resetDemo();
    }
  };

  const setGoalNode = (nodeId: string) => {
    setNodes(prev => prev.map(node => ({
      ...node,
      isGoal: node.id === nodeId,
      isStart: node.isStart && node.id !== nodeId
    })));
    if (autoRun) {
      resetDemo();
    }
  };

  const exportGraph = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setNodes(data.nodes);
          setEdges(data.edges);
          resetDemo();
        } catch (error) {
          setShowError('File không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  const stepForward = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const jumpToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, algorithmSteps.length - 1)));
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Demo Tương Tác
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tạo graph của riêng bạn và xem các thuật toán hoạt động step-by-step với visualization đường đi
          </p>
        </div>

        {/* Error Notification */}
        {showError && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <span>{showError}</span>
            <button onClick={() => setShowError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayback}
                      className={`p-3 rounded-xl text-white transition-all ${
                        selectedAlgorithm === 'ucs' ? 'bg-blue-500 hover:bg-blue-600' :
                        selectedAlgorithm === 'greedy' ? 'bg-purple-500 hover:bg-purple-600' :
                        'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={resetDemo}
                      className="p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    
                    {/* Step Controls */}
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={stepBackward}
                        disabled={currentStep === 0 || isPlaying}
                        className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button
                        onClick={stepForward}
                        disabled={currentStep >= algorithmSteps.length - 1 || isPlaying}
                        className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}
                      className={`p-3 rounded-xl transition-colors ${
                        mode === 'edit' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAlgorithm}
                      onChange={(e) => {
                        setSelectedAlgorithm(e.target.value as 'ucs' | 'greedy' | 'astar');
                        resetDemo();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ucs">UCS</option>
                      <option value="greedy">Greedy</option>
                      <option value="astar">A*</option>
                    </select>
                    
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Step Progress Bar */}
                {algorithmSteps.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Bước {currentStep + 1} / {algorithmSteps.length}</span>
                      <span>{Math.round((currentStep / (algorithmSteps.length - 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / Math.max(1, algorithmSteps.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(0, algorithmSteps.length - 1)}
                      value={currentStep}
                      onChange={(e) => jumpToStep(Number(e.target.value))}
                      disabled={isPlaying}
                      className="w-full mt-2"
                    />
                  </div>
                )}

                {/* Edit Mode Tools */}
                {mode === 'edit' && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setMode('addNode')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Thêm Node
                    </button>
                    <button
                      onClick={() => setMode('addEdge')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Thêm Edge
                    </button>
                    <button
                      onClick={exportGraph}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 inline mr-1" />
                      Export
                    </button>
                    <label className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm cursor-pointer">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={importGraph}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Settings Panel */}
                {showSettings && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3">Cài Đặt</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tốc độ animation (ms): {speed}
                        </label>
                        <input
                          type="range"
                          min="200"
                          max="2000"
                          step="100"
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="autoRun"
                          checked={autoRun}
                          onChange={(e) => setAutoRun(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="autoRun" className="text-sm text-gray-700">
                          Tự động chạy khi thay đổi graph
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas */}
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                mode={mode}
                selectedNodes={selectedNodes}
                currentStep={algorithmSteps[currentStep]}
                editingNode={editingNode}
                editingEdge={editingEdge}
                onNodeClick={(nodeId) => {
                  if (mode === 'addEdge') {
                    setSelectedNodes(prev => {
                      if (prev.length === 0) return [nodeId];
                      if (prev.length === 1 && prev[0] !== nodeId) {
                        addEdge(prev[0], nodeId);
                        return [];
                      }
                      return [nodeId];
                    });
                  } else if (mode === 'edit') {
                    setEditingNode(nodeId);
                    setEditingEdge(null);
                  }
                }}
                onNodeDoubleClick={(nodeId) => {
                  if (mode === 'edit') {
                    setEditingNode(nodeId);
                    setEditingEdge(null);
                  }
                }}
                onEdgeDoubleClick={(fromId, toId) => {
                  if (mode === 'edit') {
                    setEditingEdge({ from: fromId, to: toId });
                    setEditingNode(null);
                  }
                }}
                onCanvasClick={(x, y) => {
                  if (mode === 'addNode') {
                    addNode(x, y);
                  } else {
                    setEditingNode(null);
                    setEditingEdge(null);
                  }
                }}
                onNodeDrag={updateNodePosition}
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Edit Panels */}
            {editingNode && (
              <NodeEditPanel
                node={nodes.find(n => n.id === editingNode)!}
                onUpdateHeuristic={updateNodeHeuristic}
                onSetStart={setStartNode}
                onSetGoal={setGoalNode}
                onDelete={deleteNode}
                onClose={() => setEditingNode(null)}
              />
            )}

            {editingEdge && (
              <EdgeEditPanel
                edge={edges.find(e => e.from === editingEdge.from && e.to === editingEdge.to)!}
                onUpdateCost={updateEdgeCost}
                onDelete={(fromId, toId) => {
                  setEdges(prev => prev.filter(e => !(e.from === fromId && e.to === toId)));
                  setEditingEdge(null);
                  if (autoRun) resetDemo();
                }}
                onClose={() => setEditingEdge(null)}
              />
            )}

            <AlgorithmControls
              algorithm={selectedAlgorithm}
              currentStep={currentStep}
              totalSteps={algorithmSteps.length}
              onStepChange={jumpToStep}
              isPlaying={isPlaying}
            />

            <StepVisualization
              steps={algorithmSteps}
              currentStep={currentStep}
              algorithm={selectedAlgorithm}
              onStepClick={jumpToStep}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;