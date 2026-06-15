import { Controller, Get, Query } from '@nestjs/common';
import { RdbAofService, SanPham } from './rdb-aof.service';

@Controller('rdb-aof')
export class RdbAofController {
  constructor(private readonly rdbAofService: RdbAofService) {}

  @Get('san-pham')
  async laySanPham(@Query('id') id: string): Promise<SanPham | string> {
    if (!id) {
      return 'Vui lòng cung cấp id sản phẩm (Ví dụ: /rdb-aof/san-pham?id=101)';
    }
    const productId = Number(id);
    if (isNaN(productId)) {
      return 'ID sản phẩm phải là một số hợp lệ!';
    }
    return this.rdbAofService.layThongTinSanPham(productId);
  }

  @Get('bgsave')
  async bgsave(): Promise<string> {
    return this.rdbAofService.saoLuuRDBThuCong();
  }

  @Get('bgrewriteaof')
  async bgrewriteaof(): Promise<string> {
    return this.rdbAofService.thuGonFileAOF();
  }
}
