import { Injectable, Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';

export interface SanPham {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Injectable()
export class RdbAofService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  // YÊU CẦU 1: CACHING THÔNG TIN SẢN PHẨM
  async layThongTinSanPham(productId: number): Promise<SanPham> {
    const key = `product:${productId}`;

    // Bước 1: Kiểm tra xem dữ liệu đã có trong Redis (Cache) chưa bằng lệnh GET
    const cachedData = await this.redisClient.get(key);

    if (cachedData) {
      console.log('⚡ Lấy dữ liệu siêu tốc từ Redis Cache!');
      // Vì dữ liệu trong Redis lưu dạng chuỗi (String), ta cần parse ngược lại thành Object
      return JSON.parse(cachedData) as SanPham;
    }

    // Bước 2: Nếu chưa có trong Cache, giả lập việc gọi xuống Database chính (MySQL/PostgreSQL)
    console.log('🐢 Không có trong Cache. Đang truy vấn Database chính...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const dataFromDB: SanPham = {
      id: productId,
      name: `Sản phẩm mẫu số ${productId}`,
      price: 500000,
      description: 'Đây là dữ liệu được kéo từ Database gốc lên',
    };

    // Bước 3: Lưu dữ liệu lấy được vào Redis để dùng cho các lần gọi sau.
    // Dùng tùy chọn { EX: 60 } để đặt thời gian hết hạn (TTL) là 60 giây, tránh việc lưu dữ liệu cũ vĩnh viễn.
    await this.redisClient.set(key, JSON.stringify(dataFromDB), { EX: 60 });

    return dataFromDB;
  }

  // YÊU CẦU 2: KÍCH HOẠT SAO LƯU RDB DƯỚI NỀN (BACKGROUND SAVE)
  async saoLuuRDBThuCong(): Promise<string> {
    try {
      // Tương đương lệnh: BGSAVE
      // Lệnh này trả về ngay lập tức, trong khi Redis âm thầm copy dữ liệu ra đĩa ở một tiến trình con
      await this.redisClient.bgSave();

      return 'Đã gửi lệnh thành công! Redis đang chạy ngầm tiến trình sao lưu RDB (Snapshot).';
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return `Lỗi khi yêu cầu sao lưu: ${msg}`;
    }
  }

  // YÊU CẦU 3: THU GỌN VÀ VIẾT LẠI FILE LOG AOF
  async thuGonFileAOF(): Promise<string> {
    try {
      // Tương đương lệnh: BGREWRITEAOF
      // Quá trình này hoàn toàn an toàn. Redis sẽ ghi vào một file tạm,
      // sau khi hoàn tất mới tráo đổi với file cũ để không làm mất dữ liệu.
      await this.redisClient.bgRewriteAof();

      return 'Tuyệt vời! Đã kích hoạt tiến trình thu gọn file AOF dưới nền.';
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return `Lỗi khi thu gọn AOF: ${msg}`;
    }
  }
}
