
"use client";

export function MinecraftApp() {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src="https://prismarine-e91ajc481-zaro.vercel.app/"
        className="w-full h-full border-0"
        title="Minecraft"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
