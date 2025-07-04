
import type { LucideIcon } from 'lucide-react';

type PlaceholderAppProps = {
    name: string;
    icon: LucideIcon;
}

export function PlaceholderApp({ name, icon: Icon }: PlaceholderAppProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8">
            <Icon className="w-24 h-24 text-primary/30" strokeWidth={1} />
            <h2 className="text-2xl font-bold text-foreground/50">{name}</h2>
            <p className="text-lg text-center">This application is under construction.</p>
            <p className="text-sm text-center">Full functionality will be added in a future update.</p>
        </div>
    );
}
