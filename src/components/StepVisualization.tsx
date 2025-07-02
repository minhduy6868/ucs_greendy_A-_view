import React from 'react';
import { AlgorithmStep } from './InteractiveDemo';
import { CheckCircle, Circle, ArrowRight, Target, MapPin, Route } from 'lucide-react';

interface StepVisualizationProps {
  steps: AlgorithmStep[];
  currentStep: number;
  algorithm: 'ucs' | 'greedy' | 'astar';
  onStepClick?: (step: number) => void;
}

const StepVisualization: React.FC<StepVisualizationProps> = ({
  steps,
  currentStep,
  algorithm,
  onStepClick
}) => {
  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Chi Tiết Từng Bước</h3>
        <p className="text-gray-500 text-center py-8">
          Nhấn Play để bắt đầu thuật toán
        </p>
      </div>
    );
  };

  const current = steps[currentStep];
  
  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Circle className="w-5 h-5 text-blue-500 fill-current" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getAlgorithmValues = (step: AlgorithmStep) => {
    switch (algorithm) {
      case 'ucs':
        return step.pathCost !== undefined ? `g(${step.currentNode}) = ${step.pathCost}` : '';
      case 'greedy':
        return step.heuristic !== undefined ? `h(${step.currentNode}) = ${step.heuristic}` : '';
      case 'astar':
        return step.totalCost !== undefined && step.pathCost !== undefined && step.heuristic !== undefined
          ? `f(${step.currentNode}) = ${step.pathCost} + ${step.heuristic} = ${step.totalCost}`
          : '';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'initialize':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'visit':
        return <Target className="w-4 h-4 text-orange-500" />;
      case 'found':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <Circle className="w-4 h-4 text-red-500" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Chi Tiết Từng Bước</h3>
      
      {/* Current Step Details */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          {getActionIcon(current.action)}
          <span className="text-sm font-semibold text-blue-700">Bước {current.step + 1}</span>
          <ArrowRight className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-600 capitalize">{current.action}</span>
        </div>
        <p className="text-gray-700 mb-2">{current.description}</p>
        
        {getAlgorithmValues(current) && (
          <div className="text-sm font-mono bg-white px-3 py-1 rounded border">
            {getAlgorithmValues(current)}
          </div>
        )}

        {/* Current Path Display */}
        {current.currentPath && current.currentPath.length > 1 && (
          <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <Route className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Đường đi hiện tại:</span>
            </div>
            <div className="text-sm text-orange-600 font-mono">
              {current.currentPath.join(' → ')}
            </div>
          </div>
        )}

        {/* Final Path Display */}
        {current.finalPath && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Đường đi tối ưu:</span>
            </div>
            <div className="text-sm text-green-600 font-mono">
              {current.finalPath.join(' → ')}
            </div>
          </div>
        )}
      </div>

      {/* Frontier and Visited */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            Frontier (sắp xếp theo {algorithm === 'ucs' ? 'g(n)' : algorithm === 'greedy' ? 'h(n)' : 'f(n)'})
          </h4>
          <div className="space-y-1">
            {current.frontier.length > 0 ? (
              current.frontier
                .sort((a, b) => {
                  switch (algorithm) {
                    case 'ucs': return a.pathCost - b.pathCost;
                    case 'greedy': return a.heuristic - b.heuristic;
                    case 'astar': return a.fCost - b.fCost;
                  }
                })
                .map((node, index) => (
                  <div key={node.nodeId} className={`px-2 py-1 rounded text-xs font-medium flex justify-between items-center ${
                    index === 0 ? 'bg-purple-200 text-purple-800 border border-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <span className="font-semibold">{node.nodeId}</span>
                    <span className="font-mono">
                      {algorithm === 'ucs' && `g=${node.pathCost}`}
                      {algorithm === 'greedy' && `h=${node.heuristic}`}
                      {algorithm === 'astar' && `f=${node.fCost} (g=${node.pathCost}+h=${node.heuristic})`}
                    </span>
                  </div>
                ))
            ) : (
              <span className="text-gray-400 text-xs">Trống</span>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Đã thăm ({current.visited.length} nodes)
          </h4>
          <div className="flex flex-wrap gap-1">
            {current.visited.map(nodeId => (
              <span key={nodeId} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                {nodeId}
              </span>
            ))}
            {current.visited.length === 0 && (
              <span className="text-gray-400 text-xs">Trống</span>
            )}
          </div>
        </div>
      </div>

      {/* Step Timeline */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Tiến trình (Click để nhảy đến bước)</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                index === currentStep ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => onStepClick?.(index)}
            >
              {getStepIcon(index)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getActionIcon(step.action)}
                  <p className="text-sm text-gray-700 truncate">{step.description}</p>
                </div>
                <p className="text-xs text-gray-500">
                  Node: {step.currentNode || 'N/A'} | 
                  Frontier: {step.frontier.length} | 
                  Visited: {step.visited.length}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepVisualization;