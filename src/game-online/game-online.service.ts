import { Injectable, Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';

export interface BangXepHangItem {
  score: number;
  value: string;
}

export interface ThongTinTrangChu {
  thongKe: string;
  bangXepHangTop3: BangXepHangItem[];
  heThongNgam: string;
}

@Injectable()
export class GameOnlineService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async dangKyNguoiChoiMoi(
    id: string,
    ten: string,
    email: string,
  ): Promise<string> {
    await this.redisClient.incr('he_thong:tong_so_nguoi_choi');

    await this.redisClient.hSet(`game_user:${id}`, {
      name: ten,
      email: email,
      level: '1',
      trang_thai: 'hoat_dong',
    });

    // 3. Đưa việc gửi email vào hàng đợi nền (Dùng List - LPUSH)
    await this.redisClient.lPush('queue:gui_email', email);

    return `Đã tạo tài khoản thành công cho: ${ten}`;
  }

  async capNhatDiemSo(id: string, ten: string, diem: number): Promise<string> {
    await this.redisClient.zAdd('game:bang_xep_hang', [
      { score: diem, value: ten },
    ]);

    return `Đã cập nhật ${diem} điểm cho người chơi ${ten}`;
  }

  async layThongTinTrangChu(): Promise<ThongTinTrangChu> {
    // Lấy tổng người chơi đã đăng ký (Dùng GET)
    const tongNguoiChoi = await this.redisClient.get(
      'he_thong:tong_so_nguoi_choi',
    );

    // Lấy Top 3 bảng xếp hạng cao điểm nhất (Dùng ZRANGE)
    const top3 = await this.redisClient.zRangeWithScores(
      'game:bang_xep_hang',
      0,
      2,
      { REV: true },
    );

    // Lấy số lượng email đang chờ gửi trong hàng đợi (Dùng LLEN)
    const emailChoGui = await this.redisClient.lLen('queue:gui_email');

    return {
      thongKe: `Tổng số người chơi của game: ${tongNguoiChoi}`,
      bangXepHangTop3: top3,
      heThongNgam: `Đang có ${emailChoGui} email nằm trong hàng đợi chờ xử lý.`,
    };
  }

  async workerGuiEmailNgam(): Promise<string> {
    // Lấy người vào hàng đợi sớm nhất ra để xử lý
    const email = await this.redisClient.rPop('queue:gui_email');
    if (email) {
      console.log(`[WORKER] Đang tự động gửi email chào mừng tới: ${email}`);
      return `Đã gửi email cho ${email}`;
    }
    return 'Không có email nào cần gửi.';
  }
}
