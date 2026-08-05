import React from "react";
import { Trophy } from "lucide-react";
import Link from "next/link";

interface WinModalProps {
  onRestart?: () => void;
  redirectUrl?: string;
  buttonText?: string;
}

const WinModal: React.FC<WinModalProps> = ({ onRestart, redirectUrl, buttonText }) => (
  <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
    <div className="bg-[#1F2A38] rounded-2xl p-8 text-center shadow-2xl">
      <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-emerald-400 mb-2">
        CONGRATULATIONS!
      </h2>
      <p className="text-slate-300 mb-6">
        You finished the race! Great job!
      </p>
      {onRestart ? (
        <button
          onClick={onRestart}
          className="block w-full bg-emerald-400 text-[#1A212D] font-bold py-2 px-4 rounded-lg hover:bg-emerald-300 transition"
        >
          {buttonText || "Play Again"}
        </button>
      ) : (
        <Link
          href={redirectUrl || "/multiplayer"}
          className="block w-full bg-yellow-400 text-[#1A212D] font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition"
        >
          {buttonText || "View Leaderboard"}
        </Link>
      )}
    </div>
  </div>
);

export default WinModal;
