import type { DB } from "./types"

export declare const sqlite: unknown
export declare const db: DB
export declare function initializeDB(): Promise<void>
export declare function migrateDB(): Promise<void>
export declare function exportDB(): Promise<Blob>
/**
 * Deletes the database file, normally you should reload the app after calling this function.
 */
export declare function deleteDB(): Promise<void>
