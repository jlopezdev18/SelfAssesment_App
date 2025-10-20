import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Company,
  NewCompanyForm,
  NewUserForm,
  User,
} from "../types/ClientsInterfaces";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Fetch companies with React Query
const fetchCompaniesAPI = async (): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}/api/company/companies-with-users`);
  const companies = response.data as Company[];
  return companies.filter(company => !company.deleted);
};

export function useCompanies(initialCompanies: Company[]) {
  const queryClient = useQueryClient();

  // Use React Query for fetching with caching
  const { data, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompaniesAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [companies, setCompanies] = useState<Company[]>(data || initialCompanies);
  const [loading, setLoading] = useState<boolean>(isLoading);

  // Update local state when React Query data changes
  if (data && data !== companies) {
    setCompanies(data);
  }

  if (isLoading !== loading) {
    setLoading(isLoading);
  }

  const fetchCompanies = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  }, [queryClient]);

  const addCompany = async (
    form: NewCompanyForm,
    onSuccess: () => void,
    onError: () => void
  ) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/company/create-company`,
        form
      );

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
      onSuccess();
    } catch (error) {
      console.error("Error creating company:", error);
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
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};


const deleteCompany = async (companyId: string, onSuccess?: () => void) => {
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
      setCompanies((prev) => prev.filter((company) => company.id !== companyId));
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
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
