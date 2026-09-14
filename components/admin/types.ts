export type AdminTab = "dashboard" | "messages" | "employees" | "calendar";

export type EmployeeRole = "ADMIN" | "MANAGER" | "WORKER";

export type Employee = {
  id: string;
  discordId: string;
  username: string;
  globalName?: string | null;
  avatar?: string | null;
  role: EmployeeRole;
  permissions: string[];
  createdAt?: string;
  lastActive?: string | null;
  lastLogin?: string | null;
};

export type MessageHistory = {
  id: string;
  messageId: string;
  action: string;
  createdAt: string;
  employeeId: string | null;
  employee?: {
    id: string;
    discordId: string;
    username: string;
    globalName: string | null;
    avatar: string | null;
    role: string;
  } | null;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  body: string;
  status: "NEW" | "IN_PROGRESS" | "WAITING" | "DONE" | "CLOSED";
  assignedTo?: string | null;
  createdAt: string;
  history: MessageHistory[];
};
