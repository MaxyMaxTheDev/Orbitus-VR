import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clapperboard, Globe, LayoutGrid, Mail, Music, Settings } from "lucide-react";

const apps = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Browser", icon: Globe },
    { name: "Media Player", icon: Clapperboard },
    { name: "Mail", icon: Mail },
    { name: "Music", icon: Music },
    { name: "Settings", icon: Settings },
];

export function AppLauncher() {
  return (
    <Card className="w-full max-w-2xl bg-card/60 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/20 animate-float">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline text-accent tracking-widest">
          APP LAUNCHER
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {apps.map((app) => (
            <Button
              key={app.name}
              variant="ghost"
              className="flex flex-col items-center justify-center h-32 gap-2 text-foreground/80 hover:text-accent hover:bg-primary/20 transition-all duration-300 rounded-lg group"
            >
              <app.icon className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-body">{app.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
