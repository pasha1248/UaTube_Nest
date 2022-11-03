import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExpressAdapter, FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { threadId } from 'worker_threads';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @HttpCode(200)
  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('media'))
  async uploadMediaFile(
    @UploadedFile() mediaFile: Express.Multer.File,
    @Query('folder') folder?: any,
  ) {
    return this.mediaService.saveMedia(mediaFile, folder);
  }
}
