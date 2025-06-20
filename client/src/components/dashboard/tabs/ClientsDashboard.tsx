/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaBell,
  FaBan,
  FaTrash,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import Swal from "sweetalert2";
import axios from "axios";

interface Client {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  nextPaymentDate: string;
}

interface ClientsProps {
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
}

interface NewClientForm {
  firstName: string;
  lastName: string;
  email: string;
}

const ClientsDashboard: React.FC<ClientsProps> = ({
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
}) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [newClientForm, setNewClientForm] = useState<NewClientForm>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<NewClientForm>>({});

  // Sample client data
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/users-with-role-user");
        // Map Firestore data to your Client interface
        const data = response.data as { users: any[] };
        const users = data.users.map((user: any) => ({
          id: user.id,
          name: user.displayName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          status: user.status || "pending",
          nextPaymentDate: user.nextPaymentDate || "",
        }));
        setClients(users);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredClients.map((client) => client.id);
      setSelectedClients(newSelected);
      return;
    }
    setSelectedClients([]);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isSelected = (id: string) => selectedClients.indexOf(id) !== -1;

  // Modal handlers
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewClientForm({
      firstName: "",
      lastName: "",
      email: "",
    });
    setFormErrors({});
  };

  const handleFormChange = (field: keyof NewClientForm, value: string) => {
    setNewClientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<NewClientForm> = {};

    if (!newClientForm.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!newClientForm.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!newClientForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClientForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    // Send firstName and lastName to backend, not name or role/status
    const response = await axios.post("http://localhost:4000/api/create-user", {
      firstName: newClientForm.firstName,
      lastName: newClientForm.lastName,
      email: newClientForm.email,
    });
    const newUser = response.data as Client;
    setClients((prev) => [
      ...prev,
      {
        id: newUser.id,
        name: `${newClientForm.firstName} ${newClientForm.lastName}`,
        email: newClientForm.email,
        status: "pending",
        nextPaymentDate: "",
      },
    ]);
    handleCloseModal();
    Swal.fire({
      icon: "success",
      title: "User created!",
      text: "The new user has been added successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error creating user in database.",
    });
  }
};

const paginatedClients = filteredClients.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

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
            Clients Information
          </h1>
          <button
            className="text-white px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-lg transform hover:scale-105"
            style={{
              background:
                "linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)",
            }}
            onClick={handleOpenModal}
          >
            New Client
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
                placeholder="Search clients..."
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
        {selectedClients.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-blue-900 font-medium">
              {selectedClients.length} selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1">
                <FaBell className="w-4 h-4" />
                Notification
              </button>
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1">
                <FaBan className="w-4 h-4" />
                Block
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1">
                <FaTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div
          className={`${cardClass} rounded-lg shadow-sm border border-gray-200 overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                } border-b border-gray-200`}
              >
                <tr>
                  <th className="w-12 px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={
                        filteredClients.length > 0 &&
                        selectedClients.length === filteredClients.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
                  >
                    Client Name
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
                  >
                    Email
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
                  >
                    Next Payment
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cardClass}>
                {paginatedClients.map((client) => {
                  const isItemSelected = isSelected(client.id);
                  return (
                    <tr
                      key={client.id}
                      className={`transition-colors ${
                        darkMode ? "hover:bg-blue-950" : "hover:bg-blue-50"
                      } ${isItemSelected ? "bg-blue-100" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={isItemSelected}
                          onChange={() => handleSelectClient(client.id)}
                        />
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${textClass}`}
                      >
                        <div className={`font-medium ${textClass}`}>
                          {client.name}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${mutedTextClass}`}
                      >
                        <div className={`text-sm ${mutedTextClass}`}>
                          {client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(client.status)}>
                          {client.status.charAt(0).toUpperCase() +
                            client.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}
                      >
                        {formatDate(client.nextPaymentDate)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-center ${textClass}`}
                      >
                        <div className="relative">
                          <button
                            className={`p-2 hover:${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            } rounded-full`}
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === client.id ? null : client.id
                              )
                            }
                          >
                            <SlOptionsVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          {activeDropdown === client.id && (
                            <div
                              className={`absolute right-0 mt-2 w-48 ${cardClass} rounded-md shadow-lg border border-gray-200 z-10`}
                            >
                              <div className="py-1">
                                <button
                                  className={`flex items-center px-4 py-2 text-sm ${textClass} hover:${
                                    darkMode ? "bg-gray-700" : "bg-gray-50"
                                  } w-full text-left`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <FaEdit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  className={`flex items-center px-4 py-2 text-sm ${textClass} hover:${
                                    darkMode ? "bg-gray-700" : "bg-gray-50"
                                  } w-full text-left`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <FaBell className="w-4 h-4 mr-2" />
                                  Notification
                                </button>
                                <button
                                  className={`flex items-center px-4 py-2 text-sm ${textClass} hover:${
                                    darkMode ? "bg-gray-700" : "bg-gray-50"
                                  } w-full text-left`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <FaBan className="w-4 h-4 mr-2" />
                                  Block
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <FaTrash className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className={`px-6 py-3 flex items-center justify-between border-t border-gray-200 ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className={`flex items-center text-sm ${textClass}`}>
              <span>
                Showing {page * rowsPerPage + 1} to{" "}
                {Math.min((page + 1) * rowsPerPage, filteredClients.length)} of{" "}
                {filteredClients.length} entries
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
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardClass} rounded-lg shadow-xl w-full max-w-md mx-4`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${textClass}`}>
                Add New Client
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-1`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.firstName
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    value={newClientForm.firstName}
                    onChange={(e) =>
                      handleFormChange("firstName", e.target.value)
                    }
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-1`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.lastName ? "border-red-300" : "border-gray-300"
                    }`}
                    value={newClientForm.lastName}
                    onChange={(e) =>
                      handleFormChange("lastName", e.target.value)
                    }
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textClass} mb-1`}>
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  value={newClientForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsDashboard;
