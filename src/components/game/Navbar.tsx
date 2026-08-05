import React from "react";
import { Users, Trophy } from "lucide-react";
import Link from "next/link";

type Props = {
  userName: string;
  playersOnline: number;
  playersEliminated: number;
};

const Navbar = ({ userName, playersOnline , playersEliminated }: Props) => (
  <div className="relative z-10 flex justify-between items-center px-4 py-2 bg-[#1F2A38]">
    <div className="text-white">{userName}</div>

    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <Users size={16} className="text-emerald-400" />
        <span className="text-white font-semibold">{playersOnline}</span>
        <span className="text-slate-300 text-xs">online</span>
        <span className="text-white font-semibold">{playersEliminated}</span>
        <span className="text-slate-300 text-xs">eliminated</span>
      </div>

      {/* <Link href="/leaderboard" className="flex items-center gap-2">
        <Trophy size={16} className="text-yellow-400" />
        <span className="text-slate-300 hover:text-slate-400 text-sm">
          Leaderboard
        </span>
      </Link> */}
    </div>
  </div>
);

export default Navbar;
