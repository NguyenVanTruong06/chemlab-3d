# 🚀 ChemLab 3D — Hướng Dẫn Bàn Giao & Tiếp Tục Dự Án (HANDOVER & SESSION STATE)

> **MỤC ĐÍCH FILE NÀY:**
> Khi đổi tài khoản (do hết quota hoặc chuyển máy), bạn hoặc AI ở phiên mới chỉ cần đọc file này là nắm bắt 100% ngữ cảnh dự án trong vài giây mà không bị đứt gãy tiến độ.

---

## 📌 1. Thông Tin Tài Nguyên Dự Án Trên Đám Mây

| Tài nguyên | Nền tảng | Đường dẫn liên kết | Mô tả |
| :--- | :--- | :--- | :--- |
| **Source Code** | **GitHub** | [NguyenVanTruong06/chemlab-3d](https://github.com/NguyenVanTruong06/chemlab-3d) | Kho mã nguồn chính thức (React + Three.js) |
| **Tài liệu PRD** | **Google Docs** | [01. [PRD] ChemLab 3D Spec](https://docs.google.com/document/d/1Evfu-t0SZyucjOfgeXoJeBzEpOqkc0qpMXkli6WrphU/edit) | Tài liệu đặc tả kiến trúc, đồ họa 3D & lộ trình |
| **Kho Dữ Liệu** | **Google Sheets** | [02. [DATA] ChemLab 3D Database](https://docs.google.com/spreadsheets/d/1CdPqaPGGu83QvpskbboIhmOoZg5pYqUep06nBhJtLZk/edit) | 4 Tab: Hóa chất, Phản ứng, Bài học, Hướng dẫn Sư phạm |
| **Thư mục Drive** | **Google Drive** | `App - Web ( STUDY )` (`1Dvs8jDXoaKaxs2IILgdx61pkDZU46vxh`) | Thư mục gốc chứa tài liệu chung |

---

## 🎯 2. Ý Tưởng & Mục Tiêu Cốt Lõi

- **Bài toán:** Học sinh học Hóa khô khan, thiếu thực hành, thí nghiệm ở trường nguy hiểm hoặc thiếu thiết bị.
- **Giải pháp:** Web App 3D mô phỏng phòng thí nghiệm thực tế:
  1. **Không gian 3D nhập vai:** Người học di chuyển tự do (`WASD`), đổi góc nhìn linh hoạt từ đi lại trong phòng sang góc nhìn cận cảnh tại bàn thí nghiệm để thao tác chính xác với chuột/cảm ứng.
  2. **Bộ máy Hóa học thời gian thực (Real-time Chemical State Engine):** Tính toán nồng độ mol ($C_M$), số mol ($n$), thể tích ($V$), nhiệt độ đun nóng ($T$), và pH ở từng khung hình; hỗ trợ hiện tượng đổ dư (ví dụ: NaOH dư làm tan kết tủa keo trắng Al(OH)₃).
  3. **2 Phân hệ:** (A) Lộ trình học phân tầng Lớp 8 - 9 (Lý thuyết -> Thực hành nhiệm vụ -> Kiểm tra); (B) Phòng Thí nghiệm Tự do (Sandbox) không giới hạn.
- **Mô hình phối hợp IT × Sư phạm:**
  - **IT (Bạn):** Phát triển 3D Web App, Engine tính toán hóa học, Shaders/hiệu ứng chất lỏng.
  - **Sư phạm (Bạn đồng hành):** Nhập trực tiếp danh mục Hóa chất, Phương trình phản ứng, Kịch bản bài học lên Google Sheets.

---

## 🏗️ 3. Cấu Trúc Thư Mục Repository

```text
chemlab-3d/
├── .gitignore
├── HANDOVER.md                <-- File này (Lưu trạng thái phiên)
├── README.md                  <-- Giới thiệu dự án & Hướng dẫn cài đặt
├── package.json
├── index.html
├── vite.config.ts
├── scripts/
│   └── sync_data.py           <-- Script đồng bộ dữ liệu Sheets/CSV sang JSON
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── data/
    │   ├── chemicals.json     <-- 12 Hóa chất THCS mẫu
    │   ├── reactions.json     <-- 8 Phản ứng THCS đặc trưng
    │   └── lessons.json       <-- 4 Bài học Lớp 8 - 9 chuẩn GDPT
    ├── components/            <-- UI Components (HUD, Toolbar, Quiz)
    ├── engine/                <-- Real-time Chemical State Engine
    │   ├── ChemicalContainer.ts
    │   └── ReactionSolver.ts
    └── scene/                 <-- Three.js 3D Room, Lab Bench, Apparatus
        ├── LabRoom.tsx
        ├── Workbench.tsx
        └── CameraController.tsx
```

---

## ⚡ 4. Lệnh Khôi Phục Nhanh Khi Sang Tài Khoản / Phiên Mới

Nếu bạn bắt đầu một phiên trò chuyện mới hoặc đổi tài khoản, chỉ cần gửi tin nhắn sau cho AI:

> *"Đọc file `HANDOVER.md` trong repo `https://github.com/NguyenVanTruong06/chemlab-3d` và tiếp tục công việc tại Bước tiếp theo."*

Lệnh khởi động môi trường:
```bash
git clone https://github.com/NguyenVanTruong06/chemlab-3d.git
cd chemlab-3d
npm install
npm run dev
```

---

## 📋 5. Trạng Thái Hiện Tại & Bước Tiếp Theo

- [x] **Phiên 1:** Thống nhất ý tưởng, phạm vi (THCS Lớp 8-9 + Real-time engine + 3D Space).
- [x] **Khởi tạo PRD trên Google Docs:** Đã xuất bản vào thư mục `App - Web ( STUDY )`.
- [x] **Khởi tạo Cơ sở dữ liệu trên Google Sheets:** Đã xuất bản 4 tab dữ liệu chuẩn hóa vào `App - Web ( STUDY )`.
- [x] **Khởi tạo GitHub Repo:** Đã tạo repo `chemlab-3d`, scaffold Vite + React + Three.js, sync JSON data.
- [ ] **Bước tiếp theo (Phiên 2):**
  1. Lập trình module `ChemicalState` và `ReactionSolver` (tính số mol, nồng độ mol, pH, nhiệt độ, kết tủa).
  2. Dựng căn phòng Lab 3D với Three.js (Sàn, Tường, Kệ hóa chất, Bàn thí nghiệm, Đèn chiếu sáng, Điều khiển góc nhìn).
  3. Xây dựng bản chạy thử nghiệm đầu tiên (Interactive 3D Prototype) để người dùng thao tác rót dung dịch và xem phản ứng trực tiếp.
