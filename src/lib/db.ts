import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Worker } from "@/entities/Worker";
import { Client } from "@/entities/Client";
import { Transaction } from "@/entities/Transaction";
import { getMetadataArgsStorage } from "typeorm";

/**
 * Workaround for Next.js minification mangling class names in production.
 * TypeORM uses constructor names to find entity metadata, which breaks when mangled.
 * This manually restores the class name from the entity's table metadata.
 */
function fixTypeORMMinification() {
    const storage = getMetadataArgsStorage();
    storage.tables.forEach((table) => {
        if (table.target instanceof Function) {
            Object.defineProperty(table.target, "name", {
                value: (table as any).name || (table.target as any).name,
                configurable: true,
            });
        }
    });
}

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
        fixTypeORMMinification();
        dataSourcePromise = AppDataSource.initialize();
    }

    return dataSourcePromise;
};
