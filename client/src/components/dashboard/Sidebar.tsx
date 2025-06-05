import React from 'react';
import {
  FaChartBar, FaDownload, FaFileAlt, FaDollarSign, FaCog, FaMoon, FaSun, FaSignOutAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'downloads') => void;
  mutedTextClass: string;
  textClass: string;
  sidebarClass: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed, setSidebarCollapsed, darkMode, setDarkMode,
  activeTab, setActiveTab, mutedTextClass, textClass, sidebarClass
}) => (
  <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${sidebarClass} border-r transition-all duration-300 flex flex-col relative`}>
    {/* Arrow Toggle Button */}
    <button
      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      className={`absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 ${sidebarClass} border rounded-full flex items-center justify-center z-10 hover:shadow-lg transition-all duration-300 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
      style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}
    >
      {sidebarCollapsed ? (
        <FaChevronRight className={`w-3 h-3 ${textClass}`} />
      ) : (
        <FaChevronLeft className={`w-3 h-3 ${textClass}`} />
      )}
    </button>

    <div className="flex-1 p-6">
      {/* Header with logo */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {!sidebarCollapsed && (
            <span className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800`}>
              SAP
            </span>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="mb-8">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)' }}
          >
            HN
          </div>
          {!sidebarCollapsed && (
            <div>
              <h3 className={`font-semibold ${textClass}`}>Harper Nelson</h3>
              <p className={`text-sm ${mutedTextClass}`}>Admin Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {!sidebarCollapsed && (
          <div className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3`}>
            MARKETING
          </div>
        )}

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-medium'
              : `${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`
          }`}
          title={sidebarCollapsed ? 'Dashboard' : ''}
        >
          <FaChartBar className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Dashboard</span>}
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${
            activeTab === 'downloads'
              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-medium'
              : `${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`
          }`}
          title={sidebarCollapsed ? 'Downloads' : ''}
        >
          <FaDownload className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Downloads</span>}
        </button>

        {!sidebarCollapsed && (
          <div className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3 mt-6`}>
            PAYMENTS
          </div>
        )}

        <button
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          title={sidebarCollapsed ? 'Ledger' : ''}
        >
          <FaFileAlt className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Ledger</span>}
        </button>

        <button
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          title={sidebarCollapsed ? 'Taxes' : ''}
        >
          <FaDollarSign className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Taxes</span>}
        </button>

        {!sidebarCollapsed && (
          <div className={`text-xs font-semibold ${mutedTextClass} uppercase tracking-wider mb-3 mt-6`}>
            SYSTEM
          </div>
        )}

        <button
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          title={sidebarCollapsed ? 'Settings' : ''}
        >
          <FaCog className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
          title={sidebarCollapsed ? 'Dark mode' : ''}
        >
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            {darkMode ? <FaSun className="w-5 h-5 flex-shrink-0" /> : <FaMoon className="w-5 h-5 flex-shrink-0" />}
            {!sidebarCollapsed && <span>Dark mode</span>}
          </div>
          {!sidebarCollapsed && (
            <div className={`w-10 h-6 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-gray-300'} relative transition-colors`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
            </div>
          )}
        </button>
      </nav>
    </div>

    {/* Bottom section - Logout */}
    <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <button
        className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${mutedTextClass} hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}
        title={sidebarCollapsed ? 'Log out' : ''}
      >
        <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span>Log out</span>}
      </button>
    </div>
  </div>
);

export default Sidebar;