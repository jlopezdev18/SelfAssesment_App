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
  const { data, isLoading: isQueryLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompaniesAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [companies, setCompanies] = useState<Company[]>(data || initialCompanies);
  const [mutationLoading, setMutationLoading] = useState<boolean>(false);

  // Update local state when React Query data changes
  if (data && data !== companies) {
    setCompanies(data);
  }

  // Combined loading state: loading if either query is loading OR mutation is in progress
  const loading = isQueryLoading || mutationLoading;

  const fetchCompanies = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['companies'] });
  }, [queryClient]);

  const addCompany = async (
    form: NewCompanyForm,
    onSuccess: () => void,
    onError: () => void
  ) => {
    setMutationLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/company/create-company`,
        form
      );

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['companies'] });

      // Set loading to false before calling onSuccess
      setMutationLoading(false);
      onSuccess();
    } catch (error) {
      setMutationLoading(false);
      console.error("Error creating company:", error);
      onError();
    }
  };

  const addUserToCompany = async (
    companyId: string,
    form: NewUserForm,
    onSuccess: () => void,
    onError: () => void
  ) => {
    setMutationLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/company/add-user-to-company`,
        { companyId, ...form }
      );

      // Update local state immediately for optimistic UI
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? { ...company, users: [...company.users, response.data as User] }
            : company
        )
      );

      // Invalidate React Query cache to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['companies'] });

      // Set loading to false before calling onSuccess to allow modal to close properly
      setMutationLoading(false);
      onSuccess();
    } catch {
      setMutationLoading(false);
      onError();
    }
  };

  const editUser = async (
  userId: string,
  companyId: string,
  form: NewUserForm,
  onSuccess: () => void,
  onError: () => void
) => {
  setMutationLoading(true);
  try {
    const response = await axios.put(
      `${API_URL}/api/company/update-user/${userId}`,
      {
        ...form,
        active: true
      }
    );

    if (response.status === 200) {
      // Update local state immediately for optimistic UI
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

      // Invalidate React Query cache to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['companies'] });

      // Set loading to false before calling onSuccess
      setMutationLoading(false);
      onSuccess();
    }
  } catch {
    setMutationLoading(false);
    onError();
  }
};

const deleteUser = async (userId: string, companyId: string) => {
  setMutationLoading(true);
  try {
    const response = await axios.delete(
      `${API_URL}/api/company/delete-user/${companyId}/${userId}`
    );

    if (response.status === 200) {
      // Update local state immediately for optimistic UI
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

      // Invalidate React Query cache to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
    setMutationLoading(false);
  } catch (error) {
    setMutationLoading(false);
    console.error("Error deleting user:", error);
    throw error;
  }
};


const deleteCompany = async (companyId: string, onSuccess?: () => void) => {
  setMutationLoading(true);
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
      // Update local state immediately for optimistic UI
      setCompanies((prev) => prev.filter((company) => company.id !== companyId));

      // Invalidate React Query cache to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['companies'] });

      setMutationLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    setMutationLoading(false);
    console.error("Error deleting company:", error);
    throw error;
  }
};

const updateCompany = async (
  companyId: string,
  form: NewCompanyForm,
  onSuccess: () => void,
  onError: () => void
) => {
  setMutationLoading(true);
  try {
    const response = await axios.put(
      `${API_URL}/api/company/update-company/${companyId}`,
      {
        ...form,
        active: true
      }
    );

    if (response.status === 200) {
      // Update local state immediately for optimistic UI
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

      // Invalidate React Query cache to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['companies'] });

      // Set loading to false before calling onSuccess
      setMutationLoading(false);
      onSuccess();
    }
  } catch {
    setMutationLoading(false);
    onError();
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
