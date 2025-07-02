import React, { useState } from 'react';
import { ChevronRight, Play, BookOpen, Zap, Target, BarChart3, Code, Users } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import InteractiveDemo from './components/InteractiveDemo';
import AlgorithmSection from './components/AlgorithmSection';
import Comparison from './components/Comparison';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
        <Hero />
        
        {/* Interactive Demo Section - Main Focus */}
        <InteractiveDemo />
        
        <section id="algorithms" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
               Duy code lon ton -  Khám Phá Thuật Toán Tìm Kiếm
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tìm hiểu cách hoạt động của ba thuật toán tìm kiếm quan trọng nhất trong khoa học máy tính
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Uniform Cost Search (UCS)</h3>
                <p className="text-gray-600 mb-6">Tìm kiếm theo chi phí đồng nhất, đảm bảo tìm được đường đi có chi phí thấp nhất.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-blue-500" />Tối ưu và hoàn chỉnh</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-blue-500" />Sử dụng priority queue</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-blue-500" />Phù hợp với chi phí khác nhau</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Greedy Search</h3>
                <p className="text-gray-600 mb-6">Thuật toán tham lam chọn bước tiếp theo dựa trên heuristic function.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-purple-500" />Nhanh và hiệu quả</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-purple-500" />Sử dụng heuristic</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-purple-500" />Không đảm bảo tối ưu</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">A* Search</h3>
                <p className="text-gray-600 mb-6">Kết hợp UCS và Greedy, sử dụng f(n) = g(n) + h(n) để tìm kiếm tối ưu.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-green-500" />Tối ưu với heuristic admissible</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-green-500" />Cân bằng tốc độ và chất lượng</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-green-500" />Được sử dụng rộng rãi</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <AlgorithmSection 
          id="ucs"
          title="Uniform Cost Search (UCS)"
          description="UCS mở rộng node có chi phí path thấp nhất từ node gốc. Thuật toán này đảm bảo tìm được đường đi có chi phí tối ưu."
          color="blue"
          algorithm="ucs"
        />

        <AlgorithmSection 
          id="greedy"
          title="Greedy Search"
          description="Greedy Search chọn node có giá trị heuristic thấp nhất (gần đích nhất). Nhanh nhưng không đảm bảo tối ưu."
          color="purple"
          algorithm="greedy"
        />

        <AlgorithmSection 
          id="astar"
          title="A* Search"
          description="A* kết hợp chi phí thực tế g(n) và ước lượng heuristic h(n). Công thức: f(n) = g(n) + h(n)."
          color="green"
          algorithm="astar"
        />

        <Comparison />
      </main>

      <Footer />
    </div>
  );
}

export default App;