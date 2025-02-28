import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/layout/sidebar";
import GatewayCard from "@/components/gateway-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { type Gateway, type News } from "@shared/schema";
import { Link } from "wouter"; // Added import for Link from wouter
import Button from "@/components/ui/button"; // Assuming Button component exists

export default function Dashboard() {
  const { t } = useTranslation();

  const { data: gateways } = useQuery<Gateway[]>({
    queryKey: ["/api/gateways"],
  });

  const { data: news } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-primary mb-8">
            {t("dashboard.welcome")}
          </h1>

          {news && news.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Latest News</h2>
              <ScrollArea className="h-[200px]">
                {news.slice(0, 2).map((item) => (
                  <Alert key={item.id || item.title} className="mb-4">
                    <AlertTitle>{item.title}</AlertTitle>
                    <AlertDescription>
                      {item.content.substring(0, 100)}
                      {item.content.length > 100 && "..."}
                    </AlertDescription>
                  </Alert>
                ))}
                {news.length > 2 && (
                  <div className="text-center">
                    <Link href="#" onClick={() => document.querySelector('button:has(.lucide-bell)')?.click()}>
                      <Button variant="outline" size="sm">
                        View All News
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {(!news || news.length === 0) && (
            <div className="mb-8">
              <Alert>
                <AlertTitle>No Latest News</AlertTitle>
                <AlertDescription>There are currently no news items to display.</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gateways?.map((gateway, index) => (
              <GatewayCard key={gateway.id} gateway={gateway} index={index} />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}