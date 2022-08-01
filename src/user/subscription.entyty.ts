import { UserEntity } from './user.entity';
import { VideoEntity } from 'src/video/videos.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from 'src/utils/base';

@Entity('Subscription')
export class SubscriptionEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: 'to_chanel_id' })
  toChannel: UserEntity;
}
