import { VideoEntity } from 'src/video/videos.entity';
import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Base } from 'src/utils/base';
import { UserEntity } from 'src/user/user.entity';

@Entity('Comment')
export class CommentEntity extends Base {
  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => VideoEntity, (video) => video.comments)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;
}
