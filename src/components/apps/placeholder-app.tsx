
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Globe, 
    Users, 
    Gamepad2,
} from 'lucide-react';
import Image from 'next/image';

type PlaceholderAppProps = {
    name: string;
    icon: LucideIcon;
}

const GenericPlaceholder = ({ name, icon: Icon }: PlaceholderAppProps) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8">
        <Icon className="w-24 h-24 text-primary/30" strokeWidth={1} />
        <h2 className="text-2xl font-bold text-foreground/50">{name}</h2>
        <p className="text-lg text-center">This application is under construction.</p>
        <p className="text-sm text-center">Full functionality will be added in a future update.</p>
    </div>
);

const BrowserPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8">
        <Globe className="w-24 h-24 text-primary/30" strokeWidth={1} />
        <h2 className="text-2xl font-bold text-foreground/50">Browser</h2>
        <div className="w-full max-w-md flex gap-2 mt-4">
            <Input disabled placeholder="https://..." className="bg-black/30 border-primary/50" />
            <Button disabled>Go</Button>
        </div>
        <p className="text-sm text-center mt-4">Web browsing is coming soon.</p>
    </div>
);

const VRChatPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8">
        <Users className="w-24 h-24 text-primary/30" strokeWidth={1} />
        <h2 className="text-2xl font-bold text-foreground/50">VR Chat</h2>
        <div className="flex gap-4 mt-4 animate-pulse">
            <div className="p-4 rounded-lg bg-black/20 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/50 mx-auto mb-2 flex items-center justify-center"><Users className="w-8 h-8"/></div>
                <p>Virtual_User1</p>
            </div>
             <div className="p-4 rounded-lg bg-black/20 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/50 mx-auto mb-2 flex items-center justify-center"><Users className="w-8 h-8"/></div>
                <p>SynthRider</p>
            </div>
        </div>
        <p className="text-sm text-center mt-4">Connect with others in virtual spaces soon.</p>
    </div>
);

const GameHubPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8">
        <Gamepad2 className="w-24 h-24 text-primary/30" strokeWidth={1} />
        <h2 className="text-2xl font-bold text-foreground/50">Game Hub</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <Card className="bg-transparent border-primary/30"><CardContent className="p-2"><Image data-ai-hint="space battle" src="https://placehold.co/200x300.png" alt="Game 1" width={100} height={150} className="rounded-md" /></CardContent></Card>
            <Card className="bg-transparent border-primary/30"><CardContent className="p-2"><Image data-ai-hint="neon race" src="https://placehold.co/200x300.png" alt="Game 2" width={100} height={150} className="rounded-md" /></CardContent></Card>
        </div>
        <p className="text-sm text-center mt-4">Your portal to immersive games is on its way.</p>
    </div>
);

export function PlaceholderApp(props: PlaceholderAppProps) {
    switch(props.name) {
        case 'Browser': return <BrowserPlaceholder />;
        case 'VR Chat': return <VRChatPlaceholder />;
        case 'Game Hub': return <GameHubPlaceholder />;
        default:
            return <GenericPlaceholder {...props} />;
    }
}
