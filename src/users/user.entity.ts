import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
  Column,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  readonly user_id?: number;

  @CreateDateColumn({ name: 'create_at' })
  readonly createdAt?: Timestamp;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt?: Timestamp;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'hashed_password' })
  hashedPassword: string;
}
