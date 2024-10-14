// common/common.module.ts
import { Global, Module } from '@nestjs/common';
import { PaginationService } from './services/pagination.service';
import { FileService } from './services/fileService.service';

@Global()
@Module({
  providers: [PaginationService, FileService],
  exports: [PaginationService, FileService],
})
export class CommonModule {}
