import { Route } from "react-router-dom";
import StudentLayout from "@/layout/StudentLayout";

// 📚 Pages
import SchoolDashboard from "@/pages/sekolahislamku/dashboard-school/SchoolDashboard";
import SchoolStudent from "@/pages/sekolahislamku/dashboard-school/student-(pending)/SchoolStudent";
import AllSchedule from "@/pages/sekolahislamku/dashboard-school/dashboard/AllSchedule";
import SchoolProfile from "@/pages/sekolahislamku/dashboard-school/profile/SchoolProfile";
import SchoolFinance from "@/pages/sekolahislamku/dashboard-school/finance/SchoolFinance";
import DetailBill from "@/pages/sekolahislamku/dashboard-school/finance/DetailBill";
import SchoolTeacher from "@/pages/sekolahislamku/dashboard-school/teacher/SchoolTeacher";
import DetailTeacher from "@/pages/sekolahislamku/dashboard-school/teacher/components/DetailTeacher";
import AcademicSchool from "@/pages/sekolahislamku/dashboard-school/academic/AcademicSchool";
import DetailAcademic from "@/pages/sekolahislamku/dashboard-school/academic/components/DetailAcademic";
import ManagementAcademic from "@/pages/sekolahislamku/dashboard-school/academic/components/ManagementAcademic";
import DetailSchedule from "@/pages/sekolahislamku/dashboard-school/dashboard/DetailSchedule";
import AllInvoices from "@/pages/sekolahislamku/dashboard-school/dashboard/AllInvoices";
import Bill from "@/pages/sekolahislamku/dashboard-school/finance/Bill";
import TryoutTahfizhExam from "@/pages/sekolahislamku/dashboard-school/dashboard/TryoutTahfizhExam";
import AllAnnouncement from "@/pages/sekolahislamku/dashboard-school/dashboard/AllAnnouncement";
import SchoolClasses from "@/pages/sekolahislamku/dashboard-school/class/SchoolClass";
import SchoolManageClass from "@/pages/sekolahislamku/dashboard-school/class/detail/SchoolDetailClass";
import QuizPage from "@/pages/sekolahislamku/dashboard-school/class/components/QuizPage";
import QuizDetailPage from "@/pages/sekolahislamku/dashboard-school/class/components/QuizDetailPage";
import SchoolAttendance from "@/pages/sekolahislamku/dashboard-school/attendance-(pending)/SchoolAttendance";
import SchoolAnnouncement from "@/pages/sekolahislamku/dashboard-school/announcement/SchoolAnnouncement";
import SchoolBooks from "@/pages/sekolahislamku/dashboard-school/books/SchoolBooks";
import SchoolDetailBook from "@/pages/sekolahislamku/dashboard-school/books/detail/SchoolDetailBook";

// 🧭 Menu Utama
import SchoolMenuGrids from "@/pages/sekolahislamku/dashboard-school/menu-utama/SchoolMenuGrids";
import RoomSchool from "@/pages/sekolahislamku/dashboard-school/menu-utama/components/RoomSchool";
import DetailRoomSchool from "@/pages/sekolahislamku/dashboard-school/menu-utama/components/DetailRoomSchool";
import SchoolSpp from "@/pages/sekolahislamku/dashboard-school/spp/SchoolSpp";
import SchoolSubject from "@/pages/sekolahislamku/dashboard-school/subject/SchoolSubject";
import SchoolCertificate from "@/pages/sekolahislamku/dashboard-school/academic/certificate/SchoolCertificate";
import DetailCertificate from "@/pages/sekolahislamku/dashboard-school/academic/certificate/components/DetailCertificate";
import CalenderAcademic from "@/pages/sekolahislamku/dashboard-school/calender/CalenderAcademic";
import SchoolStatistik from "@/pages/sekolahislamku/dashboard-school/statistik/SchoolStatistik";
import SchoolSettings from "@/pages/sekolahislamku/dashboard-school/settings/SchoolSettings";
import SchoolActiveClass from "@/pages/sekolahislamku/dashboard-school/class/active-class/SchoolActiveClass";

