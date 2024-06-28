import { PartialType } from '@nestjs/mapped-types';
class _UpdatePhotoDto {
  userId: number;
  url: string;
}

export class UpdatePhotoDto extends PartialType(_UpdatePhotoDto) {}
