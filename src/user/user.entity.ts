import { VideoEntity } from 'src/video/videos.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from 'src/utils/base';
import { SubscriptionEntity } from './subscription.entyty';

@Entity('User')
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: false, name: 'is_verified' })
  isVerify: boolean;

  @Column({ default: 0, name: 'cubscribers_count' })
  cubscribersCount?: number;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '', type: 'text', name: 'avatar_path' })
  avatarPath: string;

  @OneToMany(() => VideoEntity, (video) => video.user)
  videos: VideoEntity[];

  @OneToMany(() => SubscriptionEntity, (sub) => sub.fromUser)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => SubscriptionEntity, (sub) => sub.toChannel)
  subscribers: SubscriptionEntity[];
}
