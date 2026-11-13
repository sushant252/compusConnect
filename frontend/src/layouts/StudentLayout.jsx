
import StudentSidebar from "../components/student/StudentSidebar";
import StudentNavbar from "../components/student/StudentNavbar";
import "./StudentLayout.css"
function StudentLayout({ title, subtitle, children }) {
  return (
    <div className="student-layout">
      <StudentSidebar />

      <main className="student-main">
        <StudentNavbar title={title} subtitle={subtitle} />

        <section className="dashboard-content">
          {children}
        </section>
      </main>
    </div>
  );
}

export default StudentLayout;
