import React, { useState } from "react";
import { FaShieldAlt, FaUser, FaSearch, FaSync } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRoleManagement } from "./hooks/useRoleManagement";
import ScaleLoader from "react-spinners/ScaleLoader";
import { toastSuccess, toastError } from "@/utils/toastNotifications";

interface RoleManagementProps {
  darkMode: boolean;
  textClass: string;
  mutedTextClass: string;
}

const RoleManagement: React.FC<RoleManagementProps> = ({
  darkMode,
  textClass,
  mutedTextClass,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const { users, loading, updateUserRole, refetch } = useRoleManagement();

  const handleRoleChange = async (uid: string, newRole: "admin" | "user") => {
    try {
      await updateUserRole(uid, newRole);
      toastSuccess(`Role updated to ${newRole} successfully`);
      await refetch();
    } catch (error) {
      toastError("Failed to update role", error instanceof Error ? error.message : "Unknown error");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          <FaShieldAlt className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <FaUser className="w-3 h-3 mr-1" />
        User
      </Badge>
    );
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800">
            Role Management
          </h1>
          <p className={`mt-2 text-sm ${mutedTextClass}`}>
            Manage user roles and permissions across the platform
          </p>
        </div>
        <Button
          onClick={refetch}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <span
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mutedTextClass}`}
              >
                <FaSearch className="w-4 h-4" />
              </span>
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as "all" | "admin" | "user")}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="user">Users Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regular Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === "user").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <ScaleLoader color={darkMode ? "#60a5fa" : "#2563eb"} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">
                        <div>
                          <div className={textClass}>
                            {user.displayName || `${user.firstName} ${user.lastName}`}
                          </div>
                          <div className={`text-xs ${mutedTextClass}`}>
                            {user.uid.substring(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getStatusBadge(user.active)}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            handleRoleChange(user.uid, value as "admin" | "user")
                          }
                        >
                          <SelectTrigger className="w-32 ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleManagement;
