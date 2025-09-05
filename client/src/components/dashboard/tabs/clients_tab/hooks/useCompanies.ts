import { useEffect, useState } from "react";
import type {
  Company,
  NewCompanyForm,
  NewUserForm,
  User,
} from "../types/ClientsInterfaces";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
      fetchCompanies(); // Refresh the list of companies
    } catch {
      onError();
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
    } catch {
      onError();
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
      await fetchCompanies();
    }
  } catch {
    onError();
  } finally {
    setLoading(false);
  }
};

const deleteUser = async (userId: string, companyId: string) => {
  setLoading(true);
  try {
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

      await fetchCompanies();
    }
  } catch {
    // Error handling will be done in the component
  } finally {
    setLoading(false);
  }
};
 

 const deleteCompany = async (companyId: string, onError: () => void) => {
  setLoading(true);
  try {
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
      await fetchCompanies();
    }
  } catch  {
    onError();
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
      await fetchCompanies(); // Refresh the list
    }
  } catch {
    onError();
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
