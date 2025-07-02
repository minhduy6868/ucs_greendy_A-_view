import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import GraphVisualization from './GraphVisualization';

interface AlgorithmSectionProps {
  id: string;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green';
  algorithm: 'ucs' | 'greedy' | 'astar';
}

const AlgorithmSection: React.FC<AlgorithmSectionProps> = ({
  id,
  title,
  description,
  color,
  algorithm
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      accent: 'bg-blue-500',
      text: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-blue-100'
    },
    purple: {
      bg: 'bg-purple-50',
      accent: 'bg-purple-500',
      text: 'text-purple-600',
      border: 'border-purple-200',
      gradient: 'from-purple-50 to-purple-100'
    },
    green: {
      bg: 'bg-green-50',
      accent: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-200',
      gradient: 'from-green-50 to-green-100'
    }
  };

  const classes = colorClasses[color];

  const getAlgorithmDetails = () => {
    switch (algorithm) {
      case 'ucs':
        return {
          complexity: 'O(b^(C*/ε))',
          optimal: true,
          complete: true,
          spaceComplexity: 'O(b^(C*/ε))',
          description: 'UCS mở rộng node có chi phí path thấp nhất. Sử dụng priority queue để lưu trữ frontier.',
          steps: [
            'Khởi tạo frontier với node gốc, cost = 0',
            'Lặp: chọn node có cost thấp nhất từ frontier',
            'Nếu node là goal, trả về solution',
            'Mở rộng node: thêm các node con vào frontier',
            'Cập nhật cost cho các node đã thấy nếu tìm được path tốt hơn'
          ]
        };
      case 'greedy':
        return {
          complexity: 'O(b^m)',
          optimal: false,
          complete: false,
          spaceComplexity: 'O(b^m)',
          description: 'Greedy chọn node có heuristic value thấp nhất (gần goal nhất). Nhanh nhưng có thể không tối ưu.',
          steps: [
            'Khởi tạo frontier với node gốc',
            'Lặp: chọn node có h(n) thấp nhất từ frontier',
            'Nếu node là goal, trả về solution',
            'Mở rộng node: thêm các node con vào frontier',
            'Tiếp tục cho đến khi tìm thấy goal hoặc frontier rỗng'
          ]
        };
      case 'astar':
        return {
          complexity: 'O(b^d)',
          optimal: true,
          complete: true,
          spaceComplexity: 'O(b^d)',
          description: 'A* kết hợp UCS và Greedy: f(n) = g(n) + h(n). Tối ưu nếu heuristic admissible.',
          steps: [
            'Khởi tạo frontier với node gốc, f(n) = g(n) + h(n)',
            'Lặp: chọn node có f(n) thấp nhất từ frontier',
            'Nếu node là goal, trả về solution',
            'Mở rộng node: tính f(n) cho các node con',
            'Cập nhật nếu tìm được path tốt hơn đến node đã thấy'
          ]
        };
    }
  };

  const details = getAlgorithmDetails();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <section id={id} className={`py-20 ${classes.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Algorithm Visualization */}
          <div className={`bg-white rounded-2xl p-8 shadow-lg border ${classes.border}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Visualization</h3>
              <div className="flex gap-2">
                <button
                  onClick={togglePlay}
                  className={`p-3 ${classes.accent} text-white rounded-xl hover:opacity-90 transition-opacity`}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={reset}
                  className="p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <GraphVisualization algorithm={algorithm} isPlaying={isPlaying} currentStep={currentStep} />
          </div>

          {/* Algorithm Details */}
          <div className="space-y-6">
            {/* Properties */}
            <div className={`bg-gradient-to-br ${classes.gradient} p-6 rounded-2xl border ${classes.border}`}>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Tính Chất Thuật Toán</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Độ phức tạp thời gian</p>
                  <p className="font-mono text-lg text-gray-900">{details.complexity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Độ phức tạp không gian</p>
                  <p className="font-mono text-lg text-gray-900">{details.spaceComplexity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tối ưu</p>
                  <p className={`text-lg font-semibold ${details.optimal ? 'text-green-600' : 'text-red-600'}`}>
                    {details.optimal ? 'Có' : 'Không'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hoàn chỉnh</p>
                  <p className={`text-lg font-semibold ${details.complete ? 'text-green-600' : 'text-red-600'}`}>
                    {details.complete ? 'Có' : 'Không'}
                  </p>
                </div>
              </div>
            </div>

            {/* Algorithm Steps */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Các Bước Thực Hiện</h4>
              <ol className="space-y-3">
                {details.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 w-6 h-6 ${classes.accent} text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5`}>
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Mô Tả Chi Tiết</h4>
              <p className="text-gray-700 leading-relaxed">{details.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlgorithmSection;