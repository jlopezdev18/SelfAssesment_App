import React from "react";
import {
  FaBuilding,
  FaUser,
  FaChevronRight,
  FaChevronDown,
  FaUserPlus,
  FaEdit,
  FaBell,
  FaTrash,
} from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import type { Company, User } from "./types/ClientsInterfaces";

interface CompanyTableProps {
  companies: Company[];
  selectedCompanies: string[];
  expandedCompanies: string[];
  activeDropdown: string | null;
  onSelectCompany: (id: string) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExpand: (id: string) => void;
  onOpenUserModal: (companyId: string) => void;
  onDropdown: (id: string | null) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onNotifyCompany: (companyId: string) => void;
  onEditUser: (user: User, companyId: string) => void;
  onDeleteUser: (userId: string, companyId: string) => void;
  isSelected: (id: string) => boolean;
  getStatusBadge: (status: string) => string;
  formatDate: (date: { _seconds: number; _nanoseconds: number }) => string;
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  selectedCompanies,
  expandedCompanies,
  activeDropdown,
  onSelectCompany,
  onSelectAll,
  onToggleExpand,
  onOpenUserModal,
  onDropdown,
  onEditCompany,
  onDeleteCompany,
  onNotifyCompany,
  onEditUser,
  onDeleteUser,
  isSelected,
  getStatusBadge,
  formatDate,
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
}) => (
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
                  companies.length > 0 &&
                  selectedCompanies.length === companies.length
                }
                onChange={onSelectAll}
              />
            </th>
            <th className="w-8 px-6 py-3 text-left"></th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
            >
              Company / User
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
            >
              Email
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
            >
              Role / Status
            </th>
            <th
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
            >
              Payment / Joined
            </th>
            <th
              className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${mutedTextClass}`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={cardClass}>
          {!companies || companies.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className={`px-6 py-12 text-center ${mutedTextClass} border-b border-gray-200`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <FaBuilding className="w-8 h-8 text-gray-400" />
                  <div className="text-lg font-medium">
                    No Companies Available
                  </div>
                  <p className="text-sm">
                    There are no companies registered at the moment.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            companies.map((company) => {
              const isCompanySelected = isSelected(company.id);
              const isExpanded = expandedCompanies.includes(company.id);
              const totalUsers = company.users.length + 1;
              return (
                <React.Fragment key={company.id}>
                  {/* Company Row */}
                  <tr
                    className={`transition-colors ${
                      darkMode ? "hover:bg-blue-950" : "hover:bg-blue-50"
                    } ${
                      isCompanySelected ? "bg-blue-100" : ""
                    } border-b border-gray-100`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={isCompanySelected}
                        onChange={() => onSelectCompany(company.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleExpand(company.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <FaChevronDown className="w-4 h-4" />
                        ) : (
                          <FaChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${textClass}`}>
                      <div className="flex items-center">
                        <FaBuilding className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className={`font-medium ${textClass}`}>
                            {company.companyName}
                          </div>
                          <div className={`text-sm ${mutedTextClass}`}>
                            {totalUsers} user{totalUsers !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${mutedTextClass}`}
                    >
                      <div className={`text-sm ${mutedTextClass}`}>
                        {company.companyEmail}
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-center ${textClass}`}
                    >
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onOpenUserModal(company.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Add User"
                        >
                          <FaUserPlus className="w-4 h-4" />
                        </button>
                        <div className="absolute right-28">
                          <button
                            className={`p-2 hover:${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            } rounded-full`}
                            onClick={() =>
                              onDropdown(
                                activeDropdown === company.id
                                  ? null
                                  : company.id
                              )
                            }
                          >
                            <SlOptionsVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          {activeDropdown === company.id && (
                            <div
                              className={`absolute right-0 mt-2 w-48 ${cardClass} rounded-md shadow-lg border border-gray-200 z-10`}
                            >
                              <div className="py-1">
                                <button
                                  className={`flex items-center px-4 py-2 text-sm ${textClass} hover:${
                                    darkMode ? "bg-gray-700" : "bg-gray-50"
                                  } w-full text-left`}
                                  onClick={() => {
                                    onEditCompany(company);
                                    onDropdown(null);
                                  }}
                                >
                                  <FaEdit className="w-4 h-4 mr-2" />
                                  Edit Company
                                </button>
                                <button
                                  className={`flex items-center px-4 py-2 text-sm ${textClass} hover:${
                                    darkMode ? "bg-gray-700" : "bg-gray-50"
                                  } w-full text-left`}
                                  onClick={() => {
                                    onNotifyCompany(company.id);
                                    onDropdown(null);
                                  }}
                                >
                                  <FaBell className="w-4 h-4 mr-2" />
                                  Notification
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  onClick={() => {
                                    onDeleteCompany(company.id);
                                    onDropdown(null);
                                  }}
                                >
                                  <FaTrash className="w-4 h-4 mr-2" />
                                  Delete Company
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Users */}
                  {isExpanded && (
                    <>
                      {/* Owner Row */}
                      <tr className={`${darkMode ? "bg-gray-800" : "bg-auto"}`}>
                        <td className="px-6 py-3"></td>
                        <td className="px-6 py-3"></td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap ${textClass}`}
                        >
                          <div className="flex items-center pl-4">
                            <FaUser className="w-3 h-3 mr-2 text-green-500" />
                            <div>
                              <div
                                className={`font-medium ${textClass} text-sm`}
                              >
                                {company.owner.firstName}{" "}
                                {company.owner.lastName}
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                Owner
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap ${mutedTextClass}`}
                        >
                          <div className={`text-sm ${mutedTextClass}`}>
                            {company.owner.email}
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <span
                            className={getStatusBadge(
                              company.owner.active ? "active" : "inactive"
                            )}
                          >
                            {company.owner.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-3 whitespace-nowrap text-sm ${textClass}`}
                        >
                          {formatDate(company.createdAt)}
                        </td>
                      </tr>
                      {/* Regular Users */}
                      {company.users.map((user) => (
                        <tr
                          key={user.id}
                          className={`${darkMode ? "bg-gray-800" : "bg-auto"}`}
                        >
                          <td className="px-6 py-3"></td>
                          <td className="px-6 py-3"></td>
                          <td
                            className={`px-6 py-3 whitespace-nowrap ${textClass}`}
                          >
                            <div className="flex items-center pl-4">
                              <FaUser className="w-3 h-3 mr-2 text-blue-500" />
                              <div>
                                <div
                                  className={`font-medium ${textClass} text-sm`}
                                >
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-blue-600 font-medium">
                                  User
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`px-6 py-3 whitespace-nowrap ${mutedTextClass}`}
                          >
                            <div className={`text-sm ${mutedTextClass}`}>
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span className={getStatusBadge(user.active ? "active" : "inactive")}>
                              {user.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-3 whitespace-nowrap text-sm ${textClass}`}
                          >
                            {formatDate(user.createdAt)}
                          </td>
                          <td
                            className={`px-6 py-3 whitespace-nowrap text-center ${textClass}`}
                          >
                            <div className="flex items-center justify-end">
                              <div className="absolute">
                                <button
                                  onClick={() =>
                                    onDropdown(
                                      activeDropdown === `user-${user.id}`
                                        ? null
                                        : `user-${user.id}`
                                    )
                                  }
                                  className={`p-2 hover:${
                                    darkMode ? "bg-gray-700" : "bg-gray-100"
                                  } rounded-full`}
                                >
                                  <SlOptionsVertical className="w-3 h-3 text-gray-400" />
                                </button>
                                {activeDropdown === `user-${user.id}` && (
                                  <div
                                    className={`absolute right-0 mt-2 w-48 ${cardClass} rounded-md shadow-lg border border-gray-200 z-10`}
                                  >
                                    <div className="py-1">
                                      <button
                                        className={`flex items-center px-4 py-2 text-sm ${textClass} hover:${
                                          darkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-50"
                                        } w-full text-left`}
                                        onClick={() => {
                                          onEditUser(user, company.id);
                                          onDropdown(null);
                                        }}
                                      >
                                        <FaEdit className="w-4 h-4 mr-2" />
                                        Edit User
                                      </button>
                                      <button
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        onClick={() => {
                                          onDeleteUser(user.id, company.id);
                                          onDropdown(null);
                                        }}
                                      >
                                        <FaTrash className="w-4 h-4 mr-2" />
                                        Delete User
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default CompanyTable;
