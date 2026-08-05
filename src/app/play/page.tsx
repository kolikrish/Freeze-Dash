"use client";
import GameArea from "@/components/game/GameArea";
import GameOverModal from "@/components/game/Gameover";
import WinModal from "@/components/game/Winmodal";
import Navbar from "@/components/game/Navbar";
import { GameStateenum } from "@/utils/types/game";

import { useState } from "react";

const Page = () => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [state, setState] = useState<GameStateenum>(GameStateenum.PLAYING);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <>
      <Navbar userName="Player1" playersOnline={1} playersEliminated={0} />
      <GameArea
        setScore={setScore}
        setTime={setTime}
        setState={setState}
      />
      {state === GameStateenum.OVER && <GameOverModal />}
      {state === GameStateenum.WON && <WinModal onRestart={handleRestart} />}
    </>
  );
};

export default Page;
