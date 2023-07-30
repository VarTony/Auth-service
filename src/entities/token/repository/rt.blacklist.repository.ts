import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RefreshToken } from "./refresh.token.repository";

@Entity('rt-blacklist')
export class RTBlacklist {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(_ => RefreshToken, rt => rt.id)
    @Column({ name: 'token-id', type: 'int' })
    tokenId: number;

    @CreateDateColumn()
    createdAt: Date;
}