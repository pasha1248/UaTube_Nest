import { AuthDto } from './auth.dto';
import { UserEntity } from 'src/user/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, getSalt, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    return {
      user: this.returnUserFields(user),
      accessToken: await this.AccessToken(user.id),
    };
  }

  async registration(dto: AuthDto) {
    const oldUser = await this.userRepository.findOneBy({ email: dto.email });
    if (oldUser) {
      throw new BadRequestException('Email already here');
    }

    const salt = await genSalt(3);

    const newUser = await this.userRepository.create({
      email: dto.email,
      password: await hash(dto.password, salt),
    });
    const user = await this.userRepository.save(newUser);

    return {
      user: this.returnUserFields(user),
      AccessToken: await this.AccessToken(user.id),
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: ['id', 'email', 'password'],
    });

    if (!user) throw new NotFoundException('Users is not found');

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Password is not good');
    }

    return user;
  }

  async AccessToken(userid: number) {
    const data = {
      id: userid,
    };

    return await this.jwtService.signAsync(data, {
      expiresIn: '21d',
    });
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
