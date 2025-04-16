import { Footer } from "../Footer";
import { MainContent } from "../MainContent";
import { Navbar } from "../Navbar";
import React, { memo } from "react";

interface WebsiteLayoutProps {
  children: React.ReactNode;
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

export const WebsiteLayout = memo(({ children, user, setUser }: WebsiteLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Pass user and setUser to Navbar */}
      <Navbar user={user} setUser={setUser} />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
});