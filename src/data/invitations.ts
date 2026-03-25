import { UserRole, type Invitation } from "@/types";

export const invitations: Invitation[] = [
  {
    id: "invite-1",
    agency_id: "agency-1",
    email: "newdesigner@example.com",
    role: UserRole.GENERAL_USER,
    status: "pending",
    invited_by: "user-1",
    token: "demo-invite-token-123",
    expires_at: "2026-04-25",
    created_at: "2026-03-20",
  },
  {
    id: "invite-2",
    agency_id: "agency-2",
    email: "viewer@example.com",
    role: UserRole.READ_ONLY_USER,
    status: "pending",
    invited_by: "user-6",
    token: "demo-invite-token-456",
    expires_at: "2026-04-25",
    created_at: "2026-03-22",
  },
];
