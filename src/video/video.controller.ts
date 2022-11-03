import { AuthService } from './../auth/auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { VideoService } from './video.service';
import { CurrentUser } from 'src/user/user.decorator';
import { VideoDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('get-private/:id')
  @Auth()
  async getVideoPrivate(@Param('id') id: number) {
    return this.videoService.byId(+id);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.videoService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopulByViews();
  }

  @Get(':id')
  async getVideo(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @HttpCode(200)
  @Post()
  @Auth()
  async createVideo(@CurrentUser('id') id: number) {
    return this.videoService.create(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
    return this.videoService.update(+id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteVideo(@Param('id') id: string) {
    return this.videoService.delete(+id);
  }

  @HttpCode(200)
  @Put('update-views/:videoId')
  async updateViews(@Param('videoId') videoId: string) {
    return this.videoService.updateCountViews(+videoId);
  }

  @HttpCode(200)
  @Put('update-like/:videoId')
  async updateLike(@Param('videoId') videoId: string) {
    return this.videoService.updateReaction(+videoId);
  }
}
