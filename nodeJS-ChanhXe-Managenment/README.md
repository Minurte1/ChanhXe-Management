# **Core Server Node.js**

Đây là ứng dụng **Node.js** với các tính năng chính như xử lý API, kết nối WebSocket qua **Socket.IO** và cấu hình môi trường, sử dụng các công nghệ hiện đại. Ứng dụng này được xây dựng để hỗ trợ các tính năng như chat trực tuyến, quản lý người dùng và xử lý ảnh.

## **Các Công Nghệ Sử Dụng:**

- **Node.js**: Môi trường chạy server, xử lý các yêu cầu HTTP và WebSocket.
- **Express.js**: Framework đơn giản và mạnh mẽ cho việc xây dựng API, hỗ trợ các middleware và routing.
- **Socket.IO**: Thư viện cho việc kết nối WebSocket, cho phép giao tiếp thời gian thực giữa client và server.
- **dotenv**: Quản lý các biến môi trường, cấu hình ứng dụng dễ dàng.
- **Cors**: Middleware cho phép chia sẻ tài nguyên giữa các nguồn khác nhau, hỗ trợ Cross-Origin Resource Sharing (CORS).
- **Body-Parser**: Middleware để phân tích dữ liệu `POST` từ client và chuyển đổi thành JSON hoặc dữ liệu `urlencoded`.
- **Cookie-Parser**: Middleware để phân tích cookies trong HTTP request.
- **Path**: Module tích hợp sẵn của Node.js dùng để xử lý đường dẫn tập tin.
- **http**: Module tích hợp sẵn của Node.js cho việc tạo HTTP server.
- **MySQL**: Hệ quản trị cơ sở dữ liệu quan hệ cho việc lưu trữ dữ liệu người dùng và các thông tin khác.
- **Mongoose**: Thư viện hỗ trợ kết nối và tương tác với MongoDB (nếu có sử dụng).

## **Các Tính Năng Chính:**

1. **Kết nối WebSocket với Socket.IO**:
   - Hỗ trợ các kết nối WebSocket thời gian thực cho phép truyền tải dữ liệu nhanh chóng giữa server và client.
   - Lưu trữ `socket.id` của từng người dùng để gửi tin nhắn trực tiếp qua WebSocket.

2. **API Quản Lý Người Dùng**:
   - Cung cấp các route API cho việc đăng ký, đăng nhập và quản lý người dùng.
   - Sử dụng **cookie** và **JWT (JSON Web Token)** cho việc xác thực người dùng.

3. **Cấu Hình Môi Trường**:
   - Sử dụng `.env` file để quản lý cấu hình môi trường như `PORT`, `HOST_NAME`, kết nối cơ sở dữ liệu, v.v.

4. **CORS**:
   - Cấu hình CORS cho phép chia sẻ tài nguyên giữa các nguồn khác nhau (cross-origin).

5. **Xử Lý Tải Ảnh**:
   - Cung cấp khả năng tải và lưu trữ hình ảnh người dùng trong thư mục `/images`.

6. **Middleware cho Request Parsing**:
   - Sử dụng `body-parser` để phân tích dữ liệu `POST` từ client thành định dạng JSON hoặc `urlencoded`.

7. **Môi Trường Được Tùy Chỉnh**:
   - Cấu hình môi trường và các biến thông qua `dotenv`.

## **Cách Cài Đặt và Sử Dụng:**

1. **Clone Repository**:
   ```bash
   git clone <repository_url>
   cd <project_folder>
