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
    basicUserId: number;

    @Column({ name: 'role_id', type: 'int', nullable: true })
    roleId?: number;

    @Column({ name: 'active', type: 'boolean' })
    active: boolean;

    @Column({ name: 'passhash', type: 'varchar' })
    passhash: string;

    @Column({ name: 'salt', type: 'varchar' })
    salt: string;

    @CreateDateColumn()
    createdAt: Date;
}