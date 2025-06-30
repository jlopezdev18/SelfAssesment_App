import { useState } from "react";

export function useVersioningUI() {
  const [copiedHash, setCopiedHash] = useState<string>('');
  const [expandedFile, setExpandedFile] = useState<string>('');

  const copyToClipboard = async (text: string, hashId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(hashId);
      setTimeout(() => setCopiedHash(''), 2000);
    } catch (err) {
      // Optionally handle error
    }
  };

  const toggleExpandedFile = (filename: string) => {
    setExpandedFile(prev => prev === filename ? '' : filename);
  };

  return { copiedHash, expandedFile, copyToClipboard, toggleExpandedFile };
}