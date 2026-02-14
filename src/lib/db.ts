import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Worker } from "@/entities/Worker";
import { Client } from "@/entities/Client";
import { Transaction } from "@/entities/Transaction";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || "",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    synchronize: true, // Using synchronize for rapid development/demo
    logging: false,
    entities: [User, Worker, Client, Transaction],
});

let dataSourcePromise: Promise<DataSource> | null = null;

export const getDataSource = async () => {
    if (AppDataSource.isInitialized) return AppDataSource;

    if (!dataSourcePromise) {
        dataSourcePromise = AppDataSource.initialize();
    }

    return dataSourcePromise;
};
