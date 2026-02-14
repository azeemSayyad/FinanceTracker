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
 * This restores class names and registers fallback entity lookups for relationships.
 */
function fixTypeORMMinification() {
    const storage = getMetadataArgsStorage();

    // Hardcoded mapping of entity classes to their original names
    // This is the most reliable way to handle minification in production
    const entities = [
        { target: User, name: "User" },
        { target: Worker, name: "Worker" },
        { target: Client, name: "Client" },
        { target: Transaction, name: "Transaction" },
    ];

    entities.forEach(({ target, name }) => {
        Object.defineProperty(target, "name", {
            value: name,
            configurable: true,
        });
    });

    // Also ensure the table metadata is consistent
    storage.tables.forEach((table: any) => {
        if (table.target instanceof Function) {
            // Find if this target is in our list
            const found = entities.find(e => e.target === table.target);
            if (found) {
                Object.defineProperty(table.target, "name", {
                    value: found.name,
                    configurable: true,
                });
            }
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
