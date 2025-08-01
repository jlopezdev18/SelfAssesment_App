import { useEffect, useState } from "react";
import type {
  Company,
  NewCompanyForm,
  NewUserForm,
  User,
} from "../types/ClientsInterfaces";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export function useCompanies(initialCompanies: Company[]) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/company/companies`);
      const companies = response.data as Company[];
      const activeCompanies = companies.filter(company => !company.deleted);


      const companiesWithUsers = await Promise.all(
        activeCompanies.map(async (company) => {
          const userIds = company.users as User[];

          let users: User[] = [];
          if (userIds && userIds.length > 0) {
            users = await Promise.all(
              userIds.map(async (uid) => {
                const res = await axios.get(`${API_URL}/api/users/${uid}`);
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
        `${API_URL}/api/company/create-company`,
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
        `${API_URL}/api/company/add-user-to-company`,
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

  const editUser = async (
  userId: string,
  companyId: string,
  form: NewUserForm,
  onSuccess: () => void,
  onError: () => void
) => {
  setLoading(true);
  try {
    const response = await axios.put(
      `${API_URL}/api/company/update-user/${userId}`,
      {
        ...form,
        active: true
      }
    );

    if (response.status === 200) {
      setCompanies((prev) =>
        prev.map((company) => {
          if (company.id === companyId) {
            return {
              ...company,
              users: company.users.map((user) =>
                user.id === userId
                  ? {
                      ...user,
                      firstName: form.firstName,
                      lastName: form.lastName,
                      email: form.email
                    }
                  : user
              )
            };
          }
          return company;
        })
      );
      onSuccess();
      await Swal.fire({
        icon: "success",
        title: "User updated!",
        text: "The user has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchCompanies();
    }
  } catch {
    onError();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error updating user.",
    });
  } finally {
    setLoading(false);
  }
};

const deleteUser = async (userId: string, companyId: string) => {
  setLoading(true);
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will deactivate the user's access!",
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
      `${API_URL}/api/company/delete-user/${companyId}/${userId}`
    );

    if (response.status === 200) {
      setCompanies((prev) =>
        prev.map((company) => {
          if (company.id === companyId) {
            return {
              ...company,
              users: company.users.filter((user) => user.id !== userId)
            };
          }
          return company;
        })
      );

      await Swal.fire({
        icon: "success",
        title: "User deleted!",
        text: "The user has been deactivated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchCompanies();
    }
  } catch {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error deleting user.",
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
      `${API_URL}/api/company/delete-company/${companyId}`,
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
            ? { ...company, active: false, deleted: true }
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

const updateCompany = async (
  companyId: string,
  form: NewCompanyForm,
  onSuccess: () => void,
  onError: () => void
) => {
  setLoading(true);
  try {
    const response = await axios.put(
      `${API_URL}/api/company/update-company/${companyId}`,
      {
        ...form,
        active: true
      }
    );

    if (response.status === 200) {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? {
                ...company,
                companyName: form.companyName,
                companyEmail: form.companyEmail,
                owner: {
                  ...company.owner,
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                }
              }
            : company
        )
      );
      onSuccess();
      await Swal.fire({
        icon: "success",
        title: "Company updated!",
        text: "The company has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchCompanies(); // Refresh the list
    }
  } catch {
    onError();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error updating company.",
    });
  } finally {
    setLoading(false);
  }
};

// Update the return statement to include updateCompany
return {
  companies,
  setCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  addUserToCompany,
  editUser,
  deleteUser,
  fetchCompanies,
  loading,
};
}
