import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

@Entity("workers")
export class Worker {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    phone?: string;

    @Column()
    category!: string; // e.g. "Plumber", "Electrician"

    @Column({ type: "text", nullable: true })
    notes?: string;

    @OneToMany(() => Transaction, (transaction: Transaction) => transaction.worker)
    transactions!: Transaction[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
