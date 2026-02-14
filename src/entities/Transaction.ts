import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Worker } from "./Worker";
import type { Client } from "./Client";
import { TransactionType } from "@/lib/types";

@Entity("transactions")
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("decimal", { precision: 12, scale: 2 })
    amount!: number;

    @Column({
        type: "enum",
        enum: TransactionType,
    })
    type!: TransactionType;

    @Column({ type: "timestamp" })
    date!: Date;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ nullable: true })
    workerId?: string;

    @ManyToOne("Worker", (worker: Worker) => worker.transactions, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "workerId" })
    worker?: Worker;

    @Column({ nullable: true })
    clientId?: string;

    @ManyToOne("Client", (client: Client) => client.transactions, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "clientId" })
    client?: Client;

    @CreateDateColumn()
    createdAt!: Date;
}
