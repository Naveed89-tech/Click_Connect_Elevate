import React from "react";

import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../ui/button";
import CustomerHighlight from "./customerHighligh";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50 z-10" />

      {/* Grid container */}
      <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 md:px-8 py-20 md:py-32">
        {/* Left Column - Content */}
        <div className="space-y-4 sm:space-y-8 order-2 lg:order-1 px-2 sm:px-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-secondary/10 rounded-full border border-secondary/20">
            <Zap
              className="w-4 h-4 sm:w-5 sm:h-5 text-secondary"
              fill="currentColor"
            />
            <span className="text-[14px] xs:text-[16px] sm:text-[18px] md:text-[20px] leading-none pb-0 text-secondary font-medium uppercase tracking-wider font-Montserrat">
              Control more, worry less
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white font-Roboto leading-20">
            The future is <span className="text-secondary">connected</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl max-w-2xl leading-relaxed text-white opacity-50 text-[20px]">
            Discover how our smart solutions help you streamline your life,
            manage your home, and stay connected effortlessly. From smart homes
            to AI-powered gadgets, we bring tomorrow's tech to your doorstep
            today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center w-full sm:w-auto">
            <Link to="/products" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto px-8 font-medium flex items-center justify-center gap-2 group"
              >
                Shop Now
                <ArrowRight className="inline w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link
              to="https://www.youtube.com/watch?v=NjYTzvAVozo"
              className="w-full sm:w-auto opacity-50"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-4 font-medium border-white text-white hover:bg-white/10"
              >
                Live Demo
              </Button>
            </Link>
          </div>

          {/* Customer Highlights */}
          <div className="pt-6 hidden sm:block">
            <CustomerHighlight />
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative order-1 lg:order-2 w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
          {/* Device glow effect */}
          <div className="absolute -right-10 sm:-right-16 md:-right-20 -top-10 sm:-top-16 md:-top-20 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 rounded-full bg-secondary/10 blur-3xl z-0" />

          {/* Main product image */}
          <img
            src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/hero%20one.png?raw=true"
            alt="Connected future illustration"
            className="relative z-10 w-full h-auto object-contain transition-transform duration-700 hover:scale-105"
          />

          {/* Floating elements */}
          <div className="absolute bottom-1 right-2 md:top-auto md:right-auto md:-bottom-10 md:-left-10 bg-white/5 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-white/10 shadow-lg z-20">
            <div className="text-white text-xs sm:text-sm font-Roboto">
              "Best in class connectivity"
            </div>
            <div className="text-secondary text-[10px] sm:text-xs mt-1">
              TechRadar
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
