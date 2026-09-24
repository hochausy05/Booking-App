# CHANGELOG

> Nhật ký phát triển của Mini Project 2.  
> File này chỉ được **ghi nối tiếp**, không xóa hoặc ghi đè các log cũ.

## Khởi tạo kế hoạch dự án

- **Trạng thái:** Đã chuẩn bị
- **Thay đổi:** Chốt phạm vi Real-time Study Room Booking App theo yêu cầu bài Mini Project 2. Dự án ưu tiên hoàn thành đầy đủ rubric, chạy ổn định và không mở rộng các tính năng không cần thiết.
- **Kế hoạch:** Chia dự án thành 10 task từ MP2-01 đến MP2-10, bao phủ Expo/TypeScript, navigation, Room Discovery, multi-filter, date/time slot, conflict prevention, Zustand, AsyncStorage, QR, local notification, QA và submission.
- **Ghi chú:** Các log triển khai tiếp theo phải được thêm phía dưới và giữ nguyên lịch sử cũ.

## MP2-01 — Project Foundation

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành phần khởi tạo tự động; chờ xác nhận thủ công trên Expo Go.
- **Các thay đổi chính:** Khởi tạo Expo SDK 57 với React Native và TypeScript trong root hiện tại; thêm cấu hình `package.json`, `app.json`, `tsconfig.json`, `.gitignore`, entry files và màn hình tối thiểu “Study Room Booking”; giữ nguyên `docs/`, `src/`, `assets/` và các Markdown hiện có; cài React Navigation, Zustand, AsyncStorage và `expo-notifications`.
- **Kiểm tra đã thực hiện:** Cài dependency thành công; `npm ls --depth=0`; `npx expo config --json`; `npm run typecheck`; Expo Metro khởi động tại `http://localhost:8081` và trả HTTP 200; Android bundle export thành công.
- **Hạn chế còn lại:** Chưa thể tự kiểm tra trên thiết bị vật lý trong môi trường hiện tại. Cần mở project bằng Expo Go để xác nhận màn hình khởi động thực tế.

## MP2-02 — Navigation & UI Foundation

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành.
- **Các thay đổi chính:** Thêm Bottom Tabs gồm Rooms và My Bookings; lồng Rooms Stack với Room Detail; thêm ba màn hình placeholder, điều hướng back tạm thời và theme token cơ bản. Cài `@react-navigation/bottom-tabs` vì package này cần cho tab navigator.
- **Kiểm tra đã thực hiện:** `npm run typecheck` thành công; `npx expo config --json` hợp lệ; Metro khởi động và trả HTTP 200; Android bundle export thành công với 840 modules.
- **Hạn chế còn lại:** Chưa thao tác trực tiếp các tab trên Expo Go/thiết bị vật lý; cần xác nhận thủ công Rooms → My Bookings → Rooms và Rooms → Room Detail → Back.

## MP2-03 — Room Data Foundation

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành.
- **Các thay đổi chính:** Thêm model `Room`, `Building`, `RoomEquipment` và `TimeSlot`; tạo 16 phòng mẫu chia đều cho bốn tòa nhà; ảnh dùng `null` an toàn do thư mục asset ảnh hiện chưa có phòng ảnh; thêm hằng số tập trung cho bốn khung giờ cố định.
- **Kiểm tra đã thực hiện:** `npm run typecheck`; kiểm tra dataset xác nhận 16 phòng, 4 phòng mỗi tòa A/B/C/V, sức chứa 2–20, đủ projector/whiteboard/highSpecPc/ac; kiểm tra đủ bốn khung giờ; `npx expo config --json`; Android bundle export thành công.
- **Hạn chế còn lại:** Ảnh phòng chưa có, trường `image` đang là `null` để giao diện có thể hiển thị placeholder.

## MP2-04 — Room Discovery

- **Ngày:** 2026-09-24
- **Trạng thái:** Đã triển khai; chờ kiểm tra tương tác trên Expo Go/emulator.
- **Các thay đổi chính:** Hiển thị 16 phòng bằng `FlatList`; tạo `React.memo` RoomCard với placeholder ảnh, thông tin phòng, nhãn thiết bị và badge trạng thái; thêm helper availability deterministic tách khỏi Room model; điều hướng đến Room Detail bằng `roomId` và hiển thị fallback nếu không tìm thấy phòng; bỏ nút preview cũ.
- **Kiểm tra đã thực hiện:** `npm run typecheck`; Android bundle export thành công; kiểm tra dữ liệu xác nhận đủ 16 room, helper phân bổ Available/Occupied ổn định, FlatList được dùng, tham số điều hướng là `roomId`, nút preview cũ đã bị xóa.
- **Hạn chế còn lại:** Không có emulator/thiết bị ADB kết nối nên chưa kiểm thử trực tiếp nhiều thẻ phòng, Room Detail và Back. Mục xác minh tương tác còn mở trong `TASKS.md`.
# 2026-09-24 — MP2-05 Search & Multi-Filter

- **Trạng thái:** Hoàn thành phần triển khai và kiểm tra tự động.
- **Thay đổi chính:** Thêm tìm kiếm tên phòng không phân biệt hoa thường, chip lọc tòa nhà và sức chứa, lọc nhiều thiết bị theo điều kiện AND, bộ lọc tổng hợp có memoization, số lượng kết quả và trạng thái rỗng kèm nút xóa toàn bộ bộ lọc. Giữ FlatList, RoomCard và điều hướng Room Detail hiện có.
- **Kiểm tra:** `npm run typecheck` thành công; chạy assertion trên dữ liệu 16 phòng cho tìm kiếm, 4 tòa nhà, 3 dải sức chứa, từng thiết bị, thiết bị kết hợp theo AND, bộ lọc kết hợp và không có kết quả.
- **Hạn chế:** Chưa kiểm tra thao tác trực tiếp trên app/thiết bị; cần xác nhận bàn phím, chip, empty state và điều hướng Room Detail thủ công.
