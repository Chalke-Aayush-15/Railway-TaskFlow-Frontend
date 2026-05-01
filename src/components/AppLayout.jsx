import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-w)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
