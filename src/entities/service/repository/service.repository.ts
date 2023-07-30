import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'domain', type: 'varchar' })
    domain: string;

    @Column({ name: 'host', type: 'varchar' })
    host: string;

    @Column({ name: 'port', type: 'int' })
    port: number;

    @Column({ name: 'is_active', type: 'boolean' })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}