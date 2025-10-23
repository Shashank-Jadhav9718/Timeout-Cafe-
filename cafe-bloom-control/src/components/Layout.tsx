import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Coffee } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        <div className="absolute inset-0 coffee-pattern-bg pointer-events-none" />
        <AppSidebar />
        
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-primary">Timeout Cafe</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background/95 backdrop-blur-sm">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}