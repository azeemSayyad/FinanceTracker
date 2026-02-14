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
    const entityMap = new Map<string, any>();
    
    // Restore entity class names and build map
    storage.tables.forEach((table: any) => {
        if (table.target instanceof Function) {
            const tableName = table.name;
            // Restore the class name property
            Object.defineProperty(table.target, "name", {
                value: tableName,
                configurable: true,
            });
            // Store in map for relationship lookups
            entityMap.set(tableName, table.target);
        }
    });
    
    // Fix relationship metadata references
    storage.relations.forEach((relation: any) => {
        if (typeof relation.type === 'function') {
            const relationType = relation.type();
            if (relation.target instanceof Function) {
                // Ensure the target entity in relationships can be found
                const entityName = relation.target.name;
                if (!entityMap.has(entityName)) {
                    entityMap.set(entityName, relation.target);
                }
            }
        }
    });
    
    // Patch TypeORM's entity lookup to use our map as fallback
    if ((global as any).__typeormEntityMap === undefined) {
        (global as any).__typeormEntityMap = entityMap;
    }
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
