export type FileSystemItem = {
  name: string;
  type: 'folder' | 'file';
  size: string;
  lastModified: string;
  content?: string;
};

export const getMockFileSystem = (username: string): Record<string, FileSystemItem[]> => ({
  root: [
    { name: 'apps', type: 'folder', size: '1.2 GB', lastModified: '2099-03-15' },
    { name: 'system', type: 'folder', size: '4.5 GB', lastModified: '2099-03-14' },
    { name: 'users', type: 'folder', size: '8.7 GB', lastModified: '2099-03-16' },
    { name: 'README.txt', type: 'file', size: '2 KB', lastModified: '2099-01-01', content: 'Welcome to OrbitusVR.\n\nThis is a virtual operating system designed to be a customizable home environment.\nUse the dock below to launch applications and explore your new digital world.' },
  ],
  apps: [
    { name: 'Browser.app', type: 'file', size: '150 MB', lastModified: '2099-03-12' },
    { name: 'SculptVR.app', type: 'file', size: '320 MB', lastModified: '2099-03-10' },
    { name: 'Theme Studio.app', type: 'file', size: '50 MB', lastModified: '2099-03-11' },
    { name: 'System Monitor.app', type: 'file', size: '120 MB', lastModified: '2099-03-13' },
  ],
  system: [
    { name: 'kernel.bin', type: 'file', size: '2.1 GB', lastModified: '2099-03-14', content: '01001011 01000101 01010010 01001110 01000101 01001100\n494e4954 2e2e2e2e 564f4944 2e2e2e2e 4c4f4144 494e47\n... [BINARY DATA REDACTED FOR SECURITY] ...' },
    { name: 'boot.log', type: 'file', size: '512 KB', lastModified: '2099-03-14', content: `[0.0001] OrbitusVR Kernel v3.14 initializing...\n[0.0002] Aetheric interface online.\n[0.0003] Quantum entanglement module loaded.\n[0.0004] Loading user profile: ${username}\n[0.0005] All systems nominal. Welcome to the future.` },
    { name: 'drivers', type: 'folder', size: '1.8 GB', lastModified: '2099-03-13' },
  ],
  users: [
    { name: username, type: 'folder', size: '5.2 GB', lastModified: '2099-03-16' },
    { name: 'Guest', type: 'folder', size: '128 KB', lastModified: '2099-03-16' },
  ],
  [username]: [
    { name: 'documents', type: 'folder', size: '1.1 GB', lastModified: '2099-03-15' },
    { name: 'holorecordings', type: 'folder', size: '4.1 GB', lastModified: '2099-03-16' },
    { name: 'config.ini', type: 'file', size: '5 KB', lastModified: '2099-03-16', content: `[Settings]\nUsername=${username}\nTheme=Dark\nAccent=Blue\nHandCursors=true` },
  ],
  documents: [
    { name: 'project_phoenix.txt', type: 'file', size: '12 KB', lastModified: '2099-02-28', content: 'Project Phoenix - Top Secret\n\nPhase 1: Complete\nPhase 2: In Progress\n\nNotes: The simulation is more stable than anticipated. The subjects are adapting well to the virtual environment.' },
  ],
  holorecordings: [],
  drivers: [],
  Guest: [],
});
