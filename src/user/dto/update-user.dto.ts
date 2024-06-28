import { PartialType } from '@nestjs/mapped-types';
class _UpdateUserDto {
  username: string;
  password: string;
}

// PartialType表示更新时只需传_UpdateUserDto中的部分参数即可
export class UpdateUserDto extends PartialType(_UpdateUserDto) {}
