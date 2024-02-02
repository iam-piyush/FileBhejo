import React from "react";
import Hero from "./Hero";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DonotWorry } from "./DonotWorry";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen xl:px-48 lg:px-44 md:px-24 sm:px-4">
      <div className="flex-grow">
        <Header />
        <Hero />
      </div>
      <DonotWorry />
      <Footer />
    </div>
  );
}
