"use client";

import { useEffect } from "react";

import { useGetCurrentUser } from "@/features/user/hooks";
import { useUserStore } from "@/features/user/store";
import { CTA, FAQ, Features, Footer, Header, Hero, HowItWorks, Pricing } from "@/sections";

export default function Home() {
  const { data: currentUser } = useGetCurrentUser();
  const { userActions } = useUserStore();

  useEffect(() => {
    userActions.setUser(currentUser);
  }, [currentUser, userActions]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
