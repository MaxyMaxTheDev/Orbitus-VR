
"use client";

export function MinecraftApp() {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src="https://mcraft.fun"
        frameBorder="0"
        className="w-full h-full"
        allowFullScreen
        title="Minecraft"
      ></iframe>
    </div>
  );
}
