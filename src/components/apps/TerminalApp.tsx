"use client";

import { useMemo, useRef, useState, useEffect } from "react";

type TerminalLine =
  | { type: "output"; content: string }
  | { type: "input"; content: string };

export function TerminalTitleBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        minWidth: 0,
      }}
    >
      <img
        src="/powershell.png"
        alt="PowerShell"
        style={{ width: "16px", height: "16px", flexShrink: 0 }}
      />
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Administrator: Taha Korkmaz
      </span>
    </div>
  );
}

export function TerminalApp() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: "output",
      content: `SuperShell [Version 1.0.0]

TJK Interactive Environment
Session initialized successfully.

Portfolio modules and media tools are available.
https://tj45677.ca/

Type 'help' to get started.`,
    },
  ]);
  const [viewerItems, setViewerItems] = useState<string[] | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const projectItems = useMemo(
    () => [
      `Project [1/3]

Interactive Desktop Web Application Platform

- Built a desktop-style OS-inspired web app using Next.js, React, and TypeScript
- Implemented reusable window management with minimize, maximize, focus, and layering
- Developed modular applications including music player, browser, and terminal
- Added route-based startup behavior for direct desktop entry points
- Implemented real audio playback, track management, custom media controls, and a command-driven terminal

Press Enter for next entry
Press Escape to exit`,
      `Project [2/3]

Private Cloud File Hosting Platform

- Deployed Linux-based backend infrastructure with Docker Compose
- Configured Authentik SSO and secure service access
- Built redundant ZFS-backed storage
- Automated deployment and maintenance workflows

Press Enter for next entry
Press Escape to exit`,
      `Project [3/3]

Enterprise Network & Server Infrastructure Project

- Configured OSPF, BGP, VLAN segmentation, and firewall rules
- Administered Windows Server services including AD, DNS, DHCP, and Exchange
- Used Python and SQL for monitoring and data management

Press Enter for next entry
Press Escape to exit`,
    ],
    []
  );

  const experienceItems = useMemo(
    () => [
      `Experience [1/9]

Vehicle Salesman — Southbank Dodge
Ottawa, ON
Nov 2025 – Present

- Assisted customers in selecting new and used vehicles based on needs, budget, and preferred features
- Explained specs, trim levels, financing options, and warranties clearly
- Conducted test drives and walk-around demonstrations
- Managed inquiries, follow-ups, and appointment scheduling
- Coordinated with finance and service departments for smooth delivery
- Maintained product knowledge across Dodge, Jeep, Chrysler, and RAM
- Built rapport to drive repeat business, reviews, and referrals

Press Enter for next entry
Press Escape to exit`,
      `Experience [2/9]

Sales Representative — Ottawa Fight and Fitness
Ottawa, ON
Aug 2025 – Present

- Converted Instagram advertising leads into clients through rapid follow-up and sales calls
- Managed lead communication, booking, and follow-ups for intro sessions
- Adapted sales strategy based on client needs and fit
- Collaborated with trainers to support in-person conversions
- Tracked performance and refined timing to improve close rates
- Maintained a professional and supportive client experience

Press Enter for next entry
Press Escape to exit`,
      `Experience [3/9]

Barber — Basement Barber
Ottawa, ON
Sept 2023 – July 2025

- Built a loyal client base through consistent, personalized service
- Managed scheduling, payments, inventory, and customer communication
- Promoted services through Instagram and referrals
- Maintained hygiene and safety standards with Barbicide COVID-19 Certification
- Managed budgeting and supply purchasing
- Strengthened retention through professionalism and attention to detail

Press Enter for next entry
Press Escape to exit`,
      `Experience [4/9]

Independent Music Producer & Multimedia Artist — Self-Employed
Remote
Sept 2023 – Present

- Wrote, produced, recorded, edited, and mixed original music
- Directed and produced music videos from concept to edit
- Created promotional visual assets and branding
- Managed end-to-end creative workflows and release timelines
- Distributed music across digital platforms and supported audience growth

Press Enter for next entry
Press Escape to exit`,
      `Experience [5/9]

Automotive Technician — True Auto Service
Ottawa, ON
July 2020 – Sept 2023

- Performed mechanical repairs and routine maintenance
- Assisted with welding and fabrication tasks
- Managed invoicing, quoting, and sales tracking in QuickBooks
- Coordinated parts inventory and vendor ordering
- Communicated repair issues and timelines clearly to customers

Press Enter for next entry
Press Escape to exit`,
      `Experience [6/9]

Dedicated Minecraft Server Hosting Infrastructure — Algonquin College
Ottawa, ON
Jan 2023 – Apr 2023

- Built and maintained dedicated server infrastructure for hosted Minecraft services
- Configured virtualization, storage, and networking for multiple instances
- Applied enterprise routing, redundancy, and security controls
- Administered Windows Server, Azure integration, and Exchange
- Used SQL and Python for monitoring and player data management
- Maintained DNS, DHCP, web, and email services

Press Enter for next entry
Press Escape to exit`,
      `Experience [7/9]

Barber — Phresh Men’s Salon
Ottawa, ON
Nov 2019 – July 2020

- Delivered high-quality haircuts and grooming in a fast-paced environment
- Managed front desk duties and POS transactions
- Built repeat clientele through personalized service
- Supported day-to-day shop operations and sanitation

Press Enter for next entry
Press Escape to exit`,
      `Experience [8/9]

Poll Clerk — Elections Canada
Ottawa, ON
Oct 2019

- Registered voters and verified identification
- Issued and collected ballots while maintaining procedure and accuracy
- Assisted with polling station setup, closeout, and vote-counting documentation

Press Enter for next entry
Press Escape to exit`,
      `Experience [9/9]

Technician — RB Computing Inc.
Ottawa, ON
Sept 2017 – Jan 2018

- Assembled and repaired desktop computers
- Performed secure data destruction
- Diagnosed hardware issues and explained repair options to customers
- Maintained organized and safe technical workspaces

Press Enter for next entry
Press Escape to exit`,
    ],
    []
  );

  const commands = useMemo(
    () => ({
      help: `Available commands:

help        Show this list
about       About me
projects    View technical projects
experience  View work experience
skills      Technical skills
contact     Contact information
clear       Clear terminal`,

      about: `Taha Korkmaz

Computer Networking graduate with hands-on experience in
enterprise networking, system administration, and web application development.

Built a desktop-style interactive portfolio platform with
modular apps, route-based startup behavior, and real media playback.`,

      skills: `Networking
- OSPF, BGP, VLANs, IPv4/IPv6, subnetting

Systems
- Linux, Windows Server, Active Directory, Group Policy, VMware

Security / Services
- DNS, DHCP, firewall configuration, FTP, SMTP, Wireshark, SNMP

Development
- React, Next.js, TypeScript, Python, SQL, Docker`,

      contact: `Email: tj45677@gmail.com
Phone: (613) 600-7290
Location: Ottawa, ON`,

      clear: "",
    }),
    []
  );

  const exitViewer = () => {
    setViewerItems(null);
    setViewerIndex(0);
    setHistory((prev) => [
      ...prev,
      {
        type: "output",
        content: "Exited viewer mode.",
      },
    ]);
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();

    if (!command) return;

    if (command === "clear") {
      setHistory([]);
      setViewerItems(null);
      setViewerIndex(0);
      return;
    }

    if (command === "projects") {
      setViewerItems(projectItems);
      setViewerIndex(0);
      setHistory((prev) => [
        ...prev,
        { type: "input", content: rawCommand },
        { type: "output", content: projectItems[0] },
      ]);
      return;
    }

    if (command === "experience") {
      setViewerItems(experienceItems);
      setViewerIndex(0);
      setHistory((prev) => [
        ...prev,
        { type: "input", content: rawCommand },
        { type: "output", content: experienceItems[0] },
      ]);
      return;
    }

    const output =
      commands[command as keyof typeof commands] ??
      `Command not recognized: ${command}

Type 'help' to see available commands.`;

    setHistory((prev) => [
      ...prev,
      { type: "input", content: rawCommand },
      { type: "output", content: output },
    ]);
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  return (
    <div
      onMouseDown={() => {
        inputRef.current?.focus();
      }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#012456",
        color: "white",
        fontFamily: "Consolas, monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px",
          margin: 0,
          fontSize: "18px",
          whiteSpace: "pre-wrap",
        }}
      >
        {history.map((line, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            {line.type === "input" ? (
              <div>{`PS C:\\Users\\Admin> ${line.content}`}</div>
            ) : (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                }}
              >
                {line.content}
              </pre>
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{`PS C:\\Users\\Admin>`}</span>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (viewerItems) {
                if (e.key === "Escape") {
                  e.preventDefault();
                  exitViewer();
                  setInput("");
                  return;
                }

                if (e.key === "Enter") {
                  e.preventDefault();

                  const nextIndex = viewerIndex + 1;

                  if (nextIndex >= viewerItems.length) {
                    setViewerItems(null);
                    setViewerIndex(0);
                    setHistory((prev) => [
                      ...prev,
                      {
                        type: "output",
                        content: "End of entries.",
                      },
                    ]);
                  } else {
                    setViewerIndex(nextIndex);
                    setHistory((prev) => [
                      ...prev,
                      {
                        type: "output",
                        content: viewerItems[nextIndex],
                      },
                    ]);
                  }

                  setInput("");
                  return;
                }
              }

              if (e.key === "Enter") {
                runCommand(input);
                setInput("");
              }
            }}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontFamily: "inherit",
              fontSize: "inherit",
              caretColor: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
}