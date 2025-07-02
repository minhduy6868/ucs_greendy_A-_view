import React from 'react';
import { BookOpen, Github, Mail, Heart, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AlgoLearn</h3>
                <p className="text-sm text-gray-400">Học Thuật Toán Tìm Kiếm</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Nền tảng học tập trực tuyến giúp bạn hiểu sâu về các thuật toán tìm kiếm
              thông qua visualization tương tác và giải thích chi tiết.
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Được phát triển bởi:</p>
              <p className="text-white font-semibold">MinhDuy</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/minhduy6868"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/duy.nguyenminh.56679/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:duynm.23it@gmail.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thuật Toán</h4>
            <ul className="space-y-2">
              <li><a href="#ucs" className="text-gray-300 hover:text-white transition-colors">UCS</a></li>
              <li><a href="#greedy" className="text-gray-300 hover:text-white transition-colors">Greedy Search</a></li>
              <li><a href="#astar" className="text-gray-300 hover:text-white transition-colors">A* Search</a></li>
              <li><a href="#comparison" className="text-gray-300 hover:text-white transition-colors">So Sánh</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tài Nguyên</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Bài Tập</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tài Liệu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Liên Hệ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for algorithm learners
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Duyy code lon ton © 2025 AlgoLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;