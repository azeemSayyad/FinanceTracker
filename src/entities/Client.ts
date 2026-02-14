import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

@Entity("clients")
export class Client {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @OneToMany(() => Transaction, (transaction: Transaction) => transaction.client)
    transactions!: Transaction[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