export const SchoolRoutes = (
  <Route path="/:id/sekolah" element={<StudentLayout />}>
    {/* === Dashboard Utama === */}
    <Route index element={<SchoolDashboard />} />

    {/* === Murid === */}
    <Route path="murid" element={<SchoolStudent />} />

    {/* === Jadwal === */}
    <Route path="all-schedule" element={<AllSchedule />} />
    <Route
      path="all-schedule/detail/:scheduleId"
      element={<DetailSchedule />}
    />

    {/* === Profil Sekolah === */}
    <Route path="profil-sekolah" element={<SchoolProfile />} />

    {/* === Keuangan === */}
    <Route path="keuangan" element={<SchoolFinance />} />
    <Route path="keuangan/detail/:id" element={<DetailBill />} />

    {/* === Guru === */}
    <Route path="guru">
      <Route index element={<SchoolTeacher />} />
      <Route path=":id" element={<DetailTeacher />} />
    </Route>

    {/* === Akademik === */}
    <Route path="academic">
      <Route index element={<AcademicSchool />} />
      <Route path="detail" element={<DetailAcademic />} />
      <Route path="manage" element={<ManagementAcademic />} />
    </Route>

    {/* === Tagihan & Invoice === */}
    <Route path="all-invoices">
      <Route index element={<AllInvoices />} />
      <Route path=":id" element={<Bill />} />
    </Route>

    {/* === Lainnya === */}
    <Route path="tryout-tahfizh-exam" element={<TryoutTahfizhExam />} />
    <Route path="all-announcement" element={<AllAnnouncement />} />
    <Route path="kelas">
      <Route index element={<SchoolClasses />} />
      <Route path="detail/:id" element={<SchoolManageClass />} />
      <Route path="quiz/:id" element={<QuizPage />} />
      <Route path="quiz/:id/do" element={<QuizDetailPage />} />
    </Route>

    {/* === Kehadiran === */}
    <Route path="kehadiran" element={<SchoolAttendance />} />

    {/* === Pengumuman === */}
    <Route path="pengumuman" element={<SchoolAnnouncement />} />

    {/* === Buku === */}
    <Route path="buku">
      <Route index element={<SchoolBooks />} />
      <Route path="detail/:id" element={<SchoolDetailBook />} />
    </Route>

    {/* === MENU UTAMA === */}
    <Route path="menu-utama">
      <Route index element={<SchoolMenuGrids />} />
      <Route path="profil-sekolah" element={<SchoolProfile showBack />} />
      <Route path="keuangan" element={<SchoolFinance showBack />} />
      <Route path="keuangan/detail/:id" element={<DetailBill />} />
      <Route path="guru" element={<SchoolTeacher showBack />} />
      <Route path="all-announcement" element={<AllAnnouncement />} />
      <Route path="sekolah" element={<SchoolDashboard showBack />} />
      <Route path="room-school" element={<RoomSchool />} />
      <Route path="room-school/:id" element={<DetailRoomSchool />} />
      <Route path="spp" element={<SchoolSpp />} />
      <Route path="pelajaran" element={<SchoolSubject />} />
      <Route path="sertifikat" element={<SchoolCertificate />} />
      <Route path="kalender" element={<CalenderAcademic />} />
      <Route path="statistik" element={<SchoolStatistik />} />
      <Route path="pengaturan" element={<SchoolSettings />} />
      <Route path="kelas-aktif" element={<SchoolActiveClass />} />
      <Route
        path="sertifikat/detail/:classId/:studentId"
        element={<DetailCertificate />}
      />
      <Route path="murid" element={<SchoolStudent showBack />} />
      <Route path="buku">
        <Route index element={<SchoolBooks showBack />} />
        <Route path="detail/:id" element={<SchoolDetailBook />} />
      </Route>
      <Route path="kelas">
        <Route index element={<SchoolClasses showBack />} />
        <Route path="detail/:id" element={<SchoolManageClass />} />
      </Route>
      <Route path="academic">
        <Route index element={<AcademicSchool showBack />} />
        <Route path="detail" element={<DetailAcademic />} />
        <Route path="manage" element={<ManagementAcademic />} />
      </Route>
    </Route>
  </Route>
);
