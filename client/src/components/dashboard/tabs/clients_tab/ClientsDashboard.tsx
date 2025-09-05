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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  mutedTextClass,
  darkMode,
}) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "company" | "user" | "bulk" | null;
    id: string | string[]; // Single ID or array of IDs for bulk delete
    companyId?: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: null,
    id: "",
    companyId: "",
    title: "",
    description: "",
  });

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
    return matchesSearch;
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
          () => {
            handleCloseCompanyModal();
            toast("Company updated successfully", {
              style: {
                background: "#059669",
                color: "white",
                border: "1px solid #059669",
              },
              duration: 4000,
            });
          },
          () => {}
        );
      }
    } else {
      addCompany(
        newCompanyForm,
        () => {
          handleCloseCompanyModal();
          toast("Company created successfully", {
            style: {
              background: "#059669",
              color: "white",
              border: "1px solid #059669",
            },
            duration: 4000,
          });
        },
        () => {}
      );
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
        () => {
          handleCloseUserModal();
          toast("User updated successfully", {
            style: {
              background: "#059669",
              color: "white",
              border: "1px solid #059669",
            },
            duration: 4000,
          });
        },
        () => {}
      );
    } else {
      addUserToCompany(
        selectedCompanyForUser,
        newUserForm,
        () => {
          handleCloseUserModal();
          toast("User added successfully", {
            style: {
              background: "#059669",
              color: "white",
              border: "1px solid #059669",
            },
            duration: 4000,
          });
        },
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

    const selectedCompanyNames = selectedCompanies.map((id) => {
      const company = companies.find((c) => c.id === id);
      return company?.companyName || "Unknown Company";
    });

    setDeleteDialog({
      open: true,
      type: "bulk",
      id: selectedCompanies,
      title: `Delete ${selectedCompanies.length} ${
        selectedCompanies.length === 1 ? "Company" : "Companies"
      }`,
      description: `Are you sure you want to delete the following ${
        selectedCompanies.length === 1 ? "company" : "companies"
      }?\n\n${selectedCompanyNames.join(", ")}\n\nThis will deactivate ${
        selectedCompanies.length === 1 ? "the company" : "these companies"
      } and all their users. This action cannot be undone.`,
    });
  };

  const handleDeleteCompany = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    setDeleteDialog({
      open: true,
      type: "company",
      id: companyId,
      title: "Delete Company",
      description: `Are you sure you want to delete "${company?.companyName}"? This will deactivate the company and all its users. This action cannot be undone.`,
    });
  };

  const handleDeleteUser = async (userId: string, companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    const user = company?.users.find((u) => u.id === userId);
    setDeleteDialog({
      open: true,
      type: "user",
      id: userId,
      companyId: companyId,
      title: "Delete User",
      description: `Are you sure you want to delete "${user?.firstName} ${user?.lastName}"? This will deactivate the user's access. This action cannot be undone.`,
    });
  };

  const handleConfirmDelete = () => {
    if (
      deleteDialog.type === "company" &&
      typeof deleteDialog.id === "string"
    ) {
      deleteCompany(deleteDialog.id, () => {
        toast("Company deleted successfully", {
          style: {
            background: "#dc2626",
            color: "white",
            border: "1px solid #dc2626",
          },
          duration: 4000,
        });
      });
    } else if (deleteDialog.type === "bulk" && Array.isArray(deleteDialog.id)) {
      deleteDialog.id.forEach((companyId) => {
        deleteCompany(companyId, () => {
          toast("Company deleted successfully", {
            style: {
              background: "#dc2626",
              color: "white",
              border: "1px solid #dc2626",
            },
            duration: 4000,
          });
        });
      });
      setSelectedCompanies([]);
    } else if (
      deleteDialog.type === "user" &&
      typeof deleteDialog.id === "string" &&
      deleteDialog.companyId
    ) {
      deleteUser(deleteDialog.id, deleteDialog.companyId);
      toast("User deleted successfully", {
        style: {
          background: "#dc2626",
          color: "white",
          border: "1px solid #dc2626",
        },
        duration: 4000,
      });
    }

    setDeleteDialog({
      open: false,
      type: null,
      id: "",
      companyId: "",
      title: "",
      description: "",
    });
  };

  const paginatedCompanies = filteredCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          <Button
            onClick={handleOpenCompanyModal}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            size="lg"
          >
            <FaBuilding className="w-4 h-4 mr-2" />
            New Company
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative w-full">
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
            mutedTextClass={mutedTextClass}
            darkMode={darkMode}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCompanies={filteredCompanies.length}
            onPageChange={setPage}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(0);
            }}
          />
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
        cardClass={cardClass}
        loading={loading}
        isEditing={!!editingUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({
              open: false,
              type: null,
              id: "",
              companyId: "",
              title: "",
              description: "",
            });
          }
        }}
      >
        <AlertDialogContent className="z-[9999] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              {deleteDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {deleteDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-100 text-black border border-gray-300"
              onClick={() => {
                setDeleteDialog({
                  open: false,
                  type: null,
                  id: "",
                  companyId: "",
                  title: "",
                  description: "",
                });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleConfirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsDashboard;
