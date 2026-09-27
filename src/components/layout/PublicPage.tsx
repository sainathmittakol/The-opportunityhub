import type { ReactNode } from "react";
import { PublicFooter, PublicHeader } from "./PublicHeader";

export function PublicPage({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <div className={wide ? "" : "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6"}>{children}</div>
      </main>
      <PublicFooter />
    </div>
  );
}
