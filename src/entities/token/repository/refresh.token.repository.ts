import { User } from "@user/repository";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('refresh-token')
export class RefreshToken {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(_ => User, user => user.id)
    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'token', type: 'varchar' })
    token: string;

    @Column({ name: 'is_active', type: 'boolean' })
    isActive: boolean;

    @Column({ name: 'location', type: 'varchar' })
    location: string;

    @Column({ name: 'digit_imprint', type: 'varchar' })
    digitImprint: string;

    @Column({ name: 'deactivated_at', type: 'timestamp', nullable: true })
    deactivatedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;
}