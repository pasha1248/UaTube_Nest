import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { VideoEntity } from './videos.entity';
import { VideoDto } from './video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  // by-id
  async byId(id: number, isPublic = false) {
    const video = await this.videoRepository.findOne({
      where: isPublic
        ? {
            id,
          }
        : { id },
      relations: {
        user: true,
        comments: {
          user: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerify: true,
          cubscribersCount: true,
          subscriptions: true,
        },
        comments: {
          message: true,
          id: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerify: true,
            cubscribersCount: true,
          },
        },
      },
    });
    if (!video) throw new NotFoundException('Video Is not Found');
    return video;
  }

  //update
  async update(id: number, dto: VideoDto) {
    const video = await this.byId(id);

    return this.videoRepository.save({
      ...video,
      ...dto,
    });
  }

  //subscribe

  //getAll
  async getAll(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};

    if (searchTerm) {
      options = {
        name: ILike(`%${searchTerm}%`),
      };
    }

    return this.videoRepository.find({
      where: {
        ...options,
        isPublic: true,
      },
      order: {
        createAt: 'DESC',
      },
      relations: {
        user: true,
        comments: {
          user: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerify: true,
        },
      },
    });
  }

  async getMostPopulByViews() {
    return this.videoRepository.find({
      where: {
        views: MoreThan(0),
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerify: true,
        },
      },
      order: {
        views: -1,
      },
    });
  }

  async create(userId: number) {
    const defaultValue = {
      name: '',
      user: { id: userId },
      videoPath: '',
      description: '',
      thumbnailPath: '',
    };

    const newVideo = this.videoRepository.create(defaultValue);
    const video = await this.videoRepository.save(newVideo);
    return video.id;
  }

  async delete(id: number) {
    return await this.videoRepository.delete({ id });
  }

  async updateCountViews(id: number) {
    const video = await this.byId(id);
    video.views++;
    return this.videoRepository.save(video);
  }

  async updateReaction(id: number) {
    const video = await this.byId(id);
    video.likes++;
    return this.videoRepository.save(video);
  }
}
