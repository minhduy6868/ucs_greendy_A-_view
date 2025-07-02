import React, { useEffect, useState } from 'react';

interface Node {
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
}

interface Edge {
  from: string;
  to: string;
  cost: number;
}

interface GraphVisualizationProps {
  algorithm: 'ucs' | 'greedy' | 'astar';
  isPlaying: boolean;
  currentStep: number;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  algorithm,
  isPlaying,
  currentStep
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [step, setStep] = useState(0);

  // Initialize graph
  useEffect(() => {
    const initialNodes: Node[] = [
      { id: 'S', x: 50, y: 200, cost: 0, heuristic: 10, isStart: true },
      { id: 'A', x: 150, y: 100, cost: 3, heuristic: 8 },
      { id: 'B', x: 150, y: 300, cost: 5, heuristic: 6 },
      { id: 'C', x: 250, y: 150, cost: 7, heuristic: 4 },
      { id: 'D', x: 250, y: 250, cost: 8, heuristic: 3 },
      { id: 'G', x: 350, y: 200, cost: 0, heuristic: 0, isGoal: true }
    ];

    const initialEdges: Edge[] = [
      { from: 'S', to: 'A', cost: 3 },
      { from: 'S', to: 'B', cost: 5 },
      { from: 'A', to: 'C', cost: 4 },
      { from: 'B', to: 'D', cost: 3 },
      { from: 'C', to: 'G', cost: 3 },
      { from: 'D', to: 'G', cost: 5 }
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  // Animation logic
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setStep(prev => prev + 1);
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  // Reset when algorithm changes
  useEffect(() => {
    setStep(0);
    setNodes(prev => prev.map(node => ({
      ...node,
      isVisited: false,
      isInFrontier: false,
      isCurrent: false
    })));
  }, [algorithm]);

  const getNodeColor = (node: Node) => {
    if (node.isStart) return '#3B82F6'; // Blue for start
    if (node.isGoal) return '#EF4444'; // Red for goal
    if (node.isCurrent) return '#F59E0B'; // Orange for current
    if (node.isVisited) return '#10B981'; // Green for visited
    if (node.isInFrontier) return '#8B5CF6'; // Purple for frontier
    return '#6B7280'; // Gray for unvisited
  };

  const getAlgorithmValue = (node: Node) => {
    switch (algorithm) {
      case 'ucs':
        return `g=${node.cost}`;
      case 'greedy':
        return `h=${node.heuristic}`;
      case 'astar':
        return `f=${node.cost + node.heuristic}`;
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 h-80 relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 400 400" className="border rounded-lg bg-white">
        {/* Draw edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <g key={index}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#D1D5DB"
                strokeWidth="2"
              />
              {/* Edge cost label */}
              <text
                x={(fromNode.x + toNode.x) / 2}
                y={(fromNode.y + toNode.y) / 2 - 10}
                fill="#6B7280"
                fontSize="12"
                textAnchor="middle"
                className="font-semibold"
              >
                {edge.cost}
              </text>
            </g>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="25"
              fill={getNodeColor(node)}
              stroke="#fff"
              strokeWidth="3"
              className="transition-all duration-500"
            />
            <text
              x={node.x}
              y={node.y + 5}
              fill="white"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {node.id}
            </text>
            {/* Algorithm-specific values */}
            <text
              x={node.x}
              y={node.y + 45}
              fill="#374151"
              fontSize="10"
              textAnchor="middle"
              className="font-mono"
            >
              {getAlgorithmValue(node)}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-lg shadow-sm border text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Goal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Frontier</span>
          </div>
        </div>
      </div>

      {/* Step counter */}
      <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg shadow-sm border text-sm font-semibold">
        Step: {step}
      </div>
    </div>
  );
};

export default GraphVisualization;