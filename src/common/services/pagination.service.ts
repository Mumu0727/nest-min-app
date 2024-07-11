// common/services/pagination.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationResults } from '../interfaces/pagination-results.interface';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    customQueryBuilder?: (qb: any) => void,
  ): Promise<PaginationResults<T>> {
    const { page, limit } = paginationDto;

    const queryBuilder = repository.createQueryBuilder();

    if (customQueryBuilder) {
      customQueryBuilder(queryBuilder);
    }

    const [data, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(count / limit);

    return { records: data, count, totalPages, page, limit };
  }
}
