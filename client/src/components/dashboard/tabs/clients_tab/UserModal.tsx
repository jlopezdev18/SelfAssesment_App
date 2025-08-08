import React from "react";
import { FaUser } from "react-icons/fa";
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
import { Badge } from "@/components/ui/badge";
import type { NewUserForm, Company } from "./types/ClientsInterfaces";
import PulseLoader from "react-spinners/PulseLoader";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: NewUserForm;
  errors: Partial<NewUserForm>;
  onChange: (field: keyof NewUserForm, value: string) => void;
  selectedCompany: string | null;
  companies: Company[];
  textClass: string;
  cardClass: string;
  loading: boolean;
  isEditing?: boolean; 
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSubmit,
  form,
  errors,
  onChange,
  selectedCompany,
  companies,
  loading,
  isEditing
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaUser className="h-5 w-5" />
            {isEditing ? "Edit User" : "Add User to Company"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <p className="text-sm text-destructive">{errors.firstName}</p>
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
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          
          {selectedCompany && (
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
              <Badge variant="secondary" className="mb-2">
                Adding to
              </Badge>
              <p className="text-sm font-medium">
                {companies.find(c => c.id === selectedCompany)?.name}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <PulseLoader color="currentColor" size={8} className="mr-2" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditing ? "Update User" : "Add User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;