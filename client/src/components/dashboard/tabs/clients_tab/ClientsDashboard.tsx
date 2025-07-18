import React, { useState } from "react";
import { FaBuilding, FaSearch, FaBell, FaTrash } from "react-icons/fa";
import CompanyTable from "./CompanyTable";
import CompanyModal from "./CompanyModal";
import UserModal from "./UserModal";
import { useCompanies } from "./hooks/useCompanies";
import { z } from "zod";
import type {
  CompanyDashboardProps,
  NewCompanyForm,
  NewUserForm,
} from "./types/ClientsInterfaces";
import ClipLoader from "react-spinners/ClipLoader";

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

  // Use custom hook for company logic
  const { companies, addCompany, addUserToCompany, deleteCompany, loading } = useCompanies([]);

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
  new Date(dateObj._seconds * 1000).toLocaleDateString("en-US", {
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
    addCompany(newCompanyForm, handleCloseCompanyModal, () => {});
  };

  const handleUserSubmit = async () => {
    if (!validateUserForm() || !selectedCompanyForUser) return;
    addUserToCompany(
      selectedCompanyForUser,
      newUserForm,
      handleCloseUserModal,
      () => {}
    );
  };

  const handleDeleteSelectedCompany = () => {
    selectedCompanies.forEach((companyId) => {
      deleteCompany(companyId, () => {});
    });
    setSelectedCompanies([]);
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
        <div
          className={`${cardClass} rounded-lg shadow-sm border border-gray-200 p-4 mb-6`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies and users..."
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textClass} ${cardClass}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textClass} ${cardClass}`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selection Toolbar */}
        {selectedCompanies.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-blue-900 font-medium">
              {selectedCompanies.length} selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1">
                <FaBell className="w-4 h-4" />
                Notification
              </button>
              <button onClick={handleDeleteSelectedCompany} className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1">
                <FaTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={darkMode ? "#fff" : "#2563eb"} size={48} />
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
      />
    </div>
  );
};

export default ClientsDashboard;
