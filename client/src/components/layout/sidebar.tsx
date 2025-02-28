import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CreditCard, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-screen w-64 bg-sidebar fixed left-0 top-0 border-r border-sidebar-border"
    >
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          Nezuko Chk
        </h1>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                location === item.href && "bg-sidebar-accent text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 px-6 text-xs text-sidebar-foreground/60">
        <a
          href="https://t.me/NezukoChk0wner"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Crafted by Nezuko
        </a>
      </div>
    </motion.div>
  );
}
