# ChemLab 3D — Tài liệu Thiết kế Dự án & Kiến trúc Hệ thống (PRD)

**Trạng thái: Phiên 1 — Khởi tạo Ý tưởng & Định hình Kiến trúc**  •  **Đội ngũ:** Kỹ thuật (IT) & Chuyên môn Sư phạm (Lý \- Hóa \- Sinh)  •  **Phân hệ MVP:** Hóa học THCS (KHTN Lớp 8 \- 9\)

## 1\. Tầm nhìn & Bài toán Cốt lõi (Problem & Vision)

Hiện nay, việc học các môn Khoa học Tự nhiên (Vật lý, Hóa học, Sinh học) ở bậc phổ thông đang gặp phải rào cản lớn về tính trực quan: học sinh phải ghi nhớ một lượng lớn lý thuyết, phương trình và hiện tượng trên giấy nhưng lại rất ít cơ hội thực hành thực tế. Nhiều trường học thiếu trang thiết bị hoặc hóa chất, thời lượng tiết thực hành ngắn, và đặc biệt là các thí nghiệm có tính nguy hiểm cao (như kim loại kiềm tác dụng với nước, phản ứng tỏa nhiệt mạnh, khí độc) hầu như chỉ được mô tả qua lời kể hoặc video thụ động.

Dự án ChemLab 3D ra đời nhằm giải quyết triệt để điểm đau "Học đi đôi với Hành". Thay vì chỉ bấm chọn đáp án trắc nghiệm hay xem hoạt ảnh 2D cố định, học sinh được bước vào một không gian phòng thí nghiệm 3D sống động ngay trên trình duyệt web — nơi các em tự tay di chuyển trong phòng, lấy hóa chất, lắp ráp dụng cụ, đun nóng, và quan sát phản ứng hóa học diễn ra theo đúng bản chất lượng chất thực tế.

**Định hướng Giai đoạn 1 (MVP):** Tập trung hoàn thiện 100% phân hệ môn Hóa học bậc THCS (Lớp 8 \- 9 theo chương trình KHTN). Đây là giai đoạn học sinh bắt đầu tiếp xúc với Hóa học, các hiện tượng đổi màu, kết tủa, sủi bọt khí, cháy nổ rất trực quan và tạo hứng thú mạnh mẽ nhất. Sau khi nền tảng 3D và bộ máy mô phỏng ổn định, kiến trúc sẽ mở rộng sang bậc THPT và hai phân môn Vật lý \- Sinh học.

## 2\. Mục tiêu & Giới hạn Phạm vi (Goals & Non-Goals)

Để đảm bảo dự án có thể phát triển bền vững giữa hai thành viên (1 IT \+ 1 Sư phạm) và làm việc linh hoạt trên đám mây, phạm vi của phiên bản đầu tiên được phân định rõ ràng như sau:

**Mục tiêu 1 (Không gian 3D nhập vai):** Xây dựng căn phòng thí nghiệm 3D trực tiếp trên Web (WebGL/Three.js), cho phép người học di chuyển tự do trong không gian phòng (WASD/Chuột), đổi góc nhìn linh hoạt từ toàn cảnh căn phòng sang góc nhìn cận cảnh tại bàn thí nghiệm để thao tác chính xác với dụng cụ.

**Mục tiêu 2 (Học tập phân tầng kết hợp Sandbox):** Tích hợp song song 2 chế độ: (A) Lộ trình học theo bài/lớp (Lý thuyết cô đọng → Phòng Lab thực hành theo kịch bản bài học → Kiểm tra đánh giá) và (B) Phòng thí nghiệm tự do (Sandbox) không giới hạn ngoài sảnh chính.

**Mục tiêu 3 (Mô phỏng động lực học phản ứng thực tế):** Engine hóa học tính toán theo thời gian thực dựa trên thể tích (ml), nồng độ mol (C\_M), số mol (n), nhiệt độ (°C) và độ pH. Ví dụ: Nhỏ từ từ NaOH vào AlCl₃ sẽ thấy kết tủa keo trắng tăng dần, nhưng nếu tiếp tục đổ dư NaOH thì kết tủa tan dần đến trong suốt.

