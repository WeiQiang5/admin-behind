import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    comment: '账号名',
    unique: true,
  })
  username: string;

  @Column({
    length: 200,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 100,
    comment: '个性签名',
    nullable: true,
  })
  signName?: string;
  @Column({
    length: 200,
    comment: '头像',
    nullable: true,
  })
  picImg?: string;
  @Column({
    comment: '年龄',
    nullable: true,
  })
  age?: number;
  @Column({
    length: 100,
    comment: '电话号码',
    nullable: true,
  })
  phone?: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime?: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime?: Date;
}
