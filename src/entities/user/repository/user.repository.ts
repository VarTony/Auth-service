import { Column, CreateDateColumn, Entity, ManyToOne, Unique, PrimaryGeneratedColumn } from "typeorm";
import { Domain } from "@domain/index";


@Entity('user')
@Unique([ 'login', 'domainId' ])
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'native_user_id', type: 'int' })
    nativeUserId: number;

    // @ManyToOne(_ => Domain, domain => domain.id)
    @Column({ name: 'domain_id', type: 'int' })
    domainId: number;

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

    @Column({ name: 'passhash', type: 'varchar', nullable: true })
    passhash?: string;

    @Column({ name: 'salt', type: 'varchar', nullable: true })
    salt?: string;

    @Column({ name: 'deactivated_at', type: 'timestamp', nullable: true })
    deactivatedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;
}