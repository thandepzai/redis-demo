import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class AppService implements OnModuleInit {
  // Tạo một biến để chứa công cụ kết nối Redis với kiểu dữ liệu rõ ràng
  private redisClient: RedisClientType;

  // Hàm này sẽ tự động chạy khi dự án NestJS vừa khởi động lên
  async onModuleInit(): Promise<void> {
    // 1. Cấu hình địa chỉ của máy chủ Redis (Localhost, cổng 6379)
    this.redisClient = createClient({
      url: 'redis://127.0.0.1:6379',
    });

    // 2. Bắt đầu kết nối
    await this.redisClient.connect();
    console.log('Đã kết nối thành công với Redis Server!');
  }

  // Hàm lưu dữ liệu vào Redis
  async luuDuLieu(): Promise<string> {
    // Tương đương với lệnh: SET hoc_vien "Nguoi moi bat dau"
    await this.redisClient.set('hoc_vien', 'Than moi bat dau ');
    return 'Lưu xong rồi nhé!';
  }

  // Hàm lấy dữ liệu từ Redis
  async layDuLieu(): Promise<string | null> {
    // Tương đương với lệnh: GET hoc_vien
    const ketQua = await this.redisClient.get('hoc_vien');
    return ketQua;
  }

  // Hàm 1: Lưu thông tin một User vào Redis bằng Hash
  async luuThongTinUser(): Promise<string> {
    // Tương đương lệnh: HSET user:1 name "Nguyen Van A" age "25" role "Admin"
    // Chúng ta tạo một key tên là 'user:1' và lưu 3 trường dữ liệu vào đó
    await this.redisClient.hSet('user:1', {
      name: 'Nguyen Van A',
      age: '25',
      role: 'Admin',
    });

    return 'Đã lưu toàn bộ thông tin User vào Redis Hash thành công!';
  }

  // Hàm 2: Lấy toàn bộ thông tin User từ Redis
  async layThongTinUser(): Promise<Record<string, string>> {
    // Tương đương lệnh: HGETALL user:1
    // Lệnh này sẽ gom tất cả các trường lại thành một Object hoàn chỉnh trả về cho bạn
    const thongTinUser = await this.redisClient.hGetAll('user:1');

    // In ra màn hình console (Terminal) để kiểm tra
    console.log('Dữ liệu User lấy từ Redis:', thongTinUser);

    return thongTinUser;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
