"use client";

import { useEffect } from "react";

import { Navbar } from "@/components/Navbar";
import { useGetCurrentUser } from "@/features/user/hooks";
import { useUserStore } from "@/features/user/store";

import { Footer, Hero, HowItWorks } from "@/sections";

export default function Home() {
  const { data: currentUser } = useGetCurrentUser();
  const { userActions } = useUserStore();

  useEffect(() => {
    userActions.setUser(currentUser);
  }, [currentUser, userActions]);

  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}
