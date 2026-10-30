// Synthetic demo workspaces for the login prototype. Fictional people and
// hospitals only — these are NOT accounts and grant no access.

export type DemoRole = "patient" | "doctor" | "receptionist" | "manager" | "admin";

export type DemoWorkspace = {
  role: DemoRole;
  roleLabel: string;
  hospital: string | null;
  destination: string;
  description: string;
};

export type DemoProfile = {
  id: string;
  name: string;
  workspaces: DemoWorkspace[];
};

const ws = {
  patient: {
    role: "patient",
    roleLabel: "Patient",
    hospital: null,
    destination: "Patient Dashboard",
    description: "Book and manage hospital appointments and view your own healthcare information.",
  },
  doctor: (hospital: string): DemoWorkspace => ({
    role: "doctor",
    roleLabel: "Doctor",
    hospital,
    destination: "Doctor Workspace",
    description: "See today's appointment schedule and manage consultations for this hospital.",
  }),
  receptionist: (hospital: string): DemoWorkspace => ({
    role: "receptionist",
    roleLabel: "Receptionist",
    hospital,
    destination: "Receptionist Workspace",
    description: "Check patients in, manage the front-desk queue and arrange appointments.",
  }),
  manager: (hospital: string): DemoWorkspace => ({
    role: "manager",
    roleLabel: "Hospital Manager",
    hospital,
    destination: "Hospital Manager Workspace",
    description: "Manage departments, staff membership and hospital-level settings.",
  }),
  admin: {
    role: "admin",
    roleLabel: "Platform Administrator",
    hospital: null,
    destination: "Platform Administration",
    description: "Review hospital partnership applications and oversee the platform.",
  },
} as const;

export const demoProfiles: DemoProfile[] = [
  { id: "patient", name: "Demo Patient", workspaces: [ws.patient] },
  { id: "doctor", name: "Demo Doctor", workspaces: [ws.doctor("Fictional Alex Hospital")] },
  { id: "receptionist", name: "Demo Receptionist", workspaces: [ws.receptionist("Fictional Alex Hospital")] },
  { id: "manager", name: "Demo Hospital Manager", workspaces: [ws.manager("Fictional Jimmy Hospital")] },
  { id: "admin", name: "Demo Platform Administrator", workspaces: [ws.admin] },
  {
    id: "multi",
    name: "Demo Multi-Workspace User",
    workspaces: [ws.doctor("Fictional Alex Hospital"), ws.manager("Fictional Jimmy Hospital")],
  },
];
