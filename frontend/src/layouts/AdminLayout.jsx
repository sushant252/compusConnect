import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import "./AdminLayout.css";

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminNavbar title={title} subtitle={subtitle} />

        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;