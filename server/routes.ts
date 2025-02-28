import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { accessKey } = req.body;
      
      if (!accessKey || typeof accessKey !== 'string') {
        return res.status(400).json({ message: "Invalid request, accessKey is required" });
      }
      
      const user = await storage.validateAccessKey(accessKey);

      if (!user) {
        return res.status(401).json({ message: "Invalid access key" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error during login" });
    }
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
  app.get("/api/news", async (req, res) => {
    try {
      // Mock news data
      const news = [
        {
          title: "Braintree Update",
          content: "Braintree API has been upgraded to v2.0 with enhanced fraud detection capabilities. All merchants are encouraged to update their integration by the end of the month."
        },
        {
          title: "New Payment Method",
          content: "We've added support for Apple Pay! Integrate this popular payment method to improve your conversion rates on iOS devices. Check the documentation for implementation details."
        },
        {
          title: "Maintenance Notice",
          content: "Scheduled maintenance will take place on July 15th from 2:00 AM to 4:00 AM UTC. During this time, the test environment will be unavailable, but production services will not be affected."
        },
        {
          title: "Security Enhancement",
          content: "We've implemented additional security measures to protect against card testing attacks. These changes are automatically applied to all merchants and require no action on your part."
        }
      ];
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news", error });
    }
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