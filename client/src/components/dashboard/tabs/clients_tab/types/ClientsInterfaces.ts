export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "owner" | "user";
  status: "active" | "inactive" | "pending";
  createdAt: { _seconds: number; _nanoseconds: number };
  active: boolean;
}

export interface Company {
  companyEmail: string;
  companyName: string;
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  nextPaymentDate: string;
  owner: User;
  users: User[];
  createdAt: { _seconds: number; _nanoseconds: number };
  deleted?: boolean;
}

export interface CompanyDashboardProps {
  cardClass: string;
  mutedTextClass: string;
  darkMode: boolean;
}

export interface NewCompanyForm {
  companyName: string;
  companyEmail: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
}
