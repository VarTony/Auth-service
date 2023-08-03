import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "../../service/repository/service.repository";

@Entity('auth-user')
export class AuthUser {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToMany(_ => Service, service => service.id)
    @Column({ name: 'service_id', type: 'int' })
    serviceId: number;

    @Column({ name: 'basic_user_id', type: 'int' })
    nativeUserId: number;

    @Column({ name: 'login', type: 'varchar' })
    login: string;

    @Column({ name: 'email', type: 'varchar', nullable: true })
    email?: string;

    @Column({ name: 'phone', type: 'varchar', nullable: true })
    phone?: string;

    @Column({ name: 'role_id', type: 'int', nullable: true })
    roleId?: number;

    @Column({ name: 'is_active', type: 'boolean' })
    isActive: boolean;

    @Column({ name: 'password', type: 'varchar', nullable: true })
    password?: string;

    @Column({ name: 'passhash', type: 'varchar', nullable: true })
    passhash?: string;

    @Column({ name: 'salt', type: 'varchar', nullable: true })
    salt?: string;

    @Column({ name: 'deactivated_at', type: 'timestamp', nullable: true })
    deactivatedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;
}