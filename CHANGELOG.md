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

## MP2-06 — Room Detail & Time Selector

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành phần triển khai và kiểm tra tự động.
- **Các thay đổi chính:** Màn hình Room Detail hiển thị dữ liệu phòng, nhãn thiết bị dùng chung, ảnh placeholder và trạng thái hiện có; thêm 7 ngày liên tiếp với khóa `YYYY-MM-DD`, các khung giờ lấy từ `TIME_SLOTS`, chọn một slot, tóm tắt lựa chọn và reset slot khi đổi ngày. Thêm helper deterministic cho slot tạm bận và vô hiệu hóa slot đã qua trong hôm nay.
- **Kiểm tra đã thực hiện:** `npm run typecheck`; assertion cho 7 ngày, ranh giới tháng/năm, 4 slot cố định, booked deterministic và past-time handling; `npx expo export --platform android --output-dir .expo-mp206-check` đóng gói thành công; `git diff --check`.
- **Hạn chế còn lại:** Chưa kiểm tra tương tác trực tiếp trên app/thiết bị; cần xác nhận chọn ngày/slot, fallback room không hợp lệ và điều hướng Back thủ công.
# 2026-09-24 — MP2-05 Search & Multi-Filter

- **Trạng thái:** Hoàn thành phần triển khai và kiểm tra tự động.
- **Thay đổi chính:** Thêm tìm kiếm tên phòng không phân biệt hoa thường, chip lọc tòa nhà và sức chứa, lọc nhiều thiết bị theo điều kiện AND, bộ lọc tổng hợp có memoization, số lượng kết quả và trạng thái rỗng kèm nút xóa toàn bộ bộ lọc. Giữ FlatList, RoomCard và điều hướng Room Detail hiện có.
- **Kiểm tra:** `npm run typecheck` thành công; chạy assertion trên dữ liệu 16 phòng cho tìm kiếm, 4 tòa nhà, 3 dải sức chứa, từng thiết bị, thiết bị kết hợp theo AND, bộ lọc kết hợp và không có kết quả.
- **Hạn chế:** Chưa kiểm tra thao tác trực tiếp trên app/thiết bị; cần xác nhận bàn phím, chip, empty state và điều hướng Room Detail thủ công.

## MP2-07 — Booking & Conflict Prevention + Realtime

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành; còn kiểm tra cạnh tranh trên hai thiết bị thật.
- **Supabase:** Áp dụng migration `bookings_schema` cho project Booking-App (`cbudliffmptczqucldsd`). Tạo `public.bookings` với trạng thái/check thời gian, RLS và chính sách anon demo giới hạn đọc booking active/ghi `demo-student`; giữ catalog phòng ở local.
- **Chống xung đột:** Dùng partial unique index trên `(room_id, booking_date, start_time, end_time)` với `status = 'active'`; tầng service kiểm tra trước và ánh xạ SQLSTATE `23505` thành lỗi conflict thân thiện.
- **Realtime:** Bật bảng trong `supabase_realtime`; client subscribe theo room, lọc ngày ở callback, tải lại booking khi có thay đổi và gỡ channel khi đổi ngữ cảnh/unmount.
- **Thay đổi ứng dụng:** Cài `@supabase/supabase-js@2.117.1`; thêm kiểu booking, demo user ID, Supabase client/service, cấu hình `.env.example` và `.gitignore`; thay giả lập slot bận bằng trạng thái từ Supabase; thêm thao tác Book Room cùng loading/error/conflict/success.
- **Kiểm tra:** `npm run typecheck`, `npx expo config --json`, Android bundle export, `git diff --check`; xác minh schema/cột/RLS/index/publication; anon client insert/select, duplicate bị từ chối với `23505`, event Realtime INSERT nhận được và channel đóng; SQL xác minh hủy rồi đặt lại cùng slot, insert slot khác thành công; đã xóa toàn bộ hàng kiểm tra và xác nhận còn 0 hàng.
- **Hạn chế:** Chưa thử hai thiết bị gửi booking đồng thời trên thiết bị thật. Supabase Advisor cũng báo hàm có sẵn `public.rls_auto_enable()` cho phép anon/authenticated gọi SECURITY DEFINER; hàm này ngoài migration MP2-07 và chưa bị thay đổi. Xem [hướng dẫn xử lý Advisor](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable).

