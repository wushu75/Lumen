import { RagIndex } from "@lumen/ai";
import { Vault } from "@lumen/core";

/**
 * Shared, in-memory application state for the MVP. Swap Vault for a SQLite-backed
 * store and RagIndex for a pgvector-backed one without touching the routes.
 */
export const vault = new Vault();
export const rag = new RagIndex();
