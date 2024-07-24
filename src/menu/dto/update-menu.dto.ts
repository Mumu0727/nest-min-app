import { PartialType } from '@nestjs/mapped-types';
class _UpdateMenuDto {
  name: string;
  categoryName: string;
  category: string;
  imgUrl: string;
  practices: string;
  remark: string;
}

// PartialType表示更新时只需传_UpdateMenuDto中的部分参数即可
export class UpdateMenuDto extends PartialType(_UpdateMenuDto) {}
