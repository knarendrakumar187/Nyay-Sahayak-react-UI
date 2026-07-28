import React from 'react';
import { MessageSquare, Shield, Globe, ArrowLeftRight, FileText, BookOpen, Gavel } from 'lucide-react';

/**
 * Role-based app tools.
 * FIR (report) is Police-only.
 */
export const ROLE_MENUS = {
  Citizen: [
    { id: 'chat', label: 'Ask Legal Help', icon: 'MessageSquare' },
    { id: 'ipc-bns', label: 'IPC to BNS Mapping', icon: 'ArrowLeftRight' },
    { id: 'digital', label: 'Citizen Seva', icon: 'Globe' },
  ],
  Advocate: [
    { id: 'chat', label: 'Legal Research', icon: 'Gavel' },
    { id: 'ipc-bns', label: 'IPC ↔ BNS Mapping', icon: 'ArrowLeftRight' },
    { id: 'digital', label: 'Court & Seva Links', icon: 'FileText' },
  ],
  Police: [
    { id: 'chat', label: 'Legal Assistant', icon: 'MessageSquare' },
    { id: 'report', label: 'File Report (FIR)', icon: 'Shield' },
    { id: 'ipc-bns', label: 'IPC ↔ BNS Mapping', icon: 'ArrowLeftRight' },
    { id: 'digital', label: 'Official Portals', icon: 'Globe' },
  ],
  Student: [
    { id: 'chat', label: 'Learn BNS', icon: 'BookOpen' },
    { id: 'ipc-bns', label: 'IPC to BNS Study Map', icon: 'ArrowLeftRight' },
    { id: 'digital', label: 'Explore Services', icon: 'Globe' },
  ],
};

const ICONS = {
  MessageSquare: MessageSquare,
  Shield: Shield,
  Globe: Globe,
  ArrowLeftRight: ArrowLeftRight,
  FileText: FileText,
  BookOpen: BookOpen,
  Gavel: Gavel,
};

export const getMenuForRole = (role) => {
  const items = ROLE_MENUS[role] || ROLE_MENUS.Citizen;
  return items.map((item) => {
    const Icon = ICONS[item.icon] || MessageSquare;
    return {
      id: item.id,
      label: item.label,
      icon: <Icon size={20} />,
    };
  });
};

export const canAccessMode = (role, modeId) => {
  const items = ROLE_MENUS[role] || ROLE_MENUS.Citizen;
  return items.some((item) => item.id === modeId);
};

export const defaultModeForRole = (role) => {
  const items = ROLE_MENUS[role] || ROLE_MENUS.Citizen;
  return items[0]?.id || 'chat';
};
