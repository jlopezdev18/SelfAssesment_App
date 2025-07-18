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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/company/companies"
      );
      const companies = response.data as Company[];
      const activeCompanies = companies.filter(company => !company.deleted);


      const companiesWithUsers = await Promise.all(
        activeCompanies.map(async (company) => {
          const userIds = company.users as User[];

          let users: User[] = [];
          if (userIds && userIds.length > 0) {
            users = await Promise.all(
              userIds.map(async (uid) => {
                const res = await axios.get(
                  `http://localhost:4000/api/users/${uid}`
                );
                return res.data as User;
              })
            );
          }

          return { ...company, users };
        })
      );

      setCompanies(companiesWithUsers);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
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
    setLoading(true);
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
      fetchCompanies(); // Refresh the list of companies
    } catch {
      onError();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating company in database.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUserToCompany = async (
    companyId: string,
    form: NewUserForm,
    onSuccess: () => void,
    onError: () => void
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/company/add-user-to-company",
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
      fetchCompanies(); // Refresh the list of companies
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
    } finally {
      setLoading(false);
    }
  };

 const deleteCompany = async (companyId: string, onError: () => void) => {
  setLoading(true);
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will deactivate the company and all its users!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) {
      setLoading(false);
      return;
    }
    const response = await axios.delete(
      `http://localhost:4000/api/company/delete-company/${companyId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      setCompanies((prev) =>
        prev.map((company) => 
          company.id === companyId 
            ? { ...company, status: 'inactive', deleted: true }
            : company
        )
      );
      await Swal.fire({
        icon: "success",
        title: "Company deleted!",
        text: "The company has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchCompanies();
    }
  } catch  {
    onError();
     Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error deleting company.",
      });
  } finally {
    setLoading(false);
  }
};

  return {
    companies,
    setCompanies,
    addCompany,
    deleteCompany,
    addUserToCompany,
    fetchCompanies,
    loading,
  };
}
