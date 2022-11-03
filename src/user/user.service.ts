import { UserDto } from './user.dto';
import { SubscriptionEntity } from './subscription.entyty';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionEntity: Repository<SubscriptionEntity>,
  ) {}

  // by-id
  async byId(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        videos: true,
        subscriptions: {
          toChannel: true,
        },
      },
      order: {
        createAt: 'DESC',
      },
    });
    if (!user) throw new NotFoundException('user Is not Found');
    return user;
  }

  //update
  async updateProfle(id: number, dto: UserDto) {
    const user = await this.byId(id);

    const isSameUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (isSameUser && id !== isSameUser.id)
      throw new BadRequestException('Email is busy');

    if (dto.password) {
      const salt = await genSalt(4);
      user.password = await hash(dto.password, salt);
    }

    user.email = dto.email;
    user.name = dto.name;
    user.description = dto.description;
    user.avatarPath = dto.avatarPath;
    return this.userRepository.save(user);
  }

  //subscribe
  async subscribe(id: number, channeId: number) {
    const data = {
      toChannel: { id: channeId },
      fromUser: { id },
    };
    const isSubscribed = await this.subscriptionEntity.findOneBy(data);
    if (!isSubscribed) {
      const newSubscription = await this.subscriptionEntity.create(data);
      await this.subscriptionEntity.save(newSubscription);
      return true;
    }

    await this.subscriptionEntity.delete(data);
    return false;
  }

  //getAll
  async getAll() {
    return this.userRepository.find();
  }
}
