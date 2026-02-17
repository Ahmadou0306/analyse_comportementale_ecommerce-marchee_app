import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout() {
  const { adminUser } = useAdmin();

  if (!adminUser) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
