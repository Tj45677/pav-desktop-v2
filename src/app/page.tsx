


import DesktopShell from "@/components/desktop/DesktopShell";
import DesktopManager from "@/components/desktop/DesktopManager";
import UISounds from "@/components/desktop/UISounds";

export default function Home() {
  return (
    <DesktopShell>
      <UISounds />
      <DesktopManager />
    </DesktopShell>
  );
}