**Giới hạn giai đoạn 1 (Non-Goal):** Chưa mô phỏng ở mức vật lý phân tử lượng tử (Quantum MD) gây nặng máy; chưa làm đồng thời Lý và Sinh trước khi khung Hóa học THCS chạy mượt trên trình duyệt phổ thông.

## 3\. Kiến trúc Trải nghiệm Sản phẩm (Product Pillars)

Hệ thống được chia làm 3 trụ cột trải nghiệm gắn kết chặt chẽ với nhau, giúp học sinh vừa nắm vững kiến thức trên trường, vừa thỏa mãn trí tò mò khoa học:

### 3.1. Chế độ Học theo Lộ trình Lớp học (Guided Curriculum Mode)

Nội dung được phân tầng theo Khối lớp (Lớp 8, Lớp 9\) → Chương → Bài học cụ thể. Mỗi bài học là một vòng lặp khép kín gồm 3 bước: (1) Trạm Lý thuyết trực quan (Tóm tắt kiến thức trọng tâm, mô hình phân tử 3D, cảnh báo an toàn trước khi vào phòng Lab); (2) Nhiệm vụ Thực hành trong Phòng Lab (Bàn thí nghiệm đã bày sẵn các dụng cụ của bài học đó, có bảng nhiệm vụ hướng dẫn từng bước và kiểm tra xem học sinh thao tác đúng quy trình an toàn hay chưa); (3) Trạm Kiểm tra & Giải thích hiện tượng (Câu hỏi tương tác gắn liền với chính kết quả thí nghiệm vừa làm).

### 3.2. Phòng Thí nghiệm Tự do (Unlimited Sandbox Lab)

Nằm độc lập bên ngoài lộ trình bài học, đây là không gian mở hoàn toàn. Học sinh bước vào phòng Lab 3D với đầy đủ tủ hóa chất (Kim loại, Phi kim, Axit, Bazơ, Muối, Chất chỉ thị) và kệ dụng cụ (Ống nghiệm, Cốc thủy tinh Beaker, Bình tam giác, Đèn cồn, Kẹp gỗ, Giá đỡ, Ống nhỏ giọt Pipet, Nhiệt kế). Người học có thể tự do pha trộn bất kỳ chất nào với lượng tùy ý, đun nóng hoặc thử nghiệm các phản ứng nguy hiểm (nổ nhẹ, bốc khói, đổi màu liên tục) trong môi trường ảo an toàn tuyệt đối.

### 3.3. Cơ chế Không gian 3D & Đổi Góc nhìn (3D Spatial & Camera System)

Lấy cảm hứng từ sự tự do không gian của các tựa game sandbox như Minecraft nhưng mang phong cách đồ họa phòng Lab hiện đại, sạch sẽ và trực quan: người dùng có thể dùng phím WASD để đi bộ quanh căn phòng (đến tủ lấy hóa chất, đến bồn rửa, đến bàn thí nghiệm, xem bảng tuần hoàn treo tường). Khi tiến lại gần bàn thí nghiệm và bấm chọn thực hiện, người dùng có thể chuyển đổi linh hoạt giữa Góc nhìn tự do (First-Person / Third-Person Walk) và Góc nhìn Cận cảnh Bàn Lab (Workbench Focus View) để cầm nắm ống nghiệm, nghiêng góc đổ dung dịch theo ml hoặc vặn đèn cồn một cách chuẩn xác bằng chuột/cảm ứng.

## 4\. Thiết kế Bộ máy Mô phỏng Hóa học Thời gian thực (Real-time Chemistry Engine)

Điểm khác biệt lớn nhất của ChemLab 3D so với các web học tập thông thường là các phản ứng không phải hoạt ảnh dựng sẵn (hard-coded animation), mà được điều khiển bởi một Bộ máy Trạng thái Hóa học (Chemical State Engine) tính toán liên tục theo từng khung hình (tick/frame). Mỗi dụng cụ chứa (như ống nghiệm hay cốc thủy tinh) là một thực thể độc lập lưu trữ trạng thái vật lý và hóa học của hỗn hợp bên trong.

