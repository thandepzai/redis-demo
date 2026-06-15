import { Controller, Get, Query } from '@nestjs/common';
import { RedisAdvanceService } from './redis-advance.service';

@Controller('redis-advance')
export class RedisAdvanceController {
  constructor(private readonly redisAdvanceService: RedisAdvanceService) {}

  @Get('luu-json')
  async luuJson(@Query('key') key: string): Promise<string> {
    if (!key) {
      return 'Vui lòng cung cấp key (Ví dụ: /redis-advance/luu-json?key=sanpham:1)';
    }
    return this.redisAdvanceService.luuJsonMoi(key);
  }

  @Get('lay-json')
  async layJson(@Query('key') key: string): Promise<unknown> {
    if (!key) {
      return 'Vui lòng cung cấp key';
    }
    return this.redisAdvanceService.layToanBoJson(key);
  }

  @Get('lay-mot-phan-json')
  async layMotPhanJson(@Query('key') key: string): Promise<unknown> {
    if (!key) {
      return 'Vui lòng cung cấp key';
    }
    return this.redisAdvanceService.layMotPhanJson(key);
  }

  @Get('cap-nhat-gia')
  async capNhatGia(
    @Query('key') key: string,
    @Query('giaMoi') giaMoi: string,
  ): Promise<string> {
    if (!key || !giaMoi) {
      return 'Vui lòng cung cấp key và giaMoi (Ví dụ: /redis-advance/cap-nhat-gia?key=sanpham:1&giaMoi=1800)';
    }
    const giaNu = Number(giaMoi);
    if (isNaN(giaNu)) {
      return 'Giá mới phải là một số hợp lệ!';
    }
    return this.redisAdvanceService.capNhatNhanhGia(key, giaNu);
  }

  @Get('them-danh-gia')
  async themDanhGia(
    @Query('key') key: string,
    @Query('sao') sao: string,
  ): Promise<string> {
    if (!key || !sao) {
      return 'Vui lòng cung cấp key và sao (Ví dụ: /redis-advance/them-danh-gia?key=sanpham:1&sao=5)';
    }
    const saoNu = Number(sao);
    if (isNaN(saoNu)) {
      return 'Sao đánh giá phải là một số hợp lệ!';
    }
    return this.redisAdvanceService.themDanhGiaSao(key, saoNu);
  }

  @Get('giam-gia')
  async giamGia(
    @Query('key') key: string,
    @Query('soTienGiam') soTienGiam: string,
  ): Promise<string> {
    if (!key || !soTienGiam) {
      return 'Vui lòng cung cấp key và soTienGiam (Ví dụ: /redis-advance/giam-gia?key=sanpham:1&soTienGiam=200)';
    }
    const giamNu = Number(soTienGiam);
    if (isNaN(giamNu)) {
      return 'Số tiền giảm phải là một số hợp lệ!';
    }
    return this.redisAdvanceService.giamGiaSanPham(key, giamNu);
  }

  @Get('ghi-nhan-ip')
  async ghiNhanIp(@Query('ip') ip: string): Promise<string> {
    if (!ip) {
      return 'Vui lòng cung cấp địa chỉ IP (Ví dụ: /redis-advance/ghi-nhan-ip?ip=192.168.1.1)';
    }
    return this.redisAdvanceService.ghiNhanNguoiDungTruyCap(ip);
  }

  @Get('dem-ip')
  async demIp(@Query('key') key: string): Promise<string> {
    return this.redisAdvanceService.demTongSoNguoiDungDocLap(key);
  }

  @Get('gop-dem')
  async gopDem(): Promise<string> {
    return this.redisAdvanceService.gopNhieuBoDem();
  }
}
