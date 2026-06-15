import { Injectable, Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class AppService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

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

  async capNhatDiemNguoiChoi() {
    // Tương đương lệnh: ZADD bxh_game 100 "Alice" 200 "Bob" 150 "Charlie"
    // Khi bạn gọi hàm này, Redis sẽ tự động đưa Bob lên cao nhất, tiếp theo là Charlie và Alice.
    await this.redisClient.zAdd('bxh_game', [
      { score: 100, value: 'Alice' },
      { score: 200, value: 'Bob' },
      { score: 150, value: 'Charlie' },
    ]);

    return 'Đã cập nhật điểm số cho người chơi vào Bảng xếp hạng!';
  }

  // Hàm 2: Lấy ra Top những người chơi điểm cao nhất
  async layBangXepHang() {
    // Tương đương lệnh: ZRANGE bxh_game 0 2 WITHSCORES
    // { REV: true } nghĩa là lấy ngược từ cao xuống thấp (Reverse)
    // 0 và 2 nghĩa là lấy từ vị trí số 0 đến vị trí số 2 (Tức là Top 3 người cao nhất)
    const topNguoiChoi = await this.redisClient.zRangeWithScores(
      'bxh_game',
      0,
      2,
      { REV: true },
    );

    console.log('Top 3 người chơi điểm cao nhất:', topNguoiChoi);
    return topNguoiChoi;
  }

  // -----------------------------------------------------
  // THỰC HÀNH REDIS LIST: MESSAGE QUEUE (HÀNG ĐỢI TÁC VỤ)
  // -----------------------------------------------------

  // Hàm 1: Đưa tác vụ vào hàng đợi (Ví dụ: Gửi email)
  async taoTacVuGuiEmail(email: string) {
    // Tương đương lệnh: LPUSH hang_doi_email "user@example.com"
    // Đẩy địa chỉ email cần gửi vào đầu danh sách
    await this.redisClient.lPush('hang_doi_email', email);

    return `Đã đưa email ${email} vào hàng đợi. Hệ thống sẽ tự động gửi ngầm sau!`;
  }

  // Hàm 2: Lấy tác vụ ra khỏi hàng đợi để xử lý (Consumer)
  async xuLyEmailTrongHangDoi() {
    // Tương đương lệnh: RPOP hang_doi_email
    // Lấy phần tử ở cuối danh sách (người vào đầu tiên) ra để xử lý và xóa khỏi hàng đợi
    const emailCanGui = await this.redisClient.rPop('hang_doi_email');

    if (emailCanGui) {
      console.log(
        `Đang tiến hành gọi API gửi email thực sự tới: ${emailCanGui}`,
      );
      return `Đã xử lý xong email của: ${emailCanGui}`;
    } else {
      return 'Hàng đợi đang trống, không có email nào chờ xử lý!';
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
