"use client";

export function TowerGameApp() {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <iframe
        src="https://clun33.github.io/tower_game/"
        className="w-full h-full border-0"
        title="Tower Game"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
