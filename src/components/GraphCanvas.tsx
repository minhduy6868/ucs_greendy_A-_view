import React, { useRef, useEffect, useState } from 'react';
import { Node, Edge, AlgorithmStep } from './InteractiveDemo';

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  mode: 'view' | 'edit' | 'addNode' | 'addEdge';
  selectedNodes: string[];
  currentStep?: AlgorithmStep;
  editingNode?: string | null;
  editingEdge?: { from: string; to: string } | null;
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick: (nodeId: string) => void;
  onEdgeDoubleClick: (fromId: string, toId: string) => void;
  onCanvasClick: (x: number, y: number) => void;
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  mode,
  selectedNodes,
  currentStep,
  editingNode,
  editingEdge,
  onNodeClick,
  onNodeDoubleClick,
  onEdgeDoubleClick,
  onCanvasClick,
  onNodeDrag
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animationFrame, setAnimationFrame] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (node: Node) => {
    if (editingNode === node.id) return '#F59E0B'; // Orange for editing
    if (node.isStart) return '#3B82F6'; // Blue
    if (node.isGoal) return '#EF4444'; // Red
    
    if (currentStep) {
      if (currentStep.currentNode === node.id) return '#F59E0B'; // Orange - current
      if (currentStep.visited.includes(node.id)) return '#10B981'; // Green - visited
      if (currentStep.frontier.some(f => f.nodeId === node.id)) return '#8B5CF6'; // Purple - frontier
    }
    
    if (selectedNodes.includes(node.id)) return '#F59E0B'; // Orange - selected
    if (hoveredNode === node.id) return '#6366F1'; // Indigo - hovered
    return '#6B7280'; // Gray - default
  };

  const getNodeRadius = (node: Node) => {
    if (editingNode === node.id) return 35;
    if (currentStep?.currentNode === node.id) {
      // Pulsing animation for current node
      return 30 + Math.sin(animationFrame * 0.3) * 5;
    }
    if (hoveredNode === node.id) return 32;
    return 30;
  };

  const isEdgeInPath = (edge: Edge) => {
    if (!currentStep?.currentPath) return false;
    const path = currentStep.currentPath;
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === edge.from && path[i + 1] === edge.to) {
        return true;
      }
    }
    return false;
  };

  const isEdgeInFinalPath = (edge: Edge) => {
    if (!currentStep?.finalPath) return false;
    const path = currentStep.finalPath;
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === edge.from && path[i + 1] === edge.to) {
        return true;
      }
    }
    return false;
  };

  const isEdgeExplored = (edge: Edge) => {
    if (!currentStep?.exploredEdges) return false;
    return currentStep.exploredEdges.includes(`${edge.from}-${edge.to}`);
  };

  const getEdgeColor = (edge: Edge) => {
    if (editingEdge && editingEdge.from === edge.from && editingEdge.to === edge.to) {
      return '#F59E0B'; // Orange for editing
    }
    if (hoveredEdge && hoveredEdge.from === edge.from && hoveredEdge.to === edge.to) {
      return '#6366F1'; // Indigo for hovered
    }
    if (isEdgeInFinalPath(edge)) return '#10B981'; // Green for final path
    if (isEdgeInPath(edge)) return '#F59E0B'; // Orange for current path
    if (isEdgeExplored(edge)) return '#8B5CF6'; // Purple for explored
    return '#D1D5DB'; // Gray for default
  };

  const getEdgeWidth = (edge: Edge) => {
    if (editingEdge && editingEdge.from === edge.from && editingEdge.to === edge.to) {
      return 4;
    }
    if (hoveredEdge && hoveredEdge.from === edge.from && hoveredEdge.to === edge.to) {
      return 3;
    }
    if (isEdgeInFinalPath(edge)) return 4;
    if (isEdgeInPath(edge)) return 3;
    if (isEdgeExplored(edge)) return 2;
    return 2;
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, width: number) => {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;
    
    const endX = toX - Math.cos(angle) * 30;
    const endY = toY - Math.sin(angle) * 30;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  const isPointOnEdge = (x: number, y: number, edge: Edge): boolean => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return false;

    // Calculate distance from point to line segment
    const A = x - fromNode.x;
    const B = y - fromNode.y;
    const C = toNode.x - fromNode.x;
    const D = toNode.y - fromNode.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
      xx = fromNode.x;
      yy = fromNode.y;
    } else if (param > 1) {
      xx = toNode.x;
      yy = toNode.y;
    } else {
      xx = fromNode.x + param * C;
      yy = fromNode.y + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy) < 15; // 15px tolerance
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const color = getEdgeColor(edge);
      const width = getEdgeWidth(edge);

      // Draw edge line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();

      // Draw arrow
      drawArrow(ctx, fromNode.x, fromNode.y, toNode.x, toNode.y, color, width);

      // Draw edge cost
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      
      // Background for cost label
      const isHighlighted = (editingEdge && editingEdge.from === edge.from && editingEdge.to === edge.to) ||
                           (hoveredEdge && hoveredEdge.from === edge.from && hoveredEdge.to === edge.to);
      
      ctx.fillStyle = isHighlighted ? '#FEF3C7' : 'white';
      ctx.fillRect(midX - 18, midY - 14, 36, 24);
      ctx.strokeStyle = color;
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.strokeRect(midX - 18, midY - 14, 36, 24);
      
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(edge.cost.toString(), midX, midY + 4);

      // Edit mode indicator
      if (mode === 'edit' && isHighlighted) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = '12px sans-serif';
        ctx.fillText('✏️', midX + 15, midY - 10);
      }
    });

    // Draw path animation
    if (currentStep?.currentPath && currentStep.currentPath.length > 1) {
      const path = currentStep.currentPath;
      for (let i = 0; i < path.length - 1; i++) {
        const fromNode = nodes.find(n => n.id === path[i]);
        const toNode = nodes.find(n => n.id === path[i + 1]);
        if (!fromNode || !toNode) continue;

        // Animated path line
        const progress = (animationFrame * 0.1) % 1;
        const x = fromNode.x + (toNode.x - fromNode.x) * progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      const radius = getNodeRadius(node);
      const color = getNodeColor(node);
      const isHighlighted = editingNode === node.id || hoveredNode === node.id;

      // Node shadow
      ctx.beginPath();
      ctx.arc(node.x + 2, node.y + 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? '#FCD34D' : '#fff';
      ctx.lineWidth = isHighlighted ? 4 : 3;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y + 5);

      // Node values (below node)
      ctx.fillStyle = '#374151';
      ctx.font = '11px monospace';
      let valueText = '';
      
      if (currentStep) {
        const frontierNode = currentStep.frontier.find(f => f.nodeId === node.id);
        if (frontierNode) {
          switch (mode) {
            case 'view':
              if (frontierNode.pathCost !== undefined) valueText += `g=${frontierNode.pathCost} `;
              if (frontierNode.heuristic !== undefined) valueText += `h=${frontierNode.heuristic} `;
              if (frontierNode.fCost !== undefined) valueText += `f=${frontierNode.fCost}`;
              break;
          }
        } else if (currentStep.currentNode === node.id) {
          if (currentStep.pathCost !== undefined) valueText += `g=${currentStep.pathCost} `;
          if (currentStep.heuristic !== undefined) valueText += `h=${currentStep.heuristic} `;
          if (currentStep.totalCost !== undefined) valueText += `f=${currentStep.totalCost}`;
        }
      }
      
      if (!valueText) {
        valueText = `h=${node.heuristic}`;
      }
      
      // Background for value text
      const textWidth = ctx.measureText(valueText).width;
      ctx.fillStyle = isHighlighted ? '#FEF3C7' : 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(node.x - textWidth/2 - 4, node.y + radius + 8, textWidth + 8, 16);
      ctx.strokeStyle = isHighlighted ? '#F59E0B' : '#E5E7EB';
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.strokeRect(node.x - textWidth/2 - 4, node.y + radius + 8, textWidth + 8, 16);
      
      ctx.fillStyle = '#374151';
      ctx.fillText(valueText, node.x, node.y + radius + 20);

      // Edit mode indicator
      if (mode === 'edit' && isHighlighted) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = '14px sans-serif';
        ctx.fillText('✏️', node.x + radius - 10, node.y - radius + 10);
      }
    });
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, currentStep, selectedNodes, mode, animationFrame, editingNode, editingEdge, hoveredNode, hoveredEdge]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 30;
    });

    if (clickedNode) {
      if (mode === 'edit') {
        setDraggedNode(clickedNode.id);
        setDragOffset({ x: x - clickedNode.x, y: y - clickedNode.y });
      }
      onNodeClick(clickedNode.id);
    } else {
      onCanvasClick(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle dragging
    if (draggedNode && mode === 'edit') {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      onNodeDrag(draggedNode, newX, newY);
      return;
    }

    // Handle hover effects
    const hoveredNodeId = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 30;
    })?.id || null;

    const hoveredEdgeData = edges.find(edge => isPointOnEdge(x, y, edge));
    const hoveredEdgeId = hoveredEdgeData ? { from: hoveredEdgeData.from, to: hoveredEdgeData.to } : null;

    setHoveredNode(hoveredNodeId);
    setHoveredEdge(hoveredEdgeId);

    // Update cursor
    if (hoveredNodeId || hoveredEdgeId) {
      canvas.style.cursor = mode === 'edit' ? 'pointer' : 'pointer';
    } else {
      canvas.style.cursor = mode === 'addNode' ? 'crosshair' : 'default';
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
    setHoveredEdge(null);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 30;
    });

    if (clickedNode) {
      onNodeDoubleClick(clickedNode.id);
      return;
    }

    // Check if clicking on an edge
    const clickedEdge = edges.find(edge => isPointOnEdge(x, y, edge));
    if (clickedEdge) {
      onEdgeDoubleClick(clickedEdge.from, clickedEdge.to);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-gray-200 bg-gray-50 rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
      />
      
      {/* Mode indicator */}
      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-sm border text-sm font-medium">
        {mode === 'view' && 'Chế độ xem - Click node/edge để chỉnh sửa'}
        {mode === 'edit' && 'Chế độ chỉnh sửa - Click để chọn, kéo để di chuyển'}
        {mode === 'addNode' && 'Click để thêm node'}
        {mode === 'addEdge' && 'Click 2 node để tạo edge'}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm border text-xs text-gray-600 max-w-xs">
        <h4 className="font-semibold mb-2">Chú thích màu sắc:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Goal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Frontier</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-green-500"></div>
            <span>Path</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-sm border text-xs text-gray-600 max-w-xs">
        {mode === 'view' && (
          <div>
            <p>• Click Play để chạy thuật toán</p>
            <p>• Click node/edge để chỉnh sửa</p>
            <p>• Hover để xem chi tiết</p>
          </div>
        )}
        {mode === 'edit' && (
          <div>
            <p>• Click node/edge để mở panel chỉnh sửa</p>
            <p>• Kéo thả để di chuyển node</p>
            <p>• Double-click để chỉnh sửa nhanh</p>
          </div>
        )}
        {mode === 'addNode' && 'Click vào canvas để thêm node mới'}
        {mode === 'addEdge' && 'Click vào 2 node để tạo edge kết nối'}
      </div>
    </div>
  );
};

export default GraphCanvas;