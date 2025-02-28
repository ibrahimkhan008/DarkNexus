
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type MobileLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  title?: string;
};

export function MobileLayout({ children, sidebar, title }: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = React.useState(false);

  if (!isMobile) {
    return (
      <>
        {sidebar}
        {children}
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(true)}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold truncate">{title || "Nezuko Card Checker"}</h1>
      </header>

      {/* Mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="absolute top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-background overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  );
}

export default MobileLayout;
