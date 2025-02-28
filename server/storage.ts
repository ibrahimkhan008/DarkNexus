import { users, news, gateways, type User, type News, type Gateway, type InsertUser, type InsertNews, type InsertGateway } from "@shared/schema";

export interface IStorage {
  validateAccessKey(key: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  updateUserCredits(id: number, credits: number): Promise<void>;
  updateUserProxy(id: number, proxy: Partial<User>): Promise<void>;
  updateUserLanguage(id: number, language: string): Promise<void>;
  
  getNews(): Promise<News[]>;
  addNews(news: InsertNews): Promise<News>;
  
  getGateways(): Promise<Gateway[]>;
  getGateway(id: number): Promise<Gateway | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private news: Map<number, News>;
  private gateways: Map<number, Gateway>;
  private currentId: Record<string, number>;

  constructor() {
    this.users = new Map();
    this.news = new Map();
    this.gateways = new Map();
    this.currentId = { users: 1, news: 1, gateways: 1 };

    // Add demo data
    this.users.set(1, {
      id: 1,
      accessKey: "demo123",
      credits: 1000,
      language: "en",
      proxyHost: null,
      proxyPort: null,
      proxyUser: null,
      proxyPass: null
    });

    this.gateways.set(1, {
      id: 1,
      name: "Stripe Charge",
      endpoint: "/api/gateways/stripe",
      active: true
    });

    this.gateways.set(2, {
      id: 2, 
      name: "PayPal Direct",
      endpoint: "/api/gateways/paypal",
      active: true
    });

    this.news.set(1, {
      id: 1,
      title: "Welcome!",
      content: "Welcome to Nezuko Card Checker",
      createdAt: new Date().toISOString()
    });
  }

  async validateAccessKey(key: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.accessKey === key);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUserCredits(id: number, credits: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, credits });
    }
  }

  async updateUserProxy(id: number, proxy: Partial<User>): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...proxy });
    }
  }

  async updateUserLanguage(id: number, language: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, language });
    }
  }

  async getNews(): Promise<News[]> {
    return Array.from(this.news.values());
  }

  async addNews(news: InsertNews): Promise<News> {
    const id = this.currentId.news++;
    const newNews = { ...news, id };
    this.news.set(id, newNews);
    return newNews;
  }

  async getGateways(): Promise<Gateway[]> {
    return Array.from(this.gateways.values());
  }

  async getGateway(id: number): Promise<Gateway | undefined> {
    return this.gateways.get(id);
  }
}

export const storage = new MemStorage();
