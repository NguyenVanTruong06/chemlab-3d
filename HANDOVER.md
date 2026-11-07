# 🚀 ChemLab 3D — Hướng Dẫn Bàn Giao & Tiếp Tục Dự Án (HANDOVER & SESSION STATE)

> **MỤC ĐÍCH FILE NÀY:**
> Khi đổi tài khoản (do hết quota hoặc chuyển máy), bạn hoặc AI ở phiên mới chỉ cần đọc file này là nắm bắt 100% ngữ cảnh dự án trong vài giây mà không bị đứt gãy tiến độ.
> **Quy trình kỹ thuật bắt buộc (Nguồn chuẩn):** Tuân thủ nghiêm ngặt [AGENTS.md](./AGENTS.md).

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
    │   ├── LabCanvas.tsx      <-- Cầu nối React ↔ Three.js WebGL (Cầm đồ trên tay, Nổ mảnh vỡ, Lửa cháy lan)
    │   ├── MinimalHud.tsx     <-- HUD tối giản: Nút Balo [B], Thanh Hotbar 6 ô [1..6], Thanh thao tác gọn tại bàn, Báo cháy 25s
    │   ├── BackpackModal.tsx  <-- Balo & Sổ tay [B]: Yêu cầu bài học, Lý thuyết, Trắc nghiệm, Túi đồ & Nhật ký phản ứng
    │   └── CabinetModal.tsx   <-- Tủ Hóa Chất [F]: Chọn lọ hóa chất thực tế bỏ vào Balo / Thanh cầm tay
    ├── engine/
    │   ├── ChemistryEngine.ts <-- Bộ máy Hóa học & An toàn (H2SO4 đặc 98%, 4 kịch bản nổ vỡ cốc & phát hỏa)
    │   └── SoundEffects.ts    <-- Bộ tổng hợp âm thanh Web Audio API (Rót chất lỏng, Cốc chạm, Nổ lớn, Còi báo cháy, Xịt CO2)
    └── scene/
        └── LabScene3D.ts      <-- Không gian 3D thực tế: Đi tới Tủ/Bồn rửa/Bình cứu hỏa CO2 treo tường, Góc nhìn tay cầm lọ/bình xịt
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

- [x] **Phiên 1 — Khởi tạo Hệ sinh thái Đám mây:**
  - Xuất bản PRD trên Google Docs & Kho dữ liệu 4 tab trên Google Sheets (`App - Web ( STUDY )`).
  - Khởi tạo GitHub Repo `chemlab-3d`, tích hợp sẵn bộ **87+ Skills** trong `.agents/skills/`.
- [x] **Giai đoạn 1 & 2 — Căn phòng Lab 3D & Bộ máy Hóa học Thời gian thực (MVP v1.0).**
- [x] **Nâng cấp v2.0 — Tối giản Giao diện & Nhập vai Thực tế + Cháy nổ & Cứu hỏa 25 Giây:**
  - **Loại bỏ hoàn toàn 2 thanh Sidebar hai bên** để giải phóng toàn bộ không gian 3D. Thay bằng nút **`🎒 Balo / Yêu cầu [B]`**, thanh **Hotbar 6 ô cầm tay `[1]..[6]`**, và thanh thao tác ngữ cảnh siêu gọn chỉ hiện khi đứng trước Bàn Thí Nghiệm.
  - **Tương tác không gian vật lý thực tế:** Đi bộ (`WASD` / D-pad cảm ứng / Đi nhanh tới trạm) ra **Tủ Hóa Chất `[F]`** lấy lọ dung dịch cầm trên tay, ra **Bồn Rửa `[F]/[R]`** lấy `H2O` hoặc rửa/thay cốc vỡ, ra **Tường Phải `[F]`** giật chốt **Bình Chữa Cháy `CO2`**.
  - **4 Kịch bản Sai Quy Tắc Gây Nổ Vỡ Cốc & Hỏa Hoạn 25 Giây:**
    1. Đổ nước (`H2O`) trực tiếp vào `H2SO4` đặc 98% (`ACID_DILUTION_BLAST`) — đối chiếu với quy tắc chuẩn rót từ từ axit đặc vào nước an toàn.
    2. Thả mẩu lớn Natri kim loại (`>= 0.5g`) vào nước hoặc thả `Na` vào axit mạnh (`SODIUM_BLAST`).
    3. Bật đèn cồn ngay dưới bình đang sủi mạnh khí `H2` (`HYDROGEN_FIRE`).
    4. Đun cạn khô bình thủy tinh rỗng vượt `255°C` (`OVERHEAT_RUPTURE`).
  - **Cơ chế Cứu Hỏa Khẩn Cấp 25 Giây + Âm thanh Web Audio:** Khi nổ bốc cháy bàn thí nghiệm, còi báo động hú vang + đèn chớp đỏ trần nhà. Học sinh có **25.0 giây** để chạy tới tường phải lấy Bình `CO2`, chạy lại gần bàn (`<= 3.3m`) và giữ `SPACE` / nút Xịt để phun tuyết lạnh `CO2` dập lửa trước khi phòng Lab cháy rụi!
- [ ] **Bước tiếp theo (Giai đoạn 3):**
  1. Mở rộng thêm dụng cụ nâng cao (Ống dẫn khí sục `CO2` làm đục nước vôi trong `Ca(OH)2`, Kẹp sắt đốt dây `Fe` trong bình khí `O2`, Giấy quỳ tím cầm tay nhúng trực tiếp).
  2. Mở rộng danh mục hóa chất & bài học Lớp 8 - 9 từ Google Sheets của bạn Sư phạm (`FeCl2`, `FeCl3`, `AgNO3`, nhận biết mất nhãn).
  3. Cấu hình GitHub Actions tự động deploy bản Web lên GitHub Pages / Vercel để chia sẻ link chạy ngay trên điện thoại và máy tính cho học sinh thử nghiệm.
