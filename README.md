# 🧪 ChemLab 3D — Phòng Thí Nghiệm Hóa Học 3D Thời Gian Thực

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)

> **"Học đi đôi với Hành"** — Nền tảng thực hành Hóa học 3D trực tiếp trên trình duyệt Web dành cho học sinh THCS (Lớp 8 - 9). Giải quyết bài toán thiếu thốn trang thiết bị, thời lượng thực hành ít và rủi ro từ các thí nghiệm hóa học nguy hiểm.

---

## 🌟 Điểm Nổi Bật

1. **Không gian 3D Nhập vai & Đa góc nhìn:**
   - Di chuyển tự do trong phòng thí nghiệm ảo (`WASD`/Chuột) lấy hóa chất tại tủ kệ.
   - Chuyển đổi linh hoạt sang góc nhìn cận cảnh tại bàn thí nghiệm để thao tác chính xác với ống nghiệm, cốc Beaker, đèn cồn và pipet.

2. **Bộ máy Hóa học Thời gian thực (Real-time Chemical State Engine):**
   - Không dùng video hay hoạt ảnh cứng! Mọi phản ứng được tính toán động lực học dựa trên:
     - Số mol $n$, thể tích dung dịch $V$ (ml), nồng độ mol $C_M = n / V$.
     - Nhiệt độ đun nóng $T$ (°C) từ đèn cồn và nhiệt phản ứng $\Delta H$.
     - Độ pH và chuyển dịch màu sắc chất chỉ thị.
     - Biện luận chất dư (ví dụ: nhỏ dư kiềm làm tan kết tủa keo).

3. **Lộ trình Học tập Phân tầng & Phòng Thí nghiệm Tự do (Sandbox):**
   - **Chế độ Lớp học:** Đi theo bài học SGK (Lý thuyết cô đọng $\rightarrow$ Thực hành theo nhiệm vụ $\rightarrow$ Kiểm tra đánh giá).
   - **Chế độ Sandbox:** Không giới hạn dụng cụ và hóa chất để học sinh thỏa sức thử nghiệm phản ứng nguy hiểm an toàn tuyệt đối.

4. **Mô hình Hợp tác IT × Sư phạm Trên Đám Mây:**
   - Chuyên môn Hóa học được cập nhật trực tiếp qua Google Sheets mà không cần chỉnh sửa code.
   - Hệ thống tự động đồng bộ sang định dạng dữ liệu JSON của Web App.

---

## 📚 Tài Liệu Dự Án (Lưu Trữ Google Drive)

- 📄 **Tài liệu Thiết kế Hệ thống (PRD):** [Xem trên Google Docs](https://docs.google.com/document/d/1Evfu-t0SZyucjOfgeXoJeBzEpOqkc0qpMXkli6WrphU/edit)
- 📊 **Kho Dữ liệu Hóa chất & Phản ứng:** [Xem trên Google Sheets](https://docs.google.com/spreadsheets/d/1CdPqaPGGu83QvpskbboIhmOoZg5pYqUep06nBhJtLZk/edit)
- 🔄 **Bàn giao phiên & Hướng dẫn đổi tài khoản:** [Xem HANDOVER.md](HANDOVER.md)

---

## 🚀 Cài Đặt & Chạy Thử (Local Development)

Yêu cầu môi trường: **Node.js 18+**

```bash
# 1. Clone repository
git clone https://github.com/NguyenVanTruong06/chemlab-3d.git
cd chemlab-3d

# 2. Cài đặt thư viện
npm install

# 3. Đồng bộ dữ liệu mới nhất (nếu có cập nhật)
python3 scripts/sync_data.py

# 4. Khởi chạy dev server
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

---

## 👨‍💻 Đội Ngũ Phát Triển

- **Kỹ thuật (IT / Graphics & Software Engine):** Nguyễn Văn Trường ([@NguyenVanTruong06](https://github.com/NguyenVanTruong06))
- **Cố vấn Chuyên môn & Sư phạm:** Nhóm Sư phạm Khoa học Tự nhiên (Lý - Hóa - Sinh)
