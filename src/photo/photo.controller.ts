import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { LoginGuard } from 'src/login.guard';
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('add')
  create(@Body() createPhotoDto: CreatePhotoDto) {
    if (createPhotoDto.userId) {
      return this.photoService.create(createPhotoDto);
    }
    throw new InternalServerErrorException({
      message: '添加照片需传用户ID',
    });
  }

  @Post('update')
  update(@Body('id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    if (id) {
      return this.photoService.update(+id, updatePhotoDto);
    }
    throw new InternalServerErrorException({
      message: '更新用户信息需传用户ID',
    });
  }

  @Post('delete')
  remove(@Body('id') id: string) {
    if (id) {
      return this.photoService.remove(+id);
    }
    throw new InternalServerErrorException({
      message: '删除用户信息需传用户ID',
    });
  }

  @UseGuards(LoginGuard)
  @Post('query')
  findAll(@Body('id') id: string) {
    if (id) {
      return this.photoService.findOne(+id);
    }
    return this.photoService.findAll();
  }

  @Get('star')
  star(@Query('id') id: string) {
    console.log('id', id);
    return this.photoService.star(+id);
  }
}
