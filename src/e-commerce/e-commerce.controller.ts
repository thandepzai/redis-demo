import { Controller, Get, Query } from '@nestjs/common';
import { ECommerceService } from './e-commerce.service';

@Controller('e-commerce')
export class ECommerceController {
  constructor(private readonly eCommerceService: ECommerceService) {}

  @Get('them-san-pham')
  async themSanPham(
    @Query('userId') userId: string,
    @Query('productId') productId: string,
    @Query('quantity') quantity: string,
  ): Promise<string> {
    if (!userId || !productId || !quantity) {
      return 'Vui lòng cung cấp đầy đủ: userId, productId, quantity qua Query (Ví dụ: /e-commerce/them-san-pham?userId=1&productId=101&quantity=2)';
    }
    return this.eCommerceService.themSanPham(
      Number(userId),
      Number(productId),
      Number(quantity),
    );
  }

  @Get('lay-gio-hang')
  async layGioHang(
    @Query('userId') userId: string,
  ): Promise<Record<string, string>> {
    if (!userId) {
      return {
        error:
          'Vui lòng cung cấp userId (Ví dụ: /e-commerce/lay-gio-hang?userId=1)',
      };
    }
    return this.eCommerceService.layGioHang(Number(userId));
  }

  @Get('xoa-san-pham')
  async xoaSanPham(
    @Query('userId') userId: string,
    @Query('productId') productId: string,
  ): Promise<string> {
    if (!userId || !productId) {
      return 'Vui lòng cung cấp userId và productId (Ví dụ: /e-commerce/xoa-san-pham?userId=1&productId=101)';
    }
    return this.eCommerceService.xoaSanPham(Number(userId), Number(productId));
  }

  @Get('dem-view')
  async demView(@Query('productId') productId: string): Promise<string> {
    if (!productId) {
      return 'Vui lòng cung cấp productId (Ví dụ: /e-commerce/dem-view?productId=101)';
    }
    return this.eCommerceService.demLuotXemSanPham(Number(productId));
  }

  @Get('lay-view')
  async layView(@Query('productId') productId: string): Promise<string | null> {
    if (!productId) {
      return 'Vui lòng cung cấp productId';
    }
    return this.eCommerceService.layLuotXemSanPham(Number(productId));
  }

  @Get('them-yeu-thich')
  async themYeuThich(
    @Query('userId') userId: string,
    @Query('name') name: string,
  ): Promise<string> {
    if (!userId || !name) {
      return 'Vui lòng cung cấp userId và name (Ví dụ: /e-commerce/them-yeu-thich?userId=1&name=DienThoai)';
    }
    return this.eCommerceService.themDanhMucYeuThich(Number(userId), name);
  }

  @Get('lay-yeu-thich')
  async layYeuThich(@Query('userId') userId: string): Promise<string[]> {
    if (!userId) {
      return [];
    }
    return this.eCommerceService.layDanhSachDanhMucYeuThich(Number(userId));
  }

  @Get('dang-ky-kenh')
  async dangKyKenh(@Query('name') name: string): Promise<string> {
    if (!name) {
      return 'Vui lòng cung cấp name';
    }
    return this.eCommerceService.dangKyKenh(name);
  }

  @Get('thong-bao')
  async thongBao(@Query('content') content: string): Promise<string> {
    if (!content) {
      return 'Vui lòng cung cấp content';
    }
    return this.eCommerceService.thongBao(content);
  }
}
