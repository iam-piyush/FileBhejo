import React from "react";
import Hero from "./Hero";
import { Header } from "./Header";

export default function Home() {
  return (
    <div className="xl:px-48 lg:px-44 md:px-24 sm:px-4">
        <Header />
        <Hero />
    </div>
  );
}
