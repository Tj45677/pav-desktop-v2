"use client";

import { useMemo, useRef, useState, useEffect } from "react";

type TerminalLine =
  | { type: "output"; content: string }
  | { type: "input"; content: string };

const renderFormattedText = (text: string) => {
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);

    return (
      <span key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <span
                key={partIndex}
                style={{
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {part.slice(2, -2)}
              </span>
            );
          }

          return <span key={partIndex}>{part}</span>;
        })}
        {lineIndex < lines.length - 1 ? "\n" : null}
      </span>
    );
  });
};

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
    `Project [1/4]

Interactive Desktop Web Application Platform
Independent Project — Remote
March 2026

- Built a desktop-style web application simulating an operating system interface using **Next.js** and **React**
- Developed a reusable window system with **minimize/maximize**, **z-index layering**, and **state-driven UI**
- Implemented modular applications including a **music player**, **browser**, and **terminal**
- Designed **route-based state mapping** for deep linking and scalable navigation
- Structured the project using **component-based architecture** for maintainability and expansion
- Deployed the production build using **Vercel**
- Repository: **github.com/Tj45677/pav-desktop-v2/tree/main**

Press Enter for next entry
Press Escape to exit`,

    `Project [2/4]

Private Cloud File Hosting Platform
Independent Collaboration — Remote
Sept 2025

- Deployed **Linux-based infrastructure** supporting multi-user file storage and hosted services
- Orchestrated services using **Docker Compose** for scalable container management
- Configured **SSO (Authentik)** to centralize authentication and improve access security
- Implemented **DNS routing**, **firewall rules**, and container-level access controls
- Built redundant storage using **ZFS** to protect data integrity and reduce risk of data loss
- Automated deployment workflows to improve consistency and reduce manual setup time

Press Enter for next entry
Press Escape to exit`,

    `Project [3/4]

Enterprise Network & Server Infrastructure Project
Algonquin College — Ottawa, ON
Jan 2023 – Apr 2023

- Designed and deployed a multi-server environment simulating enterprise infrastructure
- Configured **OSPF**, **BGP**, and **VLAN segmentation** for WAN routing and network isolation
- Administered **Windows Server** services including **Active Directory**, **DNS**, and **DHCP**
- Deployed **virtualization environments** for scalable hosting and testing
- Automated monitoring and data handling using **Python** and **SQL**

Press Enter for next entry
Press Escape to exit`,

    `Project [4/4]

Independent Music Producer & Audio Engineer
Self Directed — Ottawa, ON
2021 – Present

- Designed and built a recording setup using **XLR signal chain**, **audio interface**, and **DAW** integration
- Recorded, mixed, and mastered audio using **Steinberg Cubase**
- Applied **signal processing** and routing throughout the production workflow
- Managed full production pipeline including recording, editing, mixing, and mastering
- Organized digital assets and distribution workflows for released music projects
- Produced multimedia content including video and visual assets for releases

Press Enter for next entry
Press Escape to exit`,
  ],
  []
);
  const experienceItems = useMemo(
    () => [
      `Experience [1/6]

Barber — Spark Barbershop
Gatineau, QC
Jan 2026 – Present

- Managed **end-to-end operations** including scheduling, payments, inventory, and customer communication
- Controlled **budgeting** and supply purchasing to maintain cost efficiency
- Built strong client relationships through **customer service** and attention to detail
- Continuously improved techniques through **iterative training** and feedback

Press Enter for next entry
Press Escape to exit`,

    `Experience [2/6]

Vehicle Salesman — Southbank Dodge
Ottawa, ON
Nov 2025 – Present

- Assisted customers through **needs analysis** to match vehicles based on budget and requirements
- Explained **technical specifications**, trims, financing, and warranties clearly
- Conducted test drives and structured product demonstrations
- Managed **lead pipeline**, follow-ups, and appointment scheduling
- Coordinated with finance and service teams for smooth **cross-department delivery**
- Maintained product knowledge across Dodge, Jeep, Chrysler, and RAM
- Built rapport driving **client retention**, referrals, and repeat business

Press Enter for next entry
Press Escape to exit`,

    `Experience [3/6]

Sales Representative — Ottawa Fight and Fitness
Ottawa, ON
Aug 2025 – Present

- Converted **inbound marketing leads** (Instagram ads) through rapid response and sales calls
- Managed full **lead lifecycle** including communication, scheduling, and follow-ups
- Adapted sales strategy based on **client intent** and engagement level
- Collaborated with trainers for seamless **handoff and conversion**
- Monitored **conversion rates** and optimized call timing for performance
- Maintained professional communication to build long-term memberships

Press Enter for next entry
Press Escape to exit`,

    `Experience [4/6]

Barber — Basement Barber
Ottawa, ON
Sept 2023 – July 2025

- Grew a loyal client base through **client retention strategies** and consistent service
- Managed operations including scheduling, payments, inventory, and communication
- Leveraged **social media marketing (Instagram)** to increase bookings (80%+ repeat clients)
- Maintained **health and safety compliance** (Barbicide Certification)
- Controlled budgeting and supply management to maintain accessibility
- Strengthened client relationships through professionalism and reliability

Press Enter for next entry
Press Escape to exit`,

    `Experience [5/6]

Automotive Technician — True Auto Service
Ottawa, ON
July 2020 – Sept 2023

- Diagnosed issues using **system-level troubleshooting** across mechanical systems
- Performed repairs on **drivetrain, braking, and suspension systems**
- Conducted routine maintenance ensuring system performance and reliability
- Assisted with **welding and fabrication** for structural repairs
- Managed operations including invoicing and tracking using **QuickBooks**
- Coordinated parts inventory and vendor sourcing to reduce downtime
- Communicated technical issues and solutions clearly to customers

Press Enter for next entry
Press Escape to exit`,

    `Experience [6/6]

Barber — Phresh Men’s Salon
Ottawa, ON
Nov 2019 – July 2020

- Delivered high-volume service in a fast-paced environment
- Maintained **sanitation and public health standards**
- Managed front desk operations including scheduling and **point-of-sale systems**
- Built repeat clientele through personalized service
- Operated within a **commission-based performance model**
- Supported team operations including restocking and tool maintenance

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
                {renderFormattedText(line.content)}
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