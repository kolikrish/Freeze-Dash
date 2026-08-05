"use client";

import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a]">
      {/* Title */}
      <div className="text-center space-y-2 mb-8">
        <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 font-semibold text-xs rounded-full uppercase tracking-wider mb-1">
          Red Light, Green Light
        </span>
        <h1 className="text-[3.2rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-400 tracking-tight leading-none">
          FREEZE DASH
        </h1>
      </div>

      {/* Animated lights */}
      <div className="flex justify-center gap-6 mb-10">
        <div className="relative">
          <div className="w-10 h-10 bg-red-500 rounded-full shadow-red-500/50 shadow-2xl animate-pulse"></div>
          <div className="absolute inset-0 w-10 h-10 bg-red-500 blur rounded-full animate-ping opacity-80"></div>
        </div>
        <div className="relative">
          <div className="w-10 h-10 bg-green-500 rounded-full shadow-green-500/50 shadow-2xl animate-pulse"></div>
          <div className="absolute inset-0 w-10 h-10 bg-green-500 blur rounded-full animate-ping opacity-80"></div>
        </div>
      </div>

      {/* How to play */}
      <div className="bg-[#1F2A38] rounded-xl p-6 space-y-4 mb-10 max-w-md w-full">
        <h3 className="text-xl font-semibold text-white text-center">
          How to Play
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">
              GREEN: Tap and hold to move forward
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">
              RED: Stop immediately or lose!
            </span>
          </div>
        </div>
        <p className="text-gray-400 text-center text-sm">
          Reach the finish line fastest
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4 w-full max-w-sm">
        <Link
          href="/play"
          className="block text-center bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-lg transition-transform duration-200 transform hover:scale-105"
        >
          🎮 Play Single Player
        </Link>
        <Link
          href="/multiplayer"
          className="block text-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-transform duration-200 transform hover:scale-105"
        >
          🌐 Play Multiplayer
        </Link>
      </div>
    </div>
  );
};

export default Home;
