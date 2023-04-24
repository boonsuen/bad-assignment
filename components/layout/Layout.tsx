import Link from 'next/link';
import { SidebarIcons } from '../svg/SidebarIcons.svg';
import React from 'react';

type roles =
  | 'guest'
  | 'farmer'
  | 'distributionCenter'
  | 'retailer'
  | 'consumer'
  | 'admin';

export type paths =
  | '/check'
  | '/add-durian'
  | '/catalog'
  | '/stock-in'
  | '/sell'
  | '/add-consumer'
  | '/rate'
  | '/add-account';

export const pages: {
  [key in paths]: {
    title: string;
    access: roles;
  };
} = {
  '/check': {
    title: 'Check Durian',
    access: 'guest',
  },
  '/add-durian': {
    title: 'Add Durian',
    access: 'farmer',
  },
  '/catalog': {
    title: 'Catalog Durian',
    access: 'distributionCenter',
  },
  '/stock-in': {
    title: 'Stock In Durian',
    access: 'retailer',
  },
  '/sell': {
    title: 'Sell Durian',
    access: 'retailer',
  },
  '/add-consumer': {
    title: 'Add Consumer',
    access: 'retailer',
  },
  '/rate': {
    title: 'Rate Durian',
    access: 'consumer',
  },
  '/add-account': {
    title: 'Add Account',
    access: 'admin',
  },
};

type LayoutProps = {
  children: React.ReactNode;
  currentPage: keyof typeof pages;
  currentRole: roles;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  currentRole,
}) => {
  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full md:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 gap-[16px] overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col">
          <ul className="space-y-2 font-medium">
            {Object.entries(pages).map(([path, { title, access }]) => {
              return (
                <li key={path}>
                  <Link
                    href={path}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <SidebarIcons
                      isActive={path === currentPage}
                      path={path as paths}
                    />
                    <span
                      className={`flex-1 ml-3 whitespace-nowrap ${
                        currentPage === path && 'text-primary'
                      }`}
                    >
                      {title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {currentRole !== 'guest' && (
            <button className="font-medium mt-auto flex items-center justify-center text-primary w-full h-12 min-h-[48px] rounded border border-primary">
              Log Out
            </button>
          )}
        </div>
      </aside>
      {children}
    </>
  );
};

export default Layout;
