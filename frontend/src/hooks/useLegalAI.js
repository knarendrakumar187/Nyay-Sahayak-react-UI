import { useState } from 'react';
import API_BASE_URL from '../config/api';

const API_URL = API_BASE_URL;

export const useLegalAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message, context) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: message,
          user_name: context.name,
          role: context.role,
          language: context.language,
          detail_level: context.detailLevel,
          state: context.state
        })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError("Server Offline");
      return { answer: "Connection Lost. Is the backend running?", status: "error" };
    } finally {
      setLoading(false);
    }
  };

  const analyzeDossier = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_URL}/analyze-dossier`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (err) {
      setError("Analysis Failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateLegalNotice = async (voiceInput) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/generate-legal-notice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice_input: voiceInput })
      });
      if (response.ok) return await response.blob();
      throw new Error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const generateRentAgreement = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/generate-rent-agreement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) return await response.blob();
      throw new Error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const analyzeFIR = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_URL}/analyze-fir`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (err) {
      return { answer: "Vision Analysis Failed." };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    analyzeDossier,
    generateLegalNotice,
    generateRentAgreement,
    analyzeFIR,
    loading,
    error
  };
};