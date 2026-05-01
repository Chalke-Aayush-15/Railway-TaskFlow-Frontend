import React from 'react';
import AdminDashboard from './AdminDashboard';

// Simple router — renders AdminDashboard directly.
// Extend this if you need role-based routing for admins.
export default function AdminDashboardRouter() {
  return <AdminDashboard />;
}
