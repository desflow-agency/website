export type AdminTab =
  | "dashboard"
  | "messages"
  | "employees"



export type AdminUser = {

  id: string;

  discordId?: string;

  username: string;

  globalName?: string;

  avatar?: string;

  role:
    | "ADMIN"
    | "MANAGER"
    | "EMPLOYEE";

  permissions: string[];

};


export type Employee = {

  id: string;

  discordId: string;

  username: string;

  globalName?: string;

  avatar?: string;

  role:
    | "ADMIN"
    | "MANAGER"
    | "EMPLOYEE";

  permissions: string[];

  createdAt?: string;

  lastActive?: string;

};




export type MessageHistory = {

  id:string;

  messageId:string;

  action:string;

  createdAt:string;

  employeeId:string | null;


  employee?: {

    id:string;

    discordId:string;

    username:string;

    globalName:string | null;

    avatar:string | null;

    role:string;

  } | null;

};


export type ContactMessage = {

  id: string;

  name: string;

  email: string;

  phone?: string;

  company?: string;

  body: string;


  status:
    | "NEW"
    | "IN_PROGRESS"
    | "DONE"
    | "CLOSED";


  assignedTo?: string | null;


  createdAt:string;


  history: MessageHistory[];

};