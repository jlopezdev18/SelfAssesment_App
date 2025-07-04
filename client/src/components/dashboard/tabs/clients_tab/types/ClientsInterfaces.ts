export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "owner" | "user";
  status: "active" | "inactive" | "pending";
  joinedDate: string;
}

export interface Company {
  companyEmail: any;
  companyName: any;
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  nextPaymentDate: string;
  owner: User;
  users: User[];
  createdDate: string;
}

export interface CompanyDashboardProps {
  cardClass: string;
  textClass: string;
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