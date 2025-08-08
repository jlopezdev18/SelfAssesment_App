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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
}) => {
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
      <div className={`${cardClass} rounded-lg border p-8`}>
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
    <div className={`${cardClass} rounded-lg border overflow-hidden`}>
      <Table>
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
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenUserModal(company.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <FaUserPlus className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <SlOptionsVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEditCompany(company)}
                          >
                            <FaEdit className="w-4 h-4 mr-2" />
                            Edit Company
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onNotifyCompany(company.id)}
                          >
                            <FaBell className="w-4 h-4 mr-2" />
                            Notification
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteCompany(company.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Delete Company
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <SlOptionsVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onEditUser(user, company.id)}
                              >
                                <FaEdit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onDeleteUser(user.id, company.id)
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <FaTrash className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
    </div>
  );
};

export default CompanyTable;
