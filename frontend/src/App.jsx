import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import Paths from "./components/Paths.jsx";
import LiveTaskChain from "./components/LiveTaskChain.jsx";
import Mentors from "./components/Mentors.jsx";
import CTA from "./components/CTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Paths />
        <LiveTaskChain />
        <Mentors />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
