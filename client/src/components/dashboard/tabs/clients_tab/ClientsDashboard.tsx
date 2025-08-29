import React, { useState } from "react";
import { FaBuilding, FaSearch, FaBell, FaTrash } from "react-icons/fa";
import CompanyTable from "./CompanyTable";
import CompanyModal from "./CompanyModal";
import UserModal from "./UserModal";
import { useCompanies } from "./hooks/useCompanies";
import { z } from "zod";
import type {
  Company,
  CompanyDashboardProps,
  NewCompanyForm,
  NewUserForm,
  User,
} from "./types/ClientsInterfaces";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Zod schemas for validation
const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "Owner first name is required"),
  lastName: z.string().min(1, "Owner last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

const ClientsDashboard: React.FC<CompanyDashboardProps> = ({
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
}) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedCompanyForUser, setSelectedCompanyForUser] = useState<
    string | null
  >(null);
  const [newCompanyForm, setNewCompanyForm] = useState<NewCompanyForm>({
    companyName: "",
    companyEmail: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [companyFormErrors, setCompanyFormErrors] = useState<
    Partial<NewCompanyForm>
  >({});
  const [userFormErrors, setUserFormErrors] = useState<Partial<NewUserForm>>(
    {}
  );

  const {
    companies,
    addCompany,
    addUserToCompany,
    updateCompany,
    deleteCompany,
    editUser,
    deleteUser,
    loading,
  } = useCompanies([]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.owner?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      company.owner?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      company.users?.some(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      filterStatus === "all" || company.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredCompanies.map((company) => company.id);
      setSelectedCompanies(newSelected);
      return;
    }
    setSelectedCompanies([]);
  };

  const toggleCompanyExpansion = (companyId: string) => {
    setExpandedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "inactive":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  const formatDate = (dateObj: { _seconds: number; _nanoseconds: number }) =>
    new Date(dateObj?._seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isSelected = (id: string) => selectedCompanies.indexOf(id) !== -1;

  // Company Modal handlers
  const handleOpenCompanyModal = () => {
    setOpenCompanyModal(true);
  };

  const handleCloseCompanyModal = () => {
    setOpenCompanyModal(false);
    setEditingCompany(null);
    setNewCompanyForm({
      companyName: "",
      companyEmail: "",
      firstName: "",
      lastName: "",
      email: "",
    });
    setCompanyFormErrors({});
  };

  // User Modal handlers
  const handleOpenUserModal = (companyId: string) => {
    setSelectedCompanyForUser(companyId);
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
    setSelectedCompanyForUser(null);
    setNewUserForm({
      firstName: "",
      lastName: "",
      email: "",
    });
    setUserFormErrors({});
  };

  const handleCompanyFormChange = (
    field: keyof NewCompanyForm,
    value: string
  ) => {
    setNewCompanyForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (companyFormErrors[field]) {
      setCompanyFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleUserFormChange = (field: keyof NewUserForm, value: string) => {
    setNewUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (userFormErrors[field]) {
      setUserFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Zod validation
  const validateCompanyForm = (): boolean => {
    const result = companySchema.safeParse(newCompanyForm);
    if (result.success) {
      setCompanyFormErrors({});
      return true;
    } else {
      const errors: Partial<NewCompanyForm> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0])
          errors[err.path[0] as keyof NewCompanyForm] = err.message;
      });
      setCompanyFormErrors(errors);
      return false;
    }
  };

  const validateUserForm = (): boolean => {
    const result = userSchema.safeParse(newUserForm);
    if (result.success) {
      setUserFormErrors({});
      return true;
    } else {
      const errors: Partial<NewUserForm> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as keyof NewUserForm] = err.message;
      });
      setUserFormErrors(errors);
      return false;
    }
  };

  const handleCompanySubmit = async () => {
    if (!validateCompanyForm()) return;
    if (editingCompany) {
      if (updateCompany) {
        updateCompany(
          editingCompany.id,
          newCompanyForm,
          handleCloseCompanyModal,
          () => {}
        );
      }
    } else {
      addCompany(newCompanyForm, handleCloseCompanyModal, () => {});
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setNewCompanyForm({
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      firstName: company.owner.firstName,
      lastName: company.owner.lastName,
      email: company.owner.email,
    });
    setOpenCompanyModal(true);
  };

  const handleNotifyCompany = (companyId: string) => {
    // Placeholder notification function
    console.log(`Notification sent to company ${companyId}`);
    // You can add your notification logic here
  };

  const handleUserSubmit = async () => {
    if (!validateUserForm() || !selectedCompanyForUser) return;
    if (editingUser && selectedCompanyForUser) {
      await editUser(
        editingUser.id,
        selectedCompanyForUser,
        newUserForm,
        handleCloseUserModal,
        () => {}
      );
    } else {
      addUserToCompany(
        selectedCompanyForUser,
        newUserForm,
        handleCloseUserModal,
        () => {}
      );
    }
  };

  const handleEditUser = (user: User, companyId: string) => {
    setEditingUser(user);
    setNewUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setSelectedCompanyForUser(companyId);
    setOpenUserModal(true);
  };

  const handleDeleteSelectedCompany = () => {
    if (selectedCompanies.length === 0) return;
    selectedCompanies.forEach((companyId) => {
      deleteCompany(companyId, () => {});
    });
    setSelectedCompanies([]);
  };

  const handleDeleteCompany = (companyId: string) => {
    deleteCompany(companyId, () => {});
  };

  const handleDeleteUser = async (userId: string, companyId: string) => {
    deleteUser(userId, companyId);
  };

  const paginatedCompanies = filteredCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mb-3">
            Companies & Users
          </h1>
          <button
            className="text-white px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-lg transform hover:scale-105"
            style={{
              background:
                "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
            }}
            onClick={handleOpenCompanyModal}
          >
            <FaBuilding className="inline mr-2" />
            New Company
          </button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Search companies and users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sm:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selection Toolbar */}
        {selectedCompanies.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {selectedCompanies.length} selected
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FaBell className="w-4 h-4 mr-2" />
                    Notification
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelectedCompany}
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ScaleLoader color={darkMode ? "#fff" : "#2563eb"} />
          </div>
        ) : (
          <>
            <CompanyTable
              companies={paginatedCompanies}
              selectedCompanies={selectedCompanies}
              expandedCompanies={expandedCompanies}
              activeDropdown={activeDropdown}
              onSelectCompany={handleSelectCompany}
              onSelectAll={handleSelectAllClick}
              onToggleExpand={toggleCompanyExpansion}
              onOpenUserModal={handleOpenUserModal}
              onDropdown={setActiveDropdown}
              onEditCompany={handleEditCompany}
              onNotifyCompany={handleNotifyCompany}
              onDeleteCompany={handleDeleteCompany}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              isSelected={isSelected}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
              cardClass={cardClass}
              textClass={textClass}
              mutedTextClass={mutedTextClass}
              darkMode={darkMode}
            />

            {/* Pagination */}
            <div
              className={`px-6 py-3 flex items-center justify-between border-t border-gray-200 ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className={`flex items-center text-sm ${textClass}`}>
                <span>
                  Showing {page * rowsPerPage + 1} to{" "}
                  {Math.min((page + 1) * rowsPerPage, filteredCompanies.length)}{" "}
                  of {filteredCompanies.length} entries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className={`px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textClass} ${cardClass}`}
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(0);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <div className="flex">
                  <button
                    className={`px-3 py-1 border border-gray-300 rounded-l-md text-sm hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span
                    className={`px-3 py-1 border-t border-b border-gray-300 ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } text-sm`}
                  >
                    {page + 1} of {totalPages}
                  </span>
                  <button
                    className={`px-3 py-1 border border-gray-300 rounded-r-md text-sm hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Company Modal */}
      <CompanyModal
        open={openCompanyModal}
        onClose={handleCloseCompanyModal}
        onSubmit={handleCompanySubmit}
        form={newCompanyForm}
        errors={companyFormErrors}
        onChange={handleCompanyFormChange}
        textClass={textClass}
        cardClass={cardClass}
        loading={loading}
        isEditing={!!editingCompany}
      />

      {/* User Modal */}
      <UserModal
        open={openUserModal}
        onClose={handleCloseUserModal}
        onSubmit={handleUserSubmit}
        form={newUserForm}
        errors={userFormErrors}
        onChange={handleUserFormChange}
        selectedCompany={selectedCompanyForUser}
        companies={companies}
        textClass={textClass}
        cardClass={cardClass}
        loading={loading}
        isEditing={!!editingUser}
      />
    </div>
  );
};

export default ClientsDashboard;
