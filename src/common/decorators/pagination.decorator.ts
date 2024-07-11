// common/decorators/pagination.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10 } = request.query;
    return {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  },
);
