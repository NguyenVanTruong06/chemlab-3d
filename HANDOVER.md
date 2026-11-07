# 🚀 ChemLab 3D — Hướng Dẫn Bàn Giao & Tiếp Tục Dự Án (HANDOVER & SESSION STATE)

> **MỤC ĐÍCH FILE NÀY:**
> Khi đổi tài khoản (do hết quota hoặc chuyển máy), bạn hoặc AI ở phiên mới chỉ cần đọc file này là nắm bắt 100% ngữ cảnh dự án trong vài giây mà không bị đứt gãy tiến độ.
> **Quy trình kỹ thuật bắt buộc (Nguồn chuẩn):** Tuân thủ nghiêm ngặt [AGENTS.md](./AGENTS.md).

---

## 📌 1. Thông Tin Tài Nguyên Dự Án Trên Đám Mây

| Tài nguyên | Nền tảng | Đường dẫn liên kết | Mô tả |
| :--- | :--- | :--- | :--- |
| **Web App Live** | **GitHub Pages** | [nguyenvantruong06.github.io/chemlab-3d](https://nguyenvantruong06.github.io/chemlab-3d/) | Bản chạy thực tế công khai (Mở trên PC & Điện thoại) |
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
├── .agents/skills/            <-- TOÀN BỘ 87+ SKILLS (Mở trên điện thoại là có ngay)
├── .agent/                    <-- Symlink tương thích
├── docs/
│   ├── PRD_ChemLab_3D.md      <-- Bản PRD tải từ Google Docs về
│   └── data_backup/           <-- Dữ liệu hóa học THCS dạng CSV
├── HANDOVER.md                <-- File này (Lưu trạng thái phiên)
├── README.md                  <-- Giới thiệu dự án & Hướng dẫn cài đặt
├── package.json
├── index.html
├── vite.config.ts
├── scripts/
│   └── sync_data.py           <-- Script đồng bộ dữ liệu Sheets/CSV sang JSON
└── src/
    ├── main.tsx
    ├── App.tsx                <-- App v2.0: Vòng lặp động học 10Hz + Đếm ngược cứu hỏa 25s + Phím tắt Game
    ├── App.css                <-- Giao diện Fullscreen HUD tối giản (0 thanh bên lấn chiếm màn hình)
    ├── types/
    │   └── chemistry.ts       <-- Kiểu dữ liệu cho Bình chứa, Trạm tương tác (StationId), Hotbar 6 ô, Sự cố cháy nổ
    ├── data/
    │   ├── chemicals.json     <-- Dữ liệu Hóa chất THCS đồng bộ từ Sheets
    │   ├── reactions.json     <-- Dữ liệu Phản ứng THCS đồng bộ từ Sheets
    │   └── lessons.json       <-- Dữ liệu Bài học Lớp 8 - 9 đồng bộ từ Sheets
    ├── components/
    │   ├── OuterHubScreen.tsx <-- Giao diện Sảnh Ngoài: Hồ sơ học sinh, Streak, XP/Cấp bậc, Lộ trình Lớp 8 & 9, Sổ tay IUPAC, Huy hiệu, Bảng xếp hạng
    │   ├── StageFlowScreens.tsx <-- Luồng 3 Chặng: Chặng 1 (Lý thuyết & Cảnh báo an toàn) và Chặng 3 (Kiểm tra & Chấm 1-3 Sao)
    │   ├── LabCanvas.tsx      <-- Cầu nối React ↔ Three.js WebGL (Cầm đồ trên tay, Nổ mảnh vỡ, Lửa cháy lan)
    │   ├── MinimalHud.tsx     <-- HUD tối giản: Nút về Sảnh, Balo [B], Thanh Hotbar 6 ô [1..6], Chuyển sang Bước 3 Kiểm tra
    │   ├── BackpackModal.tsx  <-- Balo & Sổ tay [B]: Yêu cầu bài học, Lý thuyết, Trắc nghiệm, Túi đồ & Nhật ký phản ứng
    │   └── CabinetModal.tsx   <-- Tủ Hóa Chất [F]: Chọn lọ hóa chất song ngữ IUPAC + Tiếng Việt bỏ vào Balo
    ├── engine/
    │   ├── ChemistryEngine.ts <-- Bộ máy Hóa học & 6 Chặng bài học KHTN Lớp 8 - 9 (Danh pháp IUPAC + Tiếng Việt)
    │   ├── LearnerStore.ts    <-- Lưu trữ Hồ sơ học tập, Mở khóa tuần tự theo Khối, Chấm 1-3 Sao an toàn, Huy hiệu & Nhiệm vụ ngày
    │   └── SoundEffects.ts    <-- Bộ tổng hợp âm thanh Web Audio API (Rót chất lỏng, Cốc chạm, Nổ lớn, Còi báo cháy, Xịt CO2)
    └── scene/
        └── LabScene3D.ts      <-- Không gian 3D thực tế: Đi tới Tủ/Bồn rửa/Bình cứu hỏa CO2 treo tường, Góc nhìn tay cầm lọ/bình xịt
```

---

## ⚡ 4. Lệnh Khôi Phục Nhanh Khi Sang Tài Khoản / Phiên Mới

Nếu bạn bắt đầu một phiên trò chuyện mới hoặc đổi tài khoản, chỉ cần gửi tin nhắn sau cho AI:

> *"Đọc file `HANDOVER.md` trong repo `https://github.com/NguyenVanTruong06/chemlab-3d` và tiếp tục công việc tại Bước tiếp theo."*

Lệnh khởi động & kiểm chứng môi trường:
```bash
git clone https://github.com/NguyenVanTruong06/chemlab-3d.git
cd chemlab-3d
npm install
npm test
npm run dev
```

---

## 📋 5. Trạng Thái Hiện Tại & Bước Tiếp Theo

- [x] **Phiên 1 — Khởi tạo Hệ sinh thái Đám mây (Docs PRD + Sheets Data + GitHub + 87 Skills).**
- [x] **Nâng cấp v2.0 — Tối giản Giao diện 3D & Nhập vai Thực tế + Cháy nổ & Cứu hỏa 25 Giây.**
- [x] **Nâng cấp v3.0 — Sảnh Học Tập Ngoài (Outer Hub) + Lộ trình Chặng Lớp 8 & 9 + Gamification Toàn Diện:**
  - **Hồ sơ học sinh lưu tự động trên trình duyệt (`LearnerStore.ts`)**: Có mã định danh `studentId` sẵn sàng nối với Supabase/Firebase Auth ở bước sau.
  - **Bản đồ Chặng theo từng Khối độc lập (KHTN Lớp 8 & Lớp 9 — GDPT 2018)**: Hiển thị song ngữ Quốc tế (IUPAC) + Tiếng Việt (`Sodium hydroxide • Natri hiđroxit`). Trong mỗi khối, hoàn thành Chặng $N$ sẽ tự động mở khóa Chặng $N+1$. Cổng **Phòng Lab Tự Do 3D (Sandbox)** luôn mở sẵn ở Sảnh chính.
  - **Luồng 3 Bước Rõ Ràng (`StageFlowScreens.tsx`)**: `(1) Trạm Lý thuyết & Quy tắc An toàn` → `(2) Bước vào Phòng Lab 3D thực hành` → `(3) Trạm Kiểm tra & Tổng kết Điểm XP / 1–3 Sao` (nếu để nổ/cháy trong ca thực hành bài học sẽ bị giới hạn tối đa 2 Sao; Phòng Tự Do thử nổ thoải mái không trừ Sao).
  - **Động lực học tập (4 tính năng kết hợp)**: Điểm `XP` & Cấp bậc, Chuỗi ngày học liên tiếp (`🔥 Streak`) + 3 Nhiệm vụ hàng ngày, Bộ sưu tập 5 Huy hiệu & Sổ tay Hóa chất song ngữ IUPAC (`14 chất`), cùng Bảng xếp hạng (`Leaderboard`).
- [ ] **Bước tiếp theo (Giai đoạn 4):**
  1. Nối nguồn dữ liệu trực tiếp từ Google Sheets của bạn Sư phạm sang ứng dụng và tích hợp Đăng nhập đám mây thật (Supabase / Firebase) khi cần đồng bộ đa thiết bị.
  2. Bổ sung thêm dụng cụ nâng cao (Ống dẫn khí sục `CO2` vào `Ca(OH)2`, Kẹp đốt dây sắt trong bình `O2`) và mở rộng thêm các chương KHTN 8 - 9.
