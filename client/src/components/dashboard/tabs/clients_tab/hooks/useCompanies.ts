import { useEffect, useState } from "react";
import type {
  Company,
  NewCompanyForm,
  NewUserForm,
  User,
} from "../types/ClientsInterfaces";
import axios from "axios";
import Swal from "sweetalert2";

export function useCompanies(initialCompanies: Company[]) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/company/companies");
      const companies = response.data as Company[];

      const companiesWithUsers = await Promise.all(
        companies.map(async (company) => {
          const userIds = company.users as User[];

          const users = await Promise.all(
            userIds.map(async (uid) => {
              const res = await axios.get(
                `http://localhost:4000/api/users/${uid}`
              );
              return res.data as User;
            })
          );

          return { ...company, users };
        })
      );

      setCompanies(companiesWithUsers);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async (
    form: NewCompanyForm,
    onSuccess: () => void,
    onError: () => void
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/company/create-company",
        form
      );
      setCompanies((prev) => [...prev, response.data as Company]);
      onSuccess();
      Swal.fire({
        icon: "success",
        title: "Company created!",
        text: "The new company has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      onError();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating company in database.",
      });
    }
  };

  const addUserToCompany = async (
    companyId: string,
    form: NewUserForm,
    onSuccess: () => void,
    onError: () => void
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/add-user-to-company",
        { companyId, ...form }
      );
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? { ...company, users: [...company.users, response.data as User] }
            : company
        )
      );
      onSuccess();
      Swal.fire({
        icon: "success",
        title: "User added!",
        text: "The new user has been added to the company.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      onError();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding user to company.",
      });
    }
  };

  return {
    companies,
    setCompanies,
    addCompany,
    addUserToCompany,
    fetchCompanies,
  };
}
