'use client';

/**
 * SIDEBAR NAVIGATION
 *
 * Premium sidebar with ink accent on active states.
 * Pipeline navigation with visual motifs.
 */

import React from 'react';
import { tokens } from '../design-tokens';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  subItems?: { id: string; label: string }[];
}

interface SidebarProps {
  activeItem: string;
  onNavigate: (id: string) => void;
  collapsed?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    badge: 3,
  },
  {
    id: 'create',
    label: 'Create Content',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    subItems: [
      { id: 'create-blog', label: 'Blog Post' },
      { id: 'create-social', label: 'Social Pack' },
      { id: 'create-email', label: 'Email Sequence' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

const NavItemComponent = ({
  item,
  isActive,
  isSubActive,
  onClick,
  collapsed,
  expanded,
  onToggleExpand,
}: {
  item: NavItem;
  isActive: boolean;
  isSubActive?: string;
  onClick: (id: string) => void;
  collapsed: boolean;
  expanded: boolean;
  onToggleExpand?: () => void;
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasSubItems && onToggleExpand) {
            onToggleExpand();
          } else {
            onClick(item.id);
          }
        }}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-300 relative group
        `}
        style={{
          background: isActive ? tokens.colors.ink[50] : 'transparent',
          color: isActive ? tokens.colors.ink[700] : tokens.colors.text.secondary,
        }}
      >
        {/* Active indicator - ink accent line */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
            style={{ background: tokens.colors.ink[700] }}
          />
        )}

        {/* Icon */}
        <span
          className="transition-colors duration-300"
          style={{
            color: isActive ? tokens.colors.ink[700] : tokens.colors.text.muted,
          }}
        >
          {item.icon}
        </span>

        {/* Label */}
        {!collapsed && (
          <>
            <span
              className="flex-1 text-left text-sm font-medium"
              style={{ fontFamily: tokens.fonts.sans }}
            >
              {item.label}
            </span>

            {/* Badge */}
            {item.badge && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: tokens.colors.ink[100],
                  color: tokens.colors.ink[700],
                }}
              >
                {item.badge}
              </span>
            )}

            {/* Expand arrow for sub-items */}
            {hasSubItems && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform duration-300"
                style={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: tokens.colors.text.muted,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </>
        )}
      </button>

      {/* Sub-items */}
      {hasSubItems && expanded && !collapsed && (
        <div className="ml-11 mt-1 space-y-1">
          {item.subItems!.map((subItem) => (
            <button
              key={subItem.id}
              onClick={() => onClick(subItem.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                color: isSubActive === subItem.id ? tokens.colors.ink[700] : tokens.colors.text.muted,
                background: isSubActive === subItem.id ? tokens.colors.ink[50] : 'transparent',
                fontFamily: tokens.fonts.sans,
              }}
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onNavigate,
  collapsed = false,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['create']);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <aside
      className="h-screen flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? '80px' : '280px',
        background: tokens.colors.paper.white,
        borderRight: `1px solid ${tokens.colors.paper.border}`,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-6 border-b"
        style={{ borderColor: tokens.colors.paper.border }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: tokens.colors.ink[700] }}
        >
          <span className="text-white font-bold text-lg" style={{ fontFamily: tokens.fonts.serif }}>
            S
          </span>
        </div>
        {!collapsed && (
          <div>
            <h1
              className="font-semibold"
              style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.serif }}
            >
              Scribengine
            </h1>
            <p
              className="text-xs"
              style={{ color: tokens.colors.text.muted }}
            >
              Content Studio
            </p>
          </div>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={activeItem === item.id || activeItem.startsWith(item.id)}
            isSubActive={activeItem}
            onClick={onNavigate}
            collapsed={collapsed}
            expanded={expandedItems.includes(item.id)}
            onToggleExpand={() => toggleExpand(item.id)}
          />
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="p-4 border-t space-y-1" style={{ borderColor: tokens.colors.paper.border }}>
        {bottomNavItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={onNavigate}
            collapsed={collapsed}
            expanded={false}
          />
        ))}

        {/* User profile */}
        {!collapsed && (
          <div
            className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ background: tokens.colors.sage[100], color: tokens.colors.sage[700] }}
            >
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: tokens.colors.text.primary, fontFamily: tokens.fonts.sans }}
              >
                John Doe
              </p>
              <p
                className="text-xs truncate"
                style={{ color: tokens.colors.text.muted }}
              >
                Pro Plan
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
