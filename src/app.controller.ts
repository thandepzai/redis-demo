import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('luu')
  async luu(): Promise<string> {
    return this.appService.luuDuLieu();
  }

  @Get('lay')
  async lay(): Promise<string | null> {
    return this.appService.layDuLieu();
  }

  @Get('luu-user')
  async luuUser(): Promise<string> {
    return this.appService.luuThongTinUser();
  }

  @Get('lay-user')
  async layUser(): Promise<Record<string, string>> {
    return this.appService.layThongTinUser();
  }

  @Get('luu-bxh')
  async luuBxh(): Promise<string> {
    return this.appService.capNhatDiemNguoiChoi();
  }

  @Get('lay-bxh')
  async layBxh(): Promise<any> {
    return this.appService.layBangXepHang();
  }

  @Get('luu-email')
  async luuEmail(): Promise<string> {
    return this.appService.taoTacVuGuiEmail('than@test.com');
  }

  @Get('lay-email')
  async layEmail(): Promise<string> {
    return this.appService.xuLyEmailTrongHangDoi();
  }
}
