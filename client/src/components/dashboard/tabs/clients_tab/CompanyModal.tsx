import React from "react";
import { Building, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ClipLoader from "react-spinners/ClipLoader";

interface CompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: {
    companyName: string;
    companyEmail: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  errors: Record<string, string>;
  onChange: (field: keyof CompanyModalProps["form"], value: string) => void;
  cardClass: string;
  loading: boolean;
  isEditing?: boolean;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  open,
  onClose,
  onSubmit,
  form,
  errors,
  onChange,
  loading,
  isEditing,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isEditing ? "Edit Company" : "Add New Company"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Building className="h-4 w-4" />
              Company Information
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => onChange("companyName", e.target.value)}
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={form.companyEmail}
                  onChange={(e) => onChange("companyEmail", e.target.value)}
                  className={errors.companyEmail ? "border-destructive" : ""}
                />
                {errors.companyEmail && (
                  <p className="text-sm text-destructive">
                    {errors.companyEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Owner Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <User className="h-4 w-4" />
              Owner Information
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => onChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => onChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {loading ? (
                <>
                  <ClipLoader color="currentColor" size={16} className="mr-2" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Company"
              ) : (
                "Create Company"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModal;
