import type { LucideIcon } from 'lucide-react';
import { 
    Clapperboard, Globe, LayoutGrid, Mail, Music, Settings,
    View, Users, BoxSelect, Gamepad2, Heart, Briefcase, Palette,
    Code, Bot, Calculator, Notebook, Blocks, Store, Bell, Trophy, CheckCircle, AlertTriangle
} from "lucide-react";

import { AIAssistant } from '@/components/apps/ai-assistant';
import { ThemeStudio } from '@/components/apps/theme-studio';
import { MediaPlayer } from '@/components/apps/media-player';
import { Gallery360 } from '@/components/apps/360-gallery';
import { Workspace } from '@/components/apps/workspace';
import { Wellness } from '@/components/apps/wellness';
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

export type App = {
    name: string;
    icon: LucideIcon;
    component: React.FC;
    description: string;
    isInstallable?: boolean;
}

export const allApps: App[] = [
    { name: "Dashboard", icon: LayoutGrid, component: Dashboard, description: "A central hub displaying system status, AI insights, and the current time." },
    { name: "Browser", icon: Globe, component: Browser, description: "A web browser that can access and summarize content from URLs using AI." },
    { name: "Media Player", icon: Clapperboard, component: MediaPlayer, description: "A video player for watching trailers, movies, and VR content." },
    { name: "VR Chat", icon: Users, component: VRChat, description: "A social chat room with AI personalities to interact with." },
    { name: "360 Gallery", icon: View, component: Gallery360, description: "An immersive gallery for viewing 360-degree panoramic images." },
    { name: "SculptVR", icon: BoxSelect, component: SculptVR, description: "A creative tool to generate 3D models from text descriptions using AI." },
    { name: "Game Hub", icon: Gamepad2, component: GameHub, description: "A portal for playing simple, fun mini-games." },
    { name: "Wellness", icon: Heart, component: Wellness, description: "A relaxation and mindfulness app with guided breathing exercises." },
    { name: "Workspace", icon: Briefcase, component: Workspace, description: "A productivity app with a to-do list for managing tasks." },
    { name: "Theme Studio", icon: Palette, component: ThemeStudio, description: "A customization tool to change the UI's color theme in real-time." },
    { name: "DevKit", icon: Code, component: DevKit, description: "A developer tool that uses AI to explain code snippets." },
    { name: "Calculator", icon: Calculator, component: CalculatorApp, description: "A futuristic calculator for all your computational needs." },
    { name: "Notepad", icon: Notebook, component: NotepadApp, description: "A simple, persistent notepad for jotting down thoughts and ideas." },
    { name: "AI Assistant", icon: Bot, component: AIAssistant, description: "A conversational AI chatbot for asking questions and getting help." },
    { name: "Mail", icon: Mail, component: MailApp, description: "An email client for reading and managing messages." },
    { name: "Notifications", icon: Bell, component: NotificationsApp, description: "View system alerts and updates from your apps." },
    { name: "Music Player", icon: Music, component: MusicPlayer, description: "An audio player for listening to a curated playlist of futuristic music." },
    { name: "Settings", icon: Settings, component: SettingsApp, description: "A panel for configuring application and environment settings." },
    { name: "App Store", icon: Store, component: AppStore, description: "Download and manage new applications for NexusVR." },
    { name: "Minecraft", icon: Blocks, component: MinecraftApp, description: "The classic block-building adventure game. Install via the App Store.", isInstallable: true },
];
