import { format, subDays, subHours, subMinutes } from 'date-fns';

export interface Email {
  id: string;
  from: string;
  fromAddress: string;
  subject: string;
  body: string;
  date: string; // "Apr 5" or "4:30 PM"
  fullDate: string; // "Apr 5, 2099, 4:30 PM"
  isUnread: boolean;
  avatar: string;
}

const now = new Date();

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'SynthRider',
    fromAddress: 'synth@nexus.net',
    subject: 'New track is fire!',
    body: `
Hey,

Just dropped my latest track, "Cybernetic Dawn". The vibes are totally rad, full of glitchy beats and neon synth waves. I think it would be perfect for the Orbital Stage next week.

Let me know what you think.

Catch you on the data stream,
Synth
    `.trim(),
    date: format(subMinutes(now, 5), 'p'),
    fullDate: format(subMinutes(now, 5), 'PPpp'),
    isUnread: true,
    avatar: 'S',
  },
  {
    id: '2',
    from: 'Oracle',
    fromAddress: 'oracle@aether.net',
    subject: 'A new thread has been woven',
    body: `
Traveler,

The data streams have converged, revealing a new insight. The path you walk is but one of infinite possibilities. Contemplate the echo of your choices.

The future is not a destination, but a continuously unfolding fractal.

Be mindful.
    `.trim(),
    date: format(subHours(now, 3), 'p'),
    fullDate: format(subHours(now, 3), 'PPpp'),
    isUnread: false,
    avatar: 'O',
  },
  {
    id: '3',
    from: 'XenovaVR Ops',
    fromAddress: 'ops@xenova.vr',
    subject: 'System Update v3.14.1 Complete',
    body: `
Greetings User,

This is an automated message to inform you that your XenovaVR environment has been successfully updated to version 3.14.1.

Patch notes:
- Improved quantum entanglement stability.
- Optimized aetheric consumption algorithms.
- Patched minor reality fissures in the SculptVR module.

Thank you for choosing XenovaVR.
    `.trim(),
    date: format(subDays(now, 1), 'MMM d'),
    fullDate: format(subDays(now, 1), 'PPpp'),
    isUnread: false,
    avatar: 'X',
  },
    {
    id: '4',
    from: 'Ana Digital',
    fromAddress: 'ana.d@sculptvr.pro',
    subject: 'Re: Project Phoenix Collab',
    body: `
Hi there,

Thanks for reaching out! I'd love to collaborate on Project Phoenix. Your work on emergent procedural generation is groundbreaking. I've attached my portfolio of sculpted worlds for your review.

I'm free to sync up anytime next cycle.

Best,
Ana
    `.trim(),
    date: format(subDays(now, 2), 'MMM d'),
    fullDate: format(subDays(now, 2), 'PPpp'),
    isUnread: false,
    avatar: 'A',
  },
    {
    id: '5',
    from: 'HoloNet News',
    fromAddress: 'digest@holonet.news',
    subject: 'Your Weekly HoloNet Digest',
    body: `
**Top Stories from this Cycle:**

- **Titan Conglomerate Acquires Mars Terraforming Corp:** Megacorp consolidation continues as Titan extends its influence across the Sol system.
- **AI Philosopher "Nous-7" Publishes New Treatise:** The controversial AI's latest work on synthetic consciousness has sparked debate among human and AI academics alike.
- **Anomalous Signal Detected from TRAPPIST-1 System:** Deep space explorers report strange, repeating signals from the exoplanetary system. Investigation is underway.

Stay connected with HoloNet News.
    `.trim(),
    date: format(subDays(now, 4), 'MMM d'),
    fullDate: format(subDays(now, 4), 'PPpp'),
    isUnread: true,
    avatar: 'H',
  },
];

export function getMockEmails(): Email[] {
    return mockEmails;
}
