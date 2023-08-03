import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('domain')
export class Domain {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'name', type: 'varchar'})
    name: string;

    @Column({ name: 'passhash', type: 'varchar' })
    passhash: string;

    @Column({ name: 'salt', type: 'varchar' })
    salt: string;

    @Column({ name: 'host', type: 'varchar' })
    host: string;

    @Column({ name: 'is_active', type: 'boolean' })
    isActive: boolean;

    @Column({ name: 'deactivated_at', type: 'timestamp' })
    deactivatedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;
}