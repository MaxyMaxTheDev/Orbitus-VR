"use client";

export function Game2048App() {
  return (
    <div className="w-full h-full bg-[#faf8ef] flex items-center justify-center">
      {/* 
        The classic 2048 game is best viewed in its original container size.
      */}
      <div className="relative w-full h-full max-w-[500px] max-h-[700px] shadow-2xl shadow-black/20">
        <iframe
          src="https://gabrielecirulli.github.io/2048/"
          className="w-full h-full border-0"
          title="2048"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