## MP2-07 — UI Polish & Vietnamese Localization

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành phần giao diện và kiểm tra tự động; còn xác minh bố cục trên thiết bị thật.
- **Các thay đổi chính:** Việt hóa nhãn điều hướng, tìm kiếm, bộ lọc, thiết bị, trạng thái phòng/khung giờ, ngày tháng, thông báo lỗi và kết quả đặt phòng. Thêm vùng an toàn cho các màn hình phù hợp, thu gọn RoomCard và khoảng cách các bộ lọc/chi tiết, đồng thời tăng khoảng đệm cuộn cuối danh sách và trang chi tiết.
- **Các kiểm tra đã thực hiện:** `npm run typecheck`; `npx expo export --platform android --output-dir .expo-mp207-polish-check`; `git diff --check` đều thành công. Logic tìm kiếm/lọc, đặt phòng, Supabase, Realtime và điều hướng không được thay đổi trong phần polish.
- **Hạn chế còn lại:** Chưa thao tác trực tiếp trên iOS/Android; cần kiểm tra nội dung tiếng Việt, safe area, cuộn hàng chọn ngày và khoảng đệm cuối trang trên thiết bị.

## MP2-08 — Zustand & AsyncStorage Persistence

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành phần triển khai và kiểm tra tự động; còn kiểm tra khôi phục bộ lọc sau khi khởi động lại app trên thiết bị/emulator.
- **Các thay đổi chính:** Thêm `useBookingStore` dùng Zustand persist với khóa `study-room-booking-store`; lưu demo user và bộ lọc phòng, giữ booking cache/loading hydration ở runtime. Chuyển RoomsScreen sang dùng bộ lọc Zustand. Room Detail lấy user ID từ session store và thêm booking vào cache sau khi Supabase tạo thành công. Chuẩn bị hành động hủy chỉ cập nhật cache sau khi thao tác từ xa do caller cung cấp thành công.
- **Các kiểm tra đã thực hiện:** `npm run typecheck`; `npx expo config --json`; Android bundle export; `git diff --check`; kiểm tra tự động có mock AsyncStorage cho hydration, khôi phục/xóa bộ lọc, giới hạn trường được persist và remote-first cancellation cache; assertion cho tìm kiếm, tòa nhà, các dải sức chứa, equipment AND, lọc kết hợp và trạng thái rỗng.
- **Hạn chế còn lại:** Chưa xác minh đóng/mở lại ứng dụng trên thiết bị/emulator. Booking lưu trong Zustand chỉ là cache runtime; Supabase vẫn là nguồn dữ liệu chuẩn. Chính sách Supabase hiện tại chưa cho phép hủy booking nên chưa thêm thao tác ghi/hủy từ xa hoặc giao diện hủy trong MP2-08.

## MP2-09 — My Bookings, Cancellation, QR Pass & Local Notifications

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn thành phần triển khai và kiểm tra tự động; còn kiểm tra giao diện/thông báo trên thiết bị hoặc emulator.
- **Các thay đổi chính:** Hoàn thiện Lịch đặt phòng với dữ liệu Supabase, ưu tiên lịch sắp tới, trạng thái, tải/lỗi/rỗng và làm mới khi mở màn hình/kéo xuống. Thêm xác nhận hủy và cập nhật status thành `cancelled`; cache Zustand chỉ cập nhật sau xác nhận từ xa. Thêm modal QR chứa booking ID, room ID, ngày và giờ. Booking thành công có thể lên lịch nhắc bằng tiếng Việt trước 15 phút; từ chối quyền hoặc lỗi nhắc không làm hỏng booking.
- **Supabase:** Áp dụng hai migration chỉ cho Booking-App (`cbudliffmptczqucldsd`) để đọc lịch sử của `demo-student`, cho phép hủy booking active bằng cách đổi status, và giới hạn API role `anon` xuống SELECT/INSERT cùng UPDATE cột `status`. Không đổi cấu trúc bảng, partial unique index hoặc publication Realtime. Thử nghiệm xác nhận hủy, đặt lại cùng slot, nhận sự kiện Realtime UPDATE; đã xóa hàng kiểm tra và xác nhận còn 0 hàng.
- **Kiểm tra đã thực hiện:** `npm run typecheck`, `npx expo config --json`, Android bundle export và `git diff --check`; kiểm tra service Supabase thật cho lịch sử/hủy/đặt lại; kiểm tra Realtime UPDATE; mock kiểm tra QR payload, xin quyền, lên lịch đúng giờ, bỏ qua nhắc đã qua và hủy notification ID.
- **Hạn chế còn lại:** Chưa kiểm tra thao tác modal/xác nhận và notification trên iOS/Android thật. Expo kiểm tra phiên bản báo `expo` và `expo-notifications` đang thấp hơn một bản vá so với phiên bản khuyến nghị. Supabase Advisor còn cảnh báo hàm có sẵn `public.rls_auto_enable()` là SECURITY DEFINER có thể gọi bởi anon/authenticated; không thuộc phạm vi MP2-09 nên không sửa.

