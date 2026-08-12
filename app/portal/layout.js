import { AuthGate } from "@/components/AuthGate";
import { PortalShell } from "@/components/PortalShell";

export const metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }) {
  return (
    <AuthGate>
      <PortalShell>{children}</PortalShell>
    </AuthGate>
  );
}

