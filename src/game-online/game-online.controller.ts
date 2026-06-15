import { Controller, Get, Query } from '@nestjs/common';
import { GameOnlineService, ThongTinTrangChu } from './game-online.service';

@Controller('game-online')
export class GameOnlineController {
  constructor(private readonly gameOnlineService: GameOnlineService) {}

  @Get('dang-ky')
  async dangKy(
    @Query('id') id: string,
    @Query('ten') ten: string,
    @Query('email') email: string,
  ): Promise<string> {
    if (!id || !ten || !email) {
      return 'Vui lòng cung cấp đầy đủ thông tin: id, ten, email qua Query (Ví dụ: /game-online/dang-ky?id=1&ten=Alice&email=alice@gmail.com)';
    }
    return this.gameOnlineService.dangKyNguoiChoiMoi(id, ten, email);
  }

  @Get('cap-nhat-diem')
  async capNhatDiem(
    @Query('id') id: string,
    @Query('ten') ten: string,
    @Query('diem') diem: string,
  ): Promise<string> {
    if (!id || !ten || !diem) {
      return 'Vui lòng cung cấp đầy đủ thông tin: id, ten, diem qua Query (Ví dụ: /game-online/cap-nhat-diem?id=1&ten=Alice&diem=150)';
    }
    const diemSo = Number(diem);
    if (isNaN(diemSo)) {
      return 'Điểm số phải là một con số hợp lệ!';
    }
    return this.gameOnlineService.capNhatDiemSo(id, ten, diemSo);
  }

  @Get('trang-chu')
  async layTrangChu(): Promise<ThongTinTrangChu> {
    return this.gameOnlineService.layThongTinTrangChu();
  }

  @Get('gui-email')
  async guiEmail(): Promise<string> {
    return this.gameOnlineService.workerGuiEmailNgam();
  }
}
