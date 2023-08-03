import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'domain_id', type: 'varchar' })
    domainId: number;

    @Column({ name: 'port', type: 'int', nullable: true })
    port?: number;

    @Column({ name: 'is_active', type: 'boolean' })
    isActive: boolean;

    @Column({ name: 'deactivated_at', type: 'timestamp', nullable: true })
    deactivatedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;
}