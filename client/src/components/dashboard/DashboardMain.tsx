import React from 'react';
import { FaUsers, FaDollarSign, FaBoxOpen, FaUndo, FaGlobe } from 'react-icons/fa';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CountryData {
  country: string;
  percentage: number;
}

interface DashboardMainProps {
  darkMode: boolean;
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  categoryData: CategoryData[];
  countryData: CountryData[];
}

const DashboardMain: React.FC<DashboardMainProps> = ({
  darkMode, cardClass, textClass, mutedTextClass, categoryData, countryData
}) => (
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mb-3">
          Dashboard
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>🕐 Time period:</span>
        </div>
      </div>
      <button
        className="text-white px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-lg transform hover:scale-105"
        style={{ background: 'linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)' }}
      >
        Add data
      </button>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaUsers className="w-4 h-4 text-blue-500" />
            <span className={`text-sm ${mutedTextClass}`}>Total customers</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${textClass}`}>567,899</span>
          <span className="text-sm text-green-500 font-medium">📈 2.6%</span>
        </div>
      </div>

      <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaDollarSign className="w-4 h-4 text-green-500" />
            <span className={`text-sm ${mutedTextClass}`}>Total revenue</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${textClass}`}>$3,465 M</span>
          <span className="text-sm text-green-500 font-medium">📈 0.6%</span>
        </div>
      </div>

      <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaBoxOpen className="w-4 h-4 text-purple-500" />
            <span className={`text-sm ${mutedTextClass}`}>Total orders</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${textClass}`}>1,136 M</span>
          <span className="text-sm text-red-500 font-medium">📉 0.2%</span>
        </div>
      </div>

      <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaUndo className="w-4 h-4 text-orange-500" />
            <span className={`text-sm ${mutedTextClass}`}>Total returns</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${textClass}`}>1,789</span>
          <span className="text-sm text-green-500 font-medium">📈 0.12%</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Product Sales Chart */}
      <div className="lg:col-span-2">
        <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${textClass}`}>Product sales</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={`text-sm ${mutedTextClass}`}>Gross margin</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className={`text-sm ${mutedTextClass}`}>Revenue</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${textClass}`}>$52,187</span>
              <span className="text-sm text-green-500 font-medium">📈 2.6%</span>
            </div>
            <span className={`text-sm ${mutedTextClass}`}>Gross margin</span>
          </div>
          <div
            className="h-64 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, rgba(32, 174, 248, 0.1) 0%, rgba(10, 148, 255, 0.1) 54%, rgba(143, 207, 255, 0.1) 100%)' }}
          >
            <span className={`${mutedTextClass}`}>Chart visualization area</span>
          </div>
        </div>
      </div>

      {/* Sales by Countries */}
      <div>
        <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${textClass}`}>Sales by countries</h3>
          </div>
          <div className="space-y-4">
            {countryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%)' }}
                  ></div>
                  <span className={`text-sm ${textClass}`}>{item.country}</span>
                </div>
                <span className={`text-sm font-medium ${textClass}`}>{item.percentage}%</span>
              </div>
            ))}
          </div>
          <div
            className="mt-6 h-32 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, rgba(32, 174, 248, 0.2) 0%, rgba(10, 148, 255, 0.2) 54%, rgba(143, 207, 255, 0.2) 100%)' }}
          >
            <FaGlobe className="w-16 h-16 text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Sales by Product Category */}
    <div className="mt-8">
      <div className={`${cardClass} p-6 rounded-xl shadow-sm border border-gray-100 ${darkMode ? 'border-gray-700' : ''} hover:shadow-lg transition-shadow`}>
        <h3 className={`text-xl font-bold ${textClass} mb-6`}>Sales by product category</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="h-64 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, rgba(32, 174, 248, 0.1) 0%, rgba(10, 148, 255, 0.1) 54%, rgba(143, 207, 255, 0.1) 100%)' }}
          >
            <span className={`${mutedTextClass}`}>Chart visualization area</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div>
                  <span className={`text-sm ${textClass}`}>{item.name}</span>
                  <span className={`text-sm ${mutedTextClass} ml-2`}>- {item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMain;