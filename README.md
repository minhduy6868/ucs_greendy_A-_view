# AlgoLearn - Học Thuật Toán Tìm Kiếm

Nền tảng học tập trực tuyến giúp bạn hiểu sâu về các thuật toán tìm kiếm thông qua visualization tương tác và giải thích chi tiết.

## 🌐 Demo Live

🔗 **[Xem Demo Trực Tuyến](https://minhduyy-pathtrio-view.netlify.app)**

📂 **[GitHub Repository](https://github.com/minhduy6868/ucs_greendy_A-_view)**

## 🚀 Tính năng chính

- **Demo tương tác**: Trực quan hóa các thuật toán tìm kiếm trên đồ thị
- **3 thuật toán chính**:
  - Uniform Cost Search (UCS)
  - Greedy Search
  - A* Search
- **Giao diện thân thiện**: Thiết kế hiện đại với Tailwind CSS
- **Responsive**: Hoạt động tốt trên mọi thiết bị
- **Tiếng Việt**: Giao diện và nội dung hoàn toàn bằng tiếng Việt

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/minhduy6868/ucs_greendy_A-_view.git
cd ucs_greendy_A-_view
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Mở trình duyệt và truy cập `http://localhost:5173`

## 🏗️ Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── AlgorithmControls.tsx    # Điều khiển thuật toán
│   ├── AlgorithmSection.tsx     # Section hiển thị thuật toán
│   ├── Comparison.tsx           # So sánh các thuật toán
│   ├── EdgeEditPanel.tsx        # Panel chỉnh sửa cạnh
│   ├── Footer.tsx               # Footer trang web
│   ├── GraphCanvas.tsx          # Canvas vẽ đồ thị
│   ├── GraphVisualization.tsx   # Visualization đồ thị
│   ├── Header.tsx               # Header navigation
│   ├── Hero.tsx                 # Hero section
│   ├── InteractiveDemo.tsx      # Demo tương tác chính
│   ├── NodeEditPanel.tsx        # Panel chỉnh sửa node
│   └── StepVisualization.tsx    # Hiển thị từng bước
├── App.tsx                      # Component chính
├── main.tsx                     # Entry point
├── index.css                    # Global styles
└── vite-env.d.ts               # TypeScript definitions
```

## 🎯 Thuật toán được hỗ trợ

### 1. Uniform Cost Search (UCS)
- Tìm kiếm theo chi phí đồng nhất
- Đảm bảo tìm được đường đi có chi phí thấp nhất
- Sử dụng priority queue
- Tối ưu và hoàn chỉnh

### 2. Greedy Search
- Thuật toán tham lam
- Chọn bước tiếp theo dựa trên heuristic function
- Nhanh và hiệu quả
- Không đảm bảo tối ưu

### 3. A* Search
- Kết hợp UCS và Greedy Search
- Sử dụng công thức: f(n) = g(n) + h(n)
- Tối ưu với heuristic admissible
- Cân bằng tốc độ và chất lượng

## 🎨 Tính năng UI/UX

- **Responsive Design**: Hoạt động tốt trên desktop, tablet và mobile
- **Dark/Light Theme**: Giao diện tối và sáng
- **Smooth Animations**: Hiệu ứng mượt mà
- **Interactive Elements**: Các thành phần tương tác trực quan

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

**MinhDuy**
- GitHub: [@minhduy6868](https://github.com/minhduy6868)
- Repository: [ucs_greendy_A-_view](https://github.com/minhduy6868/ucs_greendy_A-_view)
- Demo: [PathTrio View](https://minhduyy-pathtrio-view.netlify.app)
- Facebook: [Duy Nguyen Minh](https://www.facebook.com/duy.nguyenminh.56679/)
- Email: duynm.23it@gmail.com

## 🙏 Lời cảm ơn

- Cảm ơn cộng đồng React và TypeScript
- Cảm ơn team Tailwind CSS cho framework tuyệt vời
- Cảm ơn Lucide cho bộ icon đẹp

---

⭐ Nếu dự án này hữu ích, hãy cho một star nhé!
