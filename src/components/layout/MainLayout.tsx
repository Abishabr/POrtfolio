import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { BinaryBackground } from "@/components/terminal";

interface MainLayoutProps {
  children: ReactNode;
  showBinaryBg?: boolean;
}

export const MainLayout = ({ children, showBinaryBg = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative">
      {showBinaryBg && <BinaryBackground opacity={0.03} speed={50} />}
      <Navigation />
      <main className="pt-16 relative z-10">{children}</main>
      <Footer />
    </div>
  );
};
