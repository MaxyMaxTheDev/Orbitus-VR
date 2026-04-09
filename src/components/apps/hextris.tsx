"use client";

export function HextrisApp() {
  return (
    <div className="w-full h-full bg-[#222] flex items-center justify-center">
      <iframe
        src="https://hextris.io/"
        className="w-full h-full border-0"
        title="Hextris"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
