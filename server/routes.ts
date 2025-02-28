import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    const { accessKey } = req.body;
    const user = await storage.validateAccessKey(accessKey);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid access key" });
    }

    return res.json(user);
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.patch("/api/user/:id/proxy", async (req, res) => {
    const { proxyHost, proxyPort, proxyUser, proxyPass } = req.body;
    await storage.updateUserProxy(parseInt(req.params.id), {
      proxyHost, proxyPort, proxyUser, proxyPass
    });
    res.json({ success: true });
  });

  app.patch("/api/user/:id/language", async (req, res) => {
    const { language } = req.body;
    await storage.updateUserLanguage(parseInt(req.params.id), language);
    res.json({ success: true });
  });

  // News routes
  app.get("/api/news", async (_req, res) => {
    const news = await storage.getNews();
    res.json(news);
  });

  // Gateway routes
  app.get("/api/gateways", async (_req, res) => {
    const gateways = await storage.getGateways();
    res.json(gateways);
  });

  // Mock card check endpoint
  app.post("/api/gateways/:gateway/check", async (req, res) => {
    const { card } = req.body;
    const userId = parseInt(req.query.userId as string);
    
    const user = await storage.getUser(userId);
    if (!user || user.credits < 1) {
      return res.status(402).json({ message: "Insufficient credits" });
    }

    // Deduct credit
    await storage.updateUserCredits(userId, user.credits - 1);

    // Mock response
    const responses = [
      { emoji: "✅", status: "APPROVED", msg: "Card approved!" },
      { emoji: "❌", status: "DECLINED", msg: "Card declined - insufficient funds" },
      { emoji: "❌", status: "DECLINED", msg: "Card declined - incorrect CVV" }
    ];

    res.json(responses[Math.floor(Math.random() * responses.length)]);
  });

  return httpServer;
}
