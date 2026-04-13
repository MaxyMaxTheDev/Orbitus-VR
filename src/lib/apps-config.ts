import type { LucideIcon } from 'lucide-react';
import { 
    Clapperboard, Globe, LayoutGrid, Mail, Music, Settings,
    View, Users, BoxSelect, Gamepad2, Briefcase, Palette,
    Code, Bot, Calculator, Notebook, Blocks, Store, Bell,
    Cpu, Gauge, Newspaper, FolderOpen, BrainCircuit,
    Gamepad, Bird, Hash, Hexagon, Layers, Ghost, Monitor
} from "lucide-react";

import { AIAssistant } from '@/components/apps/ai-assistant';
import { ThemeStudio } from '@/components/apps/theme-studio';
import { MediaPlayer } from '@/components/apps/media-player';
import { Gallery360 } from '@/components/apps/360-gallery';
import { Workspace } from '@/components/apps/workspace';
import { Dashboard } from '@/components/apps/dashboard';
import { Browser } from '@/components/apps/browser';
import { VRChat } from '@/components/apps/vr-chat';
import { SculptVR } from '@/components/apps/sculpt-vr';
import { GameHub } from '@/components/apps/game-hub';
import { DevKit } from '@/components/apps/devkit';
import { MailApp } from '@/components/apps/mail';
import { MusicPlayer } from '@/components/apps/music-player';
import { SettingsApp } from '@/components/apps/settings-app';
import { CalculatorApp } from '@/components/apps/calculator';
import { NotepadApp } from '@/components/apps/notepad';
import { AppStore } from '@/components/apps/app-store';
import { MinecraftApp } from '@/components/apps/minecraft';
import { NotificationsApp } from '@/components/apps/notifications';
import { SystemMonitor } from '@/components/apps/system-monitor';
import { CodeProfiler } from '@/components/apps/code-profiler';
import { NewsFeedApp } from '@/components/apps/news-feed';
import { FileExplorer } from '@/components/apps/file-explorer';
import { NovaDev } from '@/components/apps/nova-dev';
import { UserAppRunner } from '@/components/apps/user-app-runner';
import { GeometryDashApp } from '@/components/apps/geometry-dash';
import { FlappyBirdApp } from '@/components/apps/flappy-bird';
import { Game2048App } from '@/components/apps/game-2048';
import { HextrisApp } from '@/components/apps/hextris';
import { PacmanApp } from '@/components/apps/pacman';
import { NovaVM } from '@/components/apps/nova-vm';

export type App = {
    name: string;
    icon: LucideIcon;
    component: React.FC;
    description: string;
    isInstallable?: boolean;
}

export const allApps: App[] = [
    { name: "Dashboard", icon: LayoutGrid, component: Dashboard, description: "A central hub displaying system status, AI insights, and the current time." },
    { name: "Browser", icon: Globe, component: Browser, description: "A web browser to display websites. Note: Many sites block embedding." },
    { name: "Media Player", icon: Clapperboard, component: MediaPlayer, description: "A video player for watching trailers, movies, and VR content." },
    { name: "VR Chat", icon: Users, component: VRChat, description: "A social chat room with AI personalities to interact with." },
    { name: "360 Gallery", icon: View, component: Gallery360, description: "An immersive gallery for viewing 360-degree panoramic images." },
    { name: "SculptVR", icon: BoxSelect, component: SculptVR, description: "A creative tool to generate 3D models from text descriptions using AI." },
    { name: "Game Hub", icon: Gamepad2, component: GameHub, description: "Your central portal for immersive and casual gaming." },
    { name: "Workspace", icon: Briefcase, component: Workspace, description: "A productivity app with a to-do list for managing tasks." },
    { name: "Theme Studio", icon: Palette, component: ThemeStudio, description: "A customization tool to change the UI's color theme in real-time." },
    { name: "DevKit", icon: Code, component: DevKit, description: "A developer tool that uses AI to explain code snippets." },
    { name: "Code Profiler", icon: Gauge, component: CodeProfiler, description: "Analyze code snippets with futuristic, AI-powered performance metrics." },
    { name: "News Feed", icon: Newspaper, component: NewsFeedApp, description: "A live feed of real-world headlines from global news channels." },
    { name: "File Explorer", icon: FolderOpen, component: FileExplorer, description: "Browse the virtual operating system's file structure." },
    { name: "Calculator", icon: Calculator, component: CalculatorApp, description: "A futuristic calculator for all your computational needs." },
    { name: "Notepad", icon: Notebook, component: NotepadApp, description: "A simple, persistent notepad for jotting down thoughts and ideas." },
    { name: "AI Assistant", icon: Bot, component: AIAssistant, description: "A conversational AI chatbot for asking questions and getting help." },
    { name: "Mail", icon: Mail, component: MailApp, description: "An email client for reading and managing real messages." },
    { name: "Notifications", icon: Bell, component: NotificationsApp, description: "View system alerts and updates from your apps." },
    { name: "Music Player", icon: Music, component: MusicPlayer, description: "An audio player for listening to a curated playlist of futuristic music." },
    { name: "System Monitor", icon: Cpu, component: SystemMonitor, description: "Monitors the real-time performance of the virtual OS, including CPU, GPU, and memory." },
    { name: "Settings", icon: Settings, component: SettingsApp, description: "A panel for configuring application and environment settings." },
    { name: "App Store", icon: Store, component: AppStore, description: "Download and manage new applications for NovaVR." },
    { name: "NovaDEV", icon: BrainCircuit, component: NovaDev, description: "Create your own apps for NovaVR using AI or by writing code.", isInstallable: true },
    { name: "NovaVM", icon: Monitor, component: NovaVM, description: "An immersive x86 virtual machine running Linux directly in your browser.", isInstallable: true },
    { name: "Minecraft", icon: Blocks, component: MinecraftApp, description: "The classic block-building adventure game. Install via the App Store.", isInstallable: true },
    { name: "Geometry Dash", icon: Gamepad, component: GeometryDashApp, description: "Jump and fly your way through danger in this rhythm-based action platformer!", isInstallable: true },
    { name: "Flappy Bird", icon: Bird, component: FlappyBirdApp, description: "The legendary bird-flapping challenge. Avoid the pipes and aim for a high score!", isInstallable: true },
    { name: "2048", icon: Hash, component: Game2048App, description: "Join the numbers and get to the 2048 tile!", isInstallable: true },
    { name: "Hextris", icon: Hexagon, component: HextrisApp, description: "A fast-paced hexagonal puzzle game. Match colors to survive!", isInstallable: true },
    { name: "PAC-MAN", icon: Ghost, component: PacmanApp, description: "The ultimate arcade classic. Waka waka your way to a high score!", isInstallable: true },
];

export { UserAppRunner };
