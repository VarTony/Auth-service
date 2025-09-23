import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity('secret')
export class Secret {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'secret', type: 'varchar' })
  secret: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'deactivated_at', type: 'timestamp' })
  expireAt: Date;
}
