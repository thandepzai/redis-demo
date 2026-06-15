import { Injectable, Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisAdvanceService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  // -----------------------------------------------------
  // NHÓM 11: THAO TÁC VỚI REDISJSON (DỮ LIỆU PHỨC TẠP)
  // -----------------------------------------------------

  // 11.1 Lưu toàn bộ một Object JSON phức tạp (Nhiều tầng lồng nhau)
  async luuJsonMoi(key: string): Promise<string> {
    // Ký hiệu '$' nghĩa là lưu từ gốc (root)
    const duLieuSanPham = {
      ten: 'MacBook Pro',
      gia: 2000,
      cau_hinh: {
        ram: '16GB',
        chip: 'M3 Pro',
      },
      danh_gia_sao: [3, 4], // Lưu cả mảng
    };

    // Tương đương lệnh Redis: JSON.SET key $ '{"ten":...}'
    await this.redisClient.json.set(key, '$', duLieuSanPham);
    return 'Đã lưu object phức tạp thành công!';
  }

  // 11.2 Lấy toàn bộ dữ liệu JSON
  async layToanBoJson(key: string): Promise<unknown> {
    // Tương đương lệnh: JSON.GET key
    const ketQua = await this.redisClient.json.get(key);
    return ketQua;
    // Trả về thẳng một Object Javascript, không cần JSON.parse()
  }

  // 11.3 Lấy CHỈ MỘT PHẦN nhỏ của dữ liệu JSON (Tiết kiệm băng thông)
  async layMotPhanJson(key: string): Promise<unknown> {
    // Tương đương lệnh: JSON.GET key $.cau_hinh
    // Chỉ lấy ra cấu hình máy, không tải về tên, giá, hay đánh giá
    const cauHinh = await this.redisClient.json.get(key, {
      path: '$.cau_hinh',
    });
    return cauHinh;
  }

  // 11.4 Cập nhật trực tiếp một thuộc tính nằm sâu bên trong
  async capNhatNhanhGia(key: string, giaMoi: number): Promise<string> {
    // Tương đương lệnh: JSON.SET key $.gia 1800
    // Sửa đúng thuộc tính 'gia', các thuộc tính khác giữ nguyên
    await this.redisClient.json.set(key, '$.gia', giaMoi);
    return 'Đã cập nhật giá mới thành công!';
  }

  // 11.5 Thêm một phần tử mới vào mảng (Array) nằm sâu trong JSON
  async themDanhGiaSao(key: string, sao: number): Promise<string> {
    // Tương đương lệnh: JSON.ARRAPPEND key $.danh_gia_sao 5
    // Đẩy thẳng số sao vào mảng đánh giá mà không cần kéo dữ liệu về
    await this.redisClient.json.arrAppend(key, '$.danh_gia_sao', sao);
    return 'Đã thêm đánh giá mới vào mảng!';
  }

  // 11.6 Tăng/Giảm giá trị của một thuộc tính số
  async giamGiaSanPham(key: string, soTienGiam: number): Promise<string> {
    // Tương đương lệnh: JSON.NUMINCRBY key $.gia -200
    await this.redisClient.json.numIncrBy(key, '$.gia', -soTienGiam);
    return 'Đã áp dụng mã giảm giá!';
  }

  // -----------------------------------------------------
  // NHÓM 12: THAO TÁC VỚI HYPERLOGLOG (ĐẾM PHẦN TỬ DUY NHẤT)
  // -----------------------------------------------------

  // 12.1 Ghi nhận một phần tử mới (Ví dụ: IP người dùng)
  async ghiNhanNguoiDungTruyCap(ipNguoiDung: string): Promise<string> {
    const key = 'website:luot_truy_cap_duy_nhat';

    // Tương đương lệnh: PFADD key element
    // Nếu IP này hôm nay đã truy cập rồi, Redis sẽ tự bỏ qua mà không làm tăng bộ đếm
    await this.redisClient.pfAdd(key, ipNguoiDung);

    return `Đã ghi nhận IP: ${ipNguoiDung}`;
  }

  // 12.2 Lấy ra tổng số lượng phần tử duy nhất (Ước tính)
  async demTongSoNguoiDungDocLap(
    key: string = 'website:luot_truy_cap_duy_nhat',
  ): Promise<string> {
    // Tương đương lệnh: PFCOUNT key
    // Trả về số lượng IP không trùng lặp đã được thêm vào
    const tongSo = await this.redisClient.pfCount(key);

    return `Số người dùng truy cập độc lập ước tính là: ${tongSo}`;
  }

  // 12.3 Gộp nhiều bộ đếm HyperLogLog lại với nhau
  // Ví dụ: Bạn có key của ngày 1, ngày 2. Bạn muốn xem tổng người dùng duy nhất của cả 2 ngày
  async gopNhieuBoDem(): Promise<string> {
    const keyTongHop = 'website:tong_truy_cap_2_ngay';
    const keyNgay1 = 'website:truy_cap_ngay_1';
    const keyNgay2 = 'website:truy_cap_ngay_2';

    // Tương đương lệnh: PFMERGE destkey sourcekey1 sourcekey2
    await this.redisClient.pfMerge(keyTongHop, [keyNgay1, keyNgay2]);

    return 'Đã gộp dữ liệu thành công! Hãy dùng pfCount vào keyTongHop để lấy kết quả.';
  }
}
