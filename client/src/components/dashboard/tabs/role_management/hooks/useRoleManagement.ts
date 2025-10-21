import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  active: boolean;
  deleted: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  companyId?: string;
}

export function useRoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (uid: string, role: "admin" | "user") => {
    try {
      await axios.post(`${API_URL}/api/set-user-role`, { uid, role });

      // Update local state optimistically
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === uid ? { ...user, role } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    updateUserRole,
    refetch: fetchUsers,
  };
}
