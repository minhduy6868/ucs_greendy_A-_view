import React from 'react';
import { SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

interface AlgorithmControlsProps {
  algorithm: 'ucs' | 'greedy' | 'astar';
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithm,
  currentStep,
  totalSteps,
  onStepChange,
  isPlaying
}) => {
  const getAlgorithmInfo = () => {
    switch (algorithm) {
      case 'ucs':
        return {
          name: 'Uniform Cost Search',
          color: 'blue',
          formula: 'f(n) = g(n)',
          description: 'Chọn node có chi phí path thấp nhất'
        };
      case 'greedy':
        return {
          name: 'Greedy Search',
          color: 'purple',
          formula: 'f(n) = h(n)',
          description: 'Chọn node có heuristic thấp nhất'
        };
      case 'astar':
        return {
          name: 'A* Search',
          color: 'green',
          formula: 'f(n) = g(n) + h(n)',
          description: 'Kết hợp chi phí thực tế và ước lượng'
        };
    }
  };

  const info = getAlgorithmInfo();
  const colorClasses = {
    blue: 'bg-blue-500 border-blue-200 text-blue-700',
    purple: 'bg-purple-500 border-purple-200 text-purple-700',
    green: 'bg-green-500 border-green-200 text-green-700'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{info.name}</h3>
        <div className={`inline-block px-3 py-1 rounded-lg text-sm font-mono bg-${info.color}-50 ${colorClasses[info.color]}`}>
          {info.formula}
        </div>
        <p className="text-gray-600 text-sm mt-2">{info.description}</p>
      </div>

      {/* Step Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Bước hiện tại</span>
          <span className="text-lg font-bold text-gray-900">
            {currentStep + 1} / {totalSteps || 1}
          </span>
        </div>

        {/* Step Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onStepChange(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Bắt đầu</span>
            <span>Kết thúc</span>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onStepChange(0)}
            disabled={currentStep === 0 || isPlaying}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || isPlaying}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(totalSteps - 1)}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Algorithm Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Chú thích màu sắc</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Start node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Goal node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Node hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Node đã thăm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Node trong frontier</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmControls;