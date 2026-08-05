import React from "react";
import { AlertTriangle } from "lucide-react";

const GameOverModal = () => {
  const handleReload = () => {
    window.location.reload(); // Full page reload
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#1F2A38] rounded-2xl p-8 text-center shadow-2xl">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-2">GAME OVER</h2>
        <p className="text-slate-300 mb-6">
          You moved during RED LIGHT! or TIME OUT. Better luck next time.
        </p>
        <button
          onClick={handleReload}
          className="block bg-emerald-400 mx-auto text-[#1A212D] font-bold py-2 px-4 rounded-lg hover:bg-emerald-300"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
