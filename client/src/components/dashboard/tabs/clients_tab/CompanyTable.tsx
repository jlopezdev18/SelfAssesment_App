import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Company, User } from "./types/ClientsInterfaces";

interface CompanyTableProps {
  companies: Company[];
  selectedCompanies: string[];
  expandedCompanies: string[];
  onSelectCompany: (id: string) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleExpand: (id: string) => void;
  onOpenUserModal: (companyId: string) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onNotifyCompany: (companyId: string) => void;
  onEditUser: (user: User, companyId: string) => void;
  onDeleteUser: (userId: string, companyId: string) => void;
  isSelected: (id: string) => boolean;
  getStatusBadge: (status: string) => string;
  formatDate: (date: { _seconds: number; _nanoseconds: number }) => string;
  cardClass: string;
  mutedTextClass: string;
  darkMode: boolean;
  // Pagination props
  page: number;
  rowsPerPage: number;
  totalCompanies: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  selectedCompanies,
  expandedCompanies,
  onSelectCompany,
  onSelectAll,
  onToggleExpand,
  onOpenUserModal,
  onEditCompany,
  onDeleteCompany,
  onNotifyCompany,
  onEditUser,
  onDeleteUser,
  isSelected,
  formatDate,
  cardClass,
  darkMode,
  // Pagination props
  page,
  rowsPerPage,
  totalCompanies,
  onPageChange,
  onRowsPerPageChange,
}) => {
  type MenuState =
    | {
        id: string;
        type: "company";
        top: number;
        left: number;
        company: Company;
      }
    | {
        id: string;
        type: "user";
        top: number;
        left: number;
        companyId: string;
        user: User;
      }
    | null;

  const [menu, setMenu] = useState<MenuState>(null);

  const openMenu = (
    e: React.MouseEvent,
    id: string,
    type: "company" | "user",
    payload: Company | { companyId: string; user: User }
  ) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const menuWidth = 220; // approximate width
    const menuHeight = 140; // approximate height
    let left = Math.min(
      rect.right - menuWidth,
      window.innerWidth - menuWidth - 8
    );
    left = Math.max(8, left);
    let top = rect.bottom + 8;
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(8, rect.top - menuHeight - 8);
    }

    if (type === "company") {
      setMenu({ id, type, top, left, company: payload as Company });
    } else {
      const { companyId, user } = payload as { companyId: string; user: User };
      setMenu({ id, type, top, left, companyId, user });
    }
  };

  const MenuPortal: React.FC<{
    menu: NonNullable<MenuState>;
    onClose: () => void;
  }> = ({ menu, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
      const onMouseDown = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", onMouseDown);
      return () => document.removeEventListener("mousedown", onMouseDown);
    }, [onClose]);

    const content = (
      <>
        <div
          className="fixed z-[999] min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
          style={{ top: menu.top, left: menu.left }}
          ref={menuRef}
        >
          {menu.type === "company" ? (
            <>
              <button
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onEditCompany(menu.company);
                  onClose();
                }}
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Edit Company
              </button>
              <button
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onNotifyCompany(menu.company.id);
                  onClose();
                }}
              >
                <FaBell className="w-4 h-4 mr-2" />
                Notification
              </button>
              <button
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-destructive"
                onClick={() => {
                  onDeleteCompany(menu.company.id);
                  onClose();
                }}
              >
                <FaTrash className="w-4 h-4 mr-2" />
                Delete Company
              </button>
            </>
          ) : (
            <>
              <button
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onEditUser(menu.user, menu.companyId);
                  onClose();
                }}
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Edit User
              </button>
              <button
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-destructive"
                onClick={() => {
                  onDeleteUser(menu.user.id, menu.companyId);
                  onClose();
                }}
              >
                <FaTrash className="w-4 h-4 mr-2" />
                Delete User
              </button>
            </>
          )}
        </div>
      </>
    );
    return createPortal(content, document.body);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!companies || companies.length === 0) {
    return (
      <div className={`${cardClass} border p-8`}>
        <div className="flex flex-col items-center justify-center space-y-3">
          <FaBuilding className="w-8 h-8 text-muted-foreground" />
          <div className="text-lg font-medium">No Companies Available</div>
          <p className="text-sm text-muted-foreground">
            There are no companies registered at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardClass} border overflow-hidden`}>
      <Table className="relative">
        <TableHeader>
          <TableRow
            className={darkMode ? "border-gray-700" : "border-gray-200"}
          >
            <TableHead className="w-12">
              <Checkbox
                checked={
                  companies.length > 0 &&
                  selectedCompanies.length === companies.length
                }
                onCheckedChange={(checked) => {
                  const event = {
                    target: { checked: !!checked },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onSelectAll(event);
                }}
              />
            </TableHead>
            <TableHead className="w-8"></TableHead>
            <TableHead>Company / User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role / Status</TableHead>
            <TableHead>Payment / Joined</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => {
            const isCompanySelected = isSelected(company.id);
            const isExpanded = expandedCompanies.includes(company.id);
            const totalUsers = company.users.length + 1;

            return (
              <React.Fragment key={company.id}>
                {/* Company Row */}
                <TableRow
                  className={`
                    ${
                      isCompanySelected
                        ? darkMode
                          ? "bg-blue-900/30 hover:bg-blue-900/40"
                          : "bg-blue-50 hover:bg-blue-100"
                        : darkMode
                        ? "hover:bg-gray-800/50"
                        : "hover:bg-gray-50"
                    }
                    ${darkMode ? "border-gray-700" : "border-gray-200"}
                    transition-colors
                  `}
                >
                  <TableCell>
                    <Checkbox
                      checked={isCompanySelected}
                      onCheckedChange={() => onSelectCompany(company.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleExpand(company.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <FaChevronDown className="w-4 h-4" />
                      ) : (
                        <FaChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                        <FaBuilding className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">{company.companyName}</div>
                        <div className="text-sm text-muted-foreground">
                          {totalUsers} user{totalUsers !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {company.companyEmail}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center relative">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenUserModal(company.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <FaUserPlus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) =>
                          openMenu(
                            e,
                            `company-${company.id}`,
                            "company",
                            company
                          )
                        }
                      >
                        <SlOptionsVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Users */}
                {isExpanded && (
                  <>
                    {/* Owner Row */}
                    <TableRow
                      className={`
                        ${
                          darkMode
                            ? "bg-gray-800/30 border-gray-700"
                            : "bg-gray-50/50 border-gray-200"
                        }
                      `}
                    >
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 pl-6">
                          <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900">
                            <FaUser className="w-3 h-3 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {company.owner.firstName} {company.owner.lastName}
                            </div>
                            <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                              Owner
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.owner.email}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          company.owner.active ? "active" : "inactive"
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(company.createdAt)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>

                    {/* Regular Users */}
                    {company.users.map((user) => (
                      <TableRow
                        key={user.id}
                        className={`
                          ${
                            darkMode
                              ? "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50"
                              : "bg-gray-50/50 border-gray-200 hover:bg-gray-100"
                          }
                          transition-colors
                        `}
                      >
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 pl-6">
                            <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900">
                              <FaUser className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {user.firstName} {user.lastName}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                User
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.active ? "active" : "inactive")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-center relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) =>
                              openMenu(
                                e,
                                `user-${company.id}-${user.id}`,
                                "user",
                                {
                                  companyId: company.id,
                                  user,
                                }
                              )
                            }
                          >
                            <SlOptionsVertical className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      {/* Integrated Pagination */}
      <div
        className={`px-6 py-3 flex items-center justify-between border-t ${
          darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`flex items-center text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span>
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, totalCompanies)} of{" "}
            {totalCompanies} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className={`px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-300"
                : "bg-white border-gray-300 text-gray-700"
            }`}
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <div className="flex">
            <button
              className={`px-3 py-1 border rounded-l-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-300"
                  : "border-gray-300 hover:bg-gray-50 bg-white text-gray-700"
              }`}
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </button>
            <span
              className={`px-3 py-1 border-t border-b text-sm ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-gray-300"
                  : "border-gray-300 bg-gray-50 text-gray-700"
              }`}
            >
              {page + 1} of {Math.ceil(totalCompanies / rowsPerPage)}
            </span>
            <button
              className={`px-3 py-1 border rounded-r-md text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode
                  ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-300"
                  : "border-gray-300 hover:bg-gray-50 bg-white text-gray-700"
              }`}
              disabled={page >= Math.ceil(totalCompanies / rowsPerPage) - 1}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {menu && <MenuPortal menu={menu} onClose={() => setMenu(null)} />}
    </div>
  );
};

export default CompanyTable;
