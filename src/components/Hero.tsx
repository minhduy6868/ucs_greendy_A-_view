import React from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAlgorithms = () => {
    const element = document.getElementById('algorithms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-16 pb-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Học Thuật Toán Một Cách Trực Quan
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Thuật Toán Tìm Kiếm
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              UCS • Greedy • A*
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Khám phá và hiểu sâu về các thuật toán tìm kiếm quan trọng nhất trong khoa học máy tính. 
            Từ lý thuyết đến thực hành với visualization tương tác và ví dụ cụ thể.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToDemo}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Thử Demo Ngay
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <button 
              onClick={scrollToAlgorithms}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
            >
              Tìm Hiểu Lý Thuyết
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Tương Tác</h3>
            <p className="text-gray-600">Tạo graph của riêng bạn và xem thuật toán hoạt động step-by-step</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Visualization Trực Quan</h3>
            <p className="text-gray-600">Xem thuật toán hoạt động từng bước một cách trực quan và dễ hiểu</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Điều Khiển Chi Tiết</h3>
            <p className="text-gray-600">Tạm dừng, tua lại, và phân tích từng bước của thuật toán</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;