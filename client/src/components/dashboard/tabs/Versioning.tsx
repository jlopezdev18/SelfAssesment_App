import React, { useState } from 'react';
import { FaCopy, FaCheck, FaShieldAlt, FaTag, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

interface HashInfo {
  algorithm: string;
  hash: string;
}

interface VersionFile {
  filename: string;
  hashes: HashInfo[];
  size?: string;
  type: 'installer' | 'update' | 'patch';
}

interface VersionInfo {
  version: string;
  releaseDate: string;
  releaseType: string;
  description: string;
  files: VersionFile[];
}

interface VersioningProps {
  cardClass: string;
  textClass: string;
  mutedTextClass: string;
  darkMode: boolean;
}

const Versioning: React.FC<VersioningProps> = ({
  cardClass,
  textClass,
  mutedTextClass,
  darkMode,
}) => {
  const [copiedHash, setCopiedHash] = useState<string>('');
  const [expandedFile, setExpandedFile] = useState<string>('');

  // Your version data
  const versionData: VersionInfo = {
    version: "1.5.0",
    releaseDate: "01/13/2025",
    releaseType: "Q3 2024 Release",
    description: "Latest stable release with enhanced features and security improvements",
    files: [
      {
        filename: "SelfAssessmentApp - Full - Installer - Ver 1.5.0.exe",
        type: "installer",
        size: "45.2 MB",
        hashes: [
          {
            algorithm: "SHA512",
            hash: "2385199AFEA2135525F008F53D30C0FF03C57C7A3C295B61949BC38A3E63D51A60480996B6BDF53F9044A8FEB29F977DE00C2323"
          },
          {
            algorithm: "SHA384", 
            hash: "8B7E64A5779639666E71397260ADEE4EA268940E4DD253006E38E15FF764B738A80DDCB67F1C788832977A0F100E1768F2387"
          },
          {
            algorithm: "SHA256",
            hash: "C2F0FF1AD38D2D959628B89A30B1236A588F3A127405370382158FB8A56AE342"
          }
        ]
      },
      {
        filename: "SelfAssessmentApp - Update - Ver 1.5.0.exe",
        type: "update",
        size: "12.8 MB",
        hashes: [
          {
            algorithm: "SHA512",
            hash: "1321DF8EFF9DA101AA1A1050F797D4657C5D3574978E6151AFB2CF6D28DAAC222FC854D28F45F293FB7349CD8D38E1639A4"
          },
          {
            algorithm: "SHA384",
            hash: "1C5C85B01815F9229589F4A8E347921094697469ED8E255744335AF049294D8DC57CE53FCD0BD83B529EDE60C0C5979"
          },
          {
            algorithm: "SHA256",
            hash: "ED717AF28EBCD1052A1A1A1BAF2C766A0A2B8B2D1B679DE164EA8067C8563313"
          }
        ]
      }
    ]
  };

  const copyToClipboard = async (text: string, hashId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(hashId);
      setTimeout(() => setCopiedHash(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'installer':
        return darkMode 
          ? 'bg-blue-900 text-blue-300 border-blue-700' 
          : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'update':
        return darkMode 
          ? 'bg-green-900 text-green-300 border-green-700' 
          : 'bg-green-100 text-green-700 border-green-200';
      default:
        return darkMode 
          ? 'bg-purple-900 text-purple-300 border-purple-700' 
          : 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'installer':
        return '📦';
      case 'update':
        return '🔄';
      default:
        return '🔧';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 mb-8">
        Version Information
      </h1>

      {/* Version Header */}
      <div className={`${cardClass} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'} mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              <FaTag className="w-8 h-8" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${textClass}`}>Version {versionData.version}</h2>
              <p className={`${mutedTextClass} text-sm`}>{versionData.releaseType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
              Stable
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <FaCalendarAlt className={mutedTextClass} />
              <span className={mutedTextClass}>{versionData.releaseDate}</span>
            </div>
          </div>
        </div>
        <p className={`${mutedTextClass} text-sm`}>{versionData.description}</p>
      </div>

      {/* Hash Verification Section */}
      <div className={`${cardClass} p-6 rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <FaShieldAlt className="w-6 h-6 text-blue-500" />
          <h3 className={`text-xl font-bold ${textClass}`}>File Hash Verification</h3>
        </div>
        
        <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-800'} border-l-4 p-4 mb-6`}>
          <div className="flex items-start space-x-2">
            <FaInfoCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Security Notice</p>
              <p className="text-sm mt-1">Always verify file hashes before installation to ensure file integrity and security.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {versionData.files.map((file, fileIndex) => (
            <div key={fileIndex} className={`border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div 
                className={`p-4 cursor-pointer hover:${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}
                onClick={() => setExpandedFile(expandedFile === file.filename ? '' : file.filename)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(file.type)}</span>
                    <div>
                      <h4 className={`font-semibold ${textClass}`}>{file.filename}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(file.type)}`}>
                          {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                        </span>
                        {file.size && (
                          <span className={`text-sm ${mutedTextClass}`}>{file.size}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`transform transition-transform ${expandedFile === file.filename ? 'rotate-180' : ''}`}>
                    ⌄
                  </div>
                </div>
              </div>
              
              {expandedFile === file.filename && (
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="space-y-3">
                    {file.hashes.map((hash, hashIndex) => {
                      const hashId = `${fileIndex}-${hashIndex}`;
                      return (
                        <div key={hashIndex} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {hash.algorithm}
                            </span>
                            <button
                              onClick={() => copyToClipboard(hash.hash, hashId)}
                              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                copiedHash === hashId
                                  ? 'bg-green-500 text-white'
                                  : darkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {copiedHash === hashId ? (
                                <>
                                  <FaCheck className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <FaCopy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <code className={`block text-xs break-all p-2 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-800'} font-mono`}>
                            {hash.hash}
                          </code>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-800'} border`}>
          <div className="flex items-start space-x-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Important Security Warning</p>
              <p className="text-sm mt-1">
                If any calculated hash doesn't match these values exactly, do not install the software. 
                This could indicate file corruption or tampering. Contact support immediately if hashes don't match.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Versioning;