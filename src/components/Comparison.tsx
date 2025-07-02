import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const Comparison: React.FC = () => {
  const algorithms = [
    {
      name: 'Uniform Cost Search (UCS)',
      color: 'blue',
      timeComplexity: 'O(b^(C*/ε))',
      spaceComplexity: 'O(b^(C*/ε))',
      optimal: true,
      complete: true,
      pros: [
        'Đảm bảo tìm được solution tối ưu',
        'Hoàn chỉnh (complete)',
        'Phù hợp khi chi phí edge khác nhau'
      ],
      cons: [
        'Có thể chậm khi không có heuristic',
        'Sử dụng nhiều bộ nhớ',
        'Khám phá nhiều node không cần thiết'
      ],
      bestFor: 'Khi cần solution tối ưu và có chi phí edge khác nhau'
    },
    {
      name: 'Greedy Search',
      color: 'purple',
      timeComplexity: 'O(b^m)',
      spaceComplexity: 'O(b^m)',
      optimal: false,
      complete: false,
      pros: [
        'Nhanh và hiệu quả',
        'Sử dụng ít bộ nhớ hơn',
        'Dễ hiểu và implement'
      ],
      cons: [
        'Không đảm bảo solution tối ưu',
        'Có thể bị stuck trong local minima',
        'Phụ thuộc vào chất lượng heuristic'
      ],
      bestFor: 'Khi cần solution nhanh và có heuristic tốt'
    },
    {
      name: 'A* Search',
      color: 'green',
      timeComplexity: 'O(b^d)',
      spaceComplexity: 'O(b^d)',
      optimal: true,
      complete: true,
      pros: [
        'Tối ưu với heuristic admissible',
        'Cân bằng tốc độ và chất lượng',
        'Được sử dụng rộng rãi'
      ],
      cons: [
        'Cần heuristic function tốt',
        'Sử dụng nhiều bộ nhớ',
        'Phức tạp hơn UCS và Greedy'
      ],
      bestFor: 'Hầu hết các bài toán tìm đường đi'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-blue-50';
      case 'purple':
        return 'border-purple-200 bg-purple-50';
      case 'green':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <section id="comparison" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            So Sánh Các Thuật Toán
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Phân tích ưu nhược điểm và trường hợp sử dụng của từng thuật toán
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-16">
          <table className="w-full bg-white rounded-2xl shadow-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thuật Toán</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Độ Phức Tạp Thời Gian</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Độ Phức Tạp Không Gian</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Tối Ưu</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Hoàn Chỉnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {algorithms.map((algo, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{algo.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{algo.timeComplexity}</code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{algo.spaceComplexity}</code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {algo.optimal ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {algo.complete ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Comparison Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {algorithms.map((algo, index) => (
            <div key={index} className={`rounded-2xl border-2 p-8 ${getColorClasses(algo.color)}`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{algo.name}</h3>
              
              {/* Pros */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  Ưu Điểm
                </h4>
                <ul className="space-y-2">
                  {algo.pros.map((pro, proIndex) => (
                    <li key={proIndex} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <X className="w-5 h-5 text-red-600 mr-2" />
                  Nhược Điểm
                </h4>
                <ul className="space-y-2">
                  {algo.cons.map((con, conIndex) => (
                    <li key={conIndex} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For */}
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Phù Hợp Nhất Cho
                </h4>
                <p className="text-sm text-gray-700">{algo.bestFor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Kết Luận</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">UCS</h4>
              <p className="text-sm text-gray-600">Chọn khi cần solution tối ưu và có chi phí edge khác nhau</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Greedy</h4>
              <p className="text-sm text-gray-600">Chọn khi cần solution nhanh và có heuristic tốt</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">A*</h4>
              <p className="text-sm text-gray-600">Lựa chọn tốt nhất cho hầu hết các bài toán tìm đường đi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;