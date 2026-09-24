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
