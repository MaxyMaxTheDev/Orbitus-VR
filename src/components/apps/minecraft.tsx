
"use client";

export function MinecraftApp() {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src="https://mcraft.fun"
        className="w-full h-full border-0"
        title="Minecraft"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
