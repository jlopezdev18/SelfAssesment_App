import React from "react";
import { FaTimes, FaBuilding, FaUser } from "react-icons/fa";
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
  textClass: string;
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
  textClass,
  cardClass,
  loading,
  isEditing
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${cardClass} rounded-lg shadow-xl w-full max-w-2xl mx-4`}>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${textClass}`}>{isEditing ? "Edit Company" : "Add New Company"}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Company Information */}
            <div>
              <h4 className={`text-md font-medium ${textClass} mb-4 flex items-center`}>
                <FaBuilding className="w-4 h-4 mr-2" />
                Company Information
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-1`}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyName ? "border-red-300" : "border-gray-300"
                    }`}
                    value={form.companyName}
                    onChange={(e) => onChange("companyName", e.target.value)}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-1`}>
                    Company Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyEmail ? "border-red-300" : "border-gray-300"
                    }`}
                    value={form.companyEmail}
                    onChange={(e) => onChange("companyEmail", e.target.value)}
                  />
                  {errors.companyEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h4 className={`text-md font-medium ${textClass} mb-4 flex items-center`}>
                <FaUser className="w-4 h-4 mr-2" />
                Owner Information
              </h4>
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
                    onChange={(e) => onChange("firstName", e.target.value)}
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
                    onChange={(e) => onChange("lastName", e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className={`block text-sm font-medium ${textClass} mb-1`}>
                  Owner Email
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
                {loading ? (
                <>
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
                  <ClipLoader color="#fff" size={16} />
                </>
              ) : (
                isEditing ? "Update Company" : "Create Company"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;