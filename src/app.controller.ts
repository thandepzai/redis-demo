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
}