## MP2-10 — Final QA, Stabilization & Submission

- **Ngày:** 2026-09-24
- **Trạng thái:** Hoàn tất kiểm tra tự động và tài liệu nộp bài; còn một lượt walkthrough tổng thể trên thiết bị/emulator thật.
- **Các thay đổi chính:** Cập nhật README với cấu hình, luồng chính và vị trí ảnh chụp; thêm kịch bản demo 2–3 phút và dàn ý báo cáo kỹ thuật 2–4 trang. Gom các mục kiểm tra thủ công MP2-01/04–09 thành một checklist thiết bị duy nhất trong `TASKS.md` mà không đánh dấu đã qua.
- **Đã ổn định:** Nâng đúng hai bản vá Expo theo khuyến nghị SDK (`expo` 57.0.25 và `expo-notifications` 57.0.21). Thêm migration thu hồi quyền EXECUTE của PUBLIC/anon/authenticated trên RPC không dùng `public.rls_auto_enable()`; giữ nguyên function/event trigger và grant `service_role`.
- **Supabase:** Chỉ kiểm tra/sửa project Booking-App (`cbudliffmptczqucldsd`). Xác nhận bảng bookings, RLS với 4 policies, partial unique index, publication Realtime, từ chối booking active trùng slot, hủy rồi đặt lại, đọc lịch sử; nhận Realtime INSERT và UPDATE. Sau kiểm tra đã xóa 3 hàng QA cùng hàng kiểm tra Realtime MP2-09 còn sót; truy vấn cuối xác nhận 0 hàng QA. Security Advisor sau migration không còn finding; event trigger `ensure_rls` vẫn bật.
- **Kiểm tra đã thực hiện:** Kiểm thử helper lọc trên catalog phòng cho tìm chính xác/không phân biệt hoa thường, A/B/C/V, ba dải sức chứa, từng thiết bị, equipment AND, bộ lọc kết hợp, rỗng và reset. `npm run typecheck`, `npx expo config --json`, `npx expo-doctor` (21/21), `npx expo install --check`, Android export (1281 modules), kiểm tra secret/Git và `git diff --check` thành công.
- **Dependency audit:** `npm audit --omit=dev` báo 10 moderate entries liên quan chuỗi phụ thuộc Expo → `xcode` → `uuid@7.0.3` (GHSA-w5hq-g745-h8pq). Audit đề xuất thay Expo xuống 46.0.21; không áp dụng thay đổi major/downgrade rủi ro trong task final QA. Không thấy secret trong file Git đã theo dõi; `.env` bị ignore và không được theo dõi.
- **Hạn chế còn lại:** Không có Android/iOS device hoặc emulator kết nối để kiểm tra thao tác màn hình, khôi phục sau restart và notification delivery. Demo URL/ảnh chụp chưa được tạo; README để placeholder rõ ràng. Lượt kiểm tra thủ công duy nhất còn mở trong TASKS.md bao gồm các luồng thiết bị MP2-01/04–09.
