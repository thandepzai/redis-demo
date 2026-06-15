import { Injectable, Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class ECommerceService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async themSanPham(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<string> {
    const key = `cart:${userId}`;
    await this.redisClient.hSet(key, {
      [productId.toString()]: quantity.toString(),
    });
    return `Đã thêm ${quantity} sản phẩm ${productId} vào giỏ hàng của người dùng ${userId}`;
  }

  async layGioHang(userId: number): Promise<Record<string, string>> {
    const key = `cart:${userId}`;
    const cart = await this.redisClient.hGetAll(key);
    return cart;
  }

  async xoaSanPham(userId: number, productId: number): Promise<string> {
    const key = `cart:${userId}`;
    await this.redisClient.hDel(key, productId.toString());
    return `Đã xóa sản phẩm ${productId} khỏi giỏ hàng của người dùng ${userId}`;
  }

  async demLuotXemSanPham(productId: number): Promise<string> {
    const key = `product:view:${productId}`;
    await this.redisClient.incr(key);
    return `Đã tăng lượt xem sản phẩm ${productId}`;
  }

  async layLuotXemSanPham(productId: number): Promise<string | null> {
    const key = `product:view:${productId}`;
    const viewCount = await this.redisClient.get(key);
    return viewCount;
  }

  async themDanhMucYeuThich(userId: number, name: string): Promise<string> {
    const key = `category:love:${userId}`;
    await this.redisClient.sAdd(key, name);
    return `Đã thêm danh mục ${name} vào danh sách yêu thích của người dùng ${userId}`;
  }

  async layDanhSachDanhMucYeuThich(userId: number): Promise<string[]> {
    const key = `category:love:${userId}`;
    const categories = await this.redisClient.sMembers(key);
    return categories;
  }

  // 1. Hàm lắng nghe (Subscriber)
  async dangKyKenh(name: string): Promise<string> {
    // Trong thực tế, bạn cần tạo một client riêng để nghe
    const subscriber = this.redisClient.duplicate();
    await subscriber.connect();

    const key = 'flash_sale_channel';

    // Dùng lệnh .subscribe() để bắt đầu nghe thông điệp
    await subscriber.subscribe(key, (message) => {
      // Bất cứ khi nào có tin nhắn, đoạn code trong này sẽ tự động chạy
      console.log(`[Khách hàng ${name} nhận được thông báo]: ${message}`);
    });

    return `Khách hàng ${name} đang lắng nghe kênh Flash Sale...`;
  }

  // 2. Hàm phát sóng (Publisher) - Code của bạn đã đúng lệnh publish
  async thongBao(content: string): Promise<string> {
    const key = 'flash_sale_channel';

    // Phát thông điệp đi. Số người nhận được phụ thuộc vào có bao nhiêu client đang chạy hàm subscribe ở trên
    await this.redisClient.publish(key, content);

    return `Đã gửi thông báo: "${content}" tới kênh ${key}`;
  }
}
