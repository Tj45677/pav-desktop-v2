export type TerminalCommand = {
  description: string;
  output: string | (() => string);
};

export const terminalCommands: Record<string, TerminalCommand> = {
  help: {
    description: "List available commands",
    output: () =>
      `
Available commands:

help        Show this list
about       About me
projects    View technical projects
skills      Technical skills
contact     Contact information
clear       Clear terminal
`.trim(),
  },

  about: {
    description: "About me",
    output: `
Taha Korkmaz

Computer Networking graduate with hands-on experience in
enterprise networking, system administration, and modern
web application development.

Focused on building scalable systems, clean architectures,
and real-world applications.
`.trim(),
  },

  projects: {
    description: "View projects",
    output: `
Interactive Desktop Web Application Platform
- Built a desktop-style OS in the browser using Next.js + React
- Multi-window system with focus, minimize, maximize
- Route-based app launching system
- Modular apps (Music, Browser, Terminal)
- Real audio playback system

Private Cloud File Hosting Platform
- Linux-based infrastructure with Docker
- Authentik SSO integration
- ZFS storage + redundancy
- Secure networking and automation
`.trim(),
  },

  skills: {
    description: "Technical skills",
    output: `
Networking: OSPF, BGP, VLANs, TCP/IP
Systems: Linux, Windows Server, Active Directory
Web: React, Next.js, TypeScript
Tools: Docker, Git, SQL
`.trim(),
  },

  contact: {
    description: "Contact info",
    output: `
Email: tj45677@gmail.com
Location: Ottawa, ON
`.trim(),
  },
};