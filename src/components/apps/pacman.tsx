"use client";

export function PacmanApp() {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="relative w-full max-w-[600px] aspect-[4/3] shadow-2xl shadow-yellow-500/10">
        <iframe
          src="https://maxymaxthedev.github.io/pacman/"
          className="w-full h-full border-0 rounded-lg"
          title="PAC-MAN"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
