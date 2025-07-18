import React from "react";
import { FaTimes } from "react-icons/fa";
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
  textClass,
  cardClass,
  loading,
  isEditing
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${cardClass} rounded-lg shadow-xl w-full max-w-md mx-4`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className={`text-lg font-semibold ${textClass}`}>{isEditing ? "Edit User" : "Add User to Company"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                  errors.firstName ? "border-red-300" : "border-gray-300"
                }`}
                value={form.firstName}
                onChange={e => onChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-1`}>
                Last Name
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                }`}
                value={form.lastName}
                onChange={e => onChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
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
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              value={form.email}
              onChange={e => onChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          {selectedCompany && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Adding to:</strong>{" "}
                {companies.find(c => c.id === selectedCompany)?.name}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
             {loading ? (
                <>
                  <PulseLoader color="#fff" size={8} />
                </>
              ) : (
                isEditing ? "Edit User" : "Add User"
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;