| Thành phần trong Engine | Thông số theo dõi thời gian thực | Ví dụ minh họa trong Thực hành Hóa THCS |
| :---- | :---- | :---- |
| Trạng thái Dung dịch & Chất rắn | Số mol từng chất (n), Thể tích dung dịch (V), Nồng độ mol (C\_M \= n/V), Khối lượng chất rắn/kết tủa (m) | Nhỏ từ từ dung dịch BaCl₂ vào H₂SO₄: lượng kết tủa trắng BaSO₄ lắng xuống đáy ống nghiệm tỷ lệ thuận với số mol chất phản ứng. |
| Nhiệt độ & Truyền nhiệt (Thermal) | Nhiệt độ hiện tại T (°C), Tốc độ cấp nhiệt từ đèn cồn, Nhiệt phản ứng (Tỏa nhiệt ΔH \< 0 / Thu nhiệt ΔH \> 0\) | Đun nóng KMnO₄ hoặc Cu(OH)₂: chỉ khi nhiệt kế trong ống nghiệm vượt ngưỡng nhiệt độ phân hủy, phản ứng mới bắt đầu sinh khí O₂ hoặc chuyển màu đen CuO. |
| Độ pH & Chất chỉ thị màu | Chỉ số pH tính tự động từ nồng độ H⁺ / OH⁻ dư trong hỗn hợp; nội suy màu sắc RGB mượt mà | Nhỏ Phenolphtalein vào NaOH (hồng đậm), sau đó nhỏ từ từ HCl vào: dung dịch nhạt màu dần và mất màu đúng tại điểm tương đương (pH \= 7). |
| Phản ứng nối tiếp & Chất dư | Ma trận phương trình phản ứng ưu tiên; tự động xét chất hết \- chất dư sau mỗi giọt đổ thêm | Sục CO₂ vào nước vôi trong Ca(OH)₂: ban đầu đục dần do tạo CaCO₃, tiếp tục sục dư CO₂ thì dung dịch trong trở lại do tạo Ca(HCO₃)₂. |
| Hệ thống Hạt & Cảnh báo An toàn | Tốc độ sủi bọt khí (v\_gas), mật độ khói, tia lửa, âm thanh sôi/nổ khi vượt ngưỡng an toàn | Thả mẩu Natri (Na) lớn vào cốc nước hoặc rót nước vào H₂SO₄ đặc: hệ thống kích hoạt hiệu ứng sôi bắn, nổ và hiện cảnh báo sai quy tắc an toàn. |

Nhờ cơ chế tách bạch giữa "Bộ máy tính toán (Engine)" và "Dữ liệu phản ứng (JSON/Sheet Data)", bạn phụ trách Sư phạm không cần biết lập trình vẫn có thể đóng góp trực tiếp bằng cách điền thông số hóa chất (màu sắc, trạng thái, công thức, điều kiện nhiệt độ, phương trình) vào bảng chuẩn để hệ thống tự động nạp vào phòng Lab 3D.

## 5\. Đề xuất Công nghệ & Quy trình Phối hợp IT × Sư phạm trên Đám mây

Để chạy mượt không gian 3D ngay trên trình duyệt của học sinh (kể cả laptop cấu hình trung bình hoặc máy tính bảng) đồng thời giúp bạn dễ dàng phát triển, nâng cấp và chuyển đổi tài khoản trên đám mây, dưới đây là kiến trúc công nghệ và quy trình làm việc tối ưu:

