import React from 'react';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';

const Layout = ({ children, onLogout, user, menuItems = [] }) => {
  return (
    <div className="layout">
      <Header user={user} />
      <Sidebar
        menuItems={menuItems}
        onLogout={onLogout}
      />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;