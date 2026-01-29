import { randomUUID } from "crypto";
import type { Document } from "@shared/schema";

export interface IStorage {
  createDocument(rawText: string): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
}

export class MemStorage implements IStorage {
  private documents: Map<string, Document>;

  constructor() {
    this.documents = new Map();
  }

  async createDocument(rawText: string): Promise<Document> {
    const id = randomUUID();
    const document: Document = { id, rawText };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }
}

export const storage = new MemStorage();