| Hạng mục | Công nghệ / Nền tảng Đề xuất | Lý do lựa chọn & Lợi ích cho Dự án |
| :---- | :---- | :---- |
| Frontend & UI Khung học tập | React \+ TypeScript \+ Vite \+ Tailwind CSS | Tốc độ khởi tạo cực nhanh, dễ quản lý giao diện chọn lớp/bài học, bảng hướng dẫn thí nghiệm (HUD) và bài kiểm tra. |
| Đồ họa 3D & Vật lý Không gian | Three.js \+ React Three Fiber (R3F) \+ Drei \+ Rapier3D | Chuẩn công nghiệp cho Web 3D; hỗ trợ sẵn điều khiển di chuyển góc nhìn thứ nhất/thứ ba, chọn vật thể (Raycasting), hiệu ứng chất lỏng (Shader) và hạt (Particles). |
| Cơ sở dữ liệu Phản ứng & Bài học | Cấu trúc JSON chuẩn hóa (Đồng bộ từ Google Sheets) | Bạn Sư phạm nhập danh sách hóa chất, phương trình, câu hỏi trên Google Sheets; dùng script chuyển thành JSON trong GitHub Repo. |
| Quản lý Mã nguồn & Chuyển đổi Quota | GitHub Repository \+ File trạng thái HANDOVER.md | Mọi tính năng code xong đều commit/push lên GitHub. Khi hết quota đổi tài khoản, tài khoản mới chỉ cần clone repo và đọc HANDOVER.md là làm tiếp ngay. |
| Không gian Tài liệu & Chuyên môn | Google Drive (Thư mục App \- Web ( STUDY )) | Lưu trữ PRD (Google Docs), Bảng cơ sở dữ liệu Phản ứng Hóa học (Google Sheets), và giáo án các bài học THCS. |

Với mô hình này, hai bạn có thể làm việc song song hoàn toàn độc lập nhưng luôn khớp nhau: trong lúc bạn IT dựng căn phòng 3D, bàn thí nghiệm và code công thức tính nồng độ mol/nhiệt độ, thì bạn Sư phạm có thể soạn danh mục 20–30 hóa chất cơ bản của lớp 8–9 và kịch bản các bài thí nghiệm trên Google Sheets/Docs trong cùng thư mục Drive này.

## 6\. Lộ trình Triển khai Dự kiến (Roadmap 4 Giai đoạn)

Thay vì ôm đồm toàn bộ chương trình ngay từ ngày đầu, dự án nên đi theo 4 cột mốc tăng dần để sớm có sản phẩm chạy thử nghiệm (Prototype):

1. Giai đoạn 1 — Khung Phòng Lab 3D & Điều khiển Góc nhìn (3D Room & Camera Prototype): Dựng căn phòng thí nghiệm 3D đầu tiên, đi lại được bằng bàn phím/chuột, tiến tới bàn thí nghiệm, chuyển đổi góc nhìn và cầm/rót thử dung dịch giữa 2 cốc thủy tinh.  
2. Giai đoạn 2 — Bộ máy Hóa học Lõi (Core Chemistry Engine v1): Lập trình hệ thống tính toán thể tích, nồng độ mol, nhiệt độ đun nóng và pH theo thời gian thực với 10–15 hóa chất phổ biến nhất lớp 8–9 (HCl, H₂SO₄, NaOH, BaCl₂, CuSO₄, Al, Na, CaCO₃, Quỳ tím, Phenolphtalein).  
3. Giai đoạn 3 — Hoàn thiện Phòng Sandbox & 3 Bài học Mẫu Lớp 8–9: Mở cổng Phòng thí nghiệm tự do và đóng gói 3 bài học hoàn chỉnh (có đủ Lý thuyết \- Thực hành có chấm điểm thao tác \- Kiểm tra) do bạn Sư phạm biên soạn.  
4. Giai đoạn 4 — Mở rộng Hệ sinh thái & Cộng đồng: Bổ sung toàn bộ chương trình Hóa THCS/THPT, thêm tính năng lưu nhật ký thí nghiệm của học sinh, và mở rộng sang phân khu Vật lý \- Sinh học.

*Tài liệu Thiết kế Dự án ChemLab 3D • Lưu trữ đám mây trên Google Drive & Đồng bộ GitHub*  
