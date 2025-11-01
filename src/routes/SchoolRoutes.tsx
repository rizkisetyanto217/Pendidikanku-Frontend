import { Route } from "react-router-dom";
import DashboardLayout from "@/layout/CDashboardLayout";

// Pages
import SchoolDashboard from "@/pages/pendidikanku-dashboard/dashboard-school/SchoolMainDashboard";
import SchoolStudent from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/student-(pending)/SchoolStudent";
import AllSchedule from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolAllSchedule";
import SchoolProfile from "@/pages/pendidikanku-dashboard/dashboard-school/profile/SchoolProfile";
import SchoolFinance from "@/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolFinance";
import DetailBill from "@/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolDetailBill";
import SchoolTeacher from "@/pages/pendidikanku-dashboard/dashboard-school/teacher/SchoolTeacher";
import DetailTeacher from "@/pages/pendidikanku-dashboard/dashboard-school/teacher/components/CSchoolDetailTeacher";
import AcademicSchool from "@/pages/pendidikanku-dashboard/dashboard-school/academic/SchoolAcademic";
import DetailAcademic from "@/pages/pendidikanku-dashboard/dashboard-school/academic/components/CSchoolDetailAcademic";
import ManagementAcademic from "@/pages/pendidikanku-dashboard/dashboard-school/academic/components/CSchoolManagementAcademic";
import DetailSchedule from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolDetailSchedule";
import AllInvoices from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolAllInvoices";
import Bill from "@/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolBill";
import TryoutTahfizhExam from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolTryoutTahfizhExam";
import AllAnnouncement from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolAllAnnouncement";
import SchoolClasses from "@/pages/pendidikanku-dashboard/dashboard-school/class/SchoolClass";
import SchoolManageClass from "@/pages/pendidikanku-dashboard/dashboard-school/class/detail/SchoolDetailClass";
import QuizPage from "@/pages/pendidikanku-dashboard/dashboard-school/class/components/CSchoolQuizPage";
import QuizDetailPage from "@/pages/pendidikanku-dashboard/dashboard-school/class/components/CSchoolQuizDetailPage";
import SchoolAttendance from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/attendance-(pending)/SchoolAttendance";
import SchoolAnnouncement from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/announcement-(pending)/SchoolAnnouncement";
import SchoolBooks from "@/pages/pendidikanku-dashboard/dashboard-school/books/SchoolBooks";
import SchoolDetailBook from "@/pages/pendidikanku-dashboard/dashboard-school/books/detail/SchoolDetailBook";

// Menu Utama
import SchoolMenuGrids from "@/pages/pendidikanku-dashboard/dashboard-school/menu/SchoolMenuGrids";
import RoomSchool from "@/pages/pendidikanku-dashboard/dashboard-school/academic/rooms/SchoolRoom";
import DetailRoomSchool from "@/pages/pendidikanku-dashboard/dashboard-school/academic/rooms/SchoolDetailRoom";
import SchoolSpp from "@/pages/pendidikanku-dashboard/dashboard-school/finance/spp/SchoolSpp";
import SchoolSubject from "@/pages/pendidikanku-dashboard/dashboard-school/subject/SchoolSubject";
import SchoolCertificate from "@/pages/pendidikanku-dashboard/dashboard-school/academic/certificate/SchoolCertificate";
import DetailCertificate from "@/pages/pendidikanku-dashboard/dashboard-school/academic/certificate/components/CSchoolDetailCertificate";
import CalenderAcademic from "@/pages/pendidikanku-dashboard/dashboard-school/calender/SchoolCalenderAcademic";
import SchoolStatistik from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/statistic-(pending)/SchoolStatistic";
import SchoolSettings from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/settings-(pending)/SchoolSettings";
import SchoolActiveClass from "@/pages/pendidikanku-dashboard/dashboard-school/class/active-class/SchoolActiveClass";

export const SchoolRoutes = (
  <Route path="sekolah" element={<DashboardLayout />}>
    {/* === Dashboard Utama === */}
    <Route index element={<SchoolDashboard />} />

    {/* === Murid === */}
    <Route path="murid" element={<SchoolStudent />} />

    {/* === Jadwal === */}
    {/*^ Belum diimplementasikan  */}
    <Route path="jadwal" element={<AllSchedule />} />
    {/*^ Belum diimplementasikan  */}
    <Route path="jadwal/detail/:scheduleId" element={<DetailSchedule />} />

    {/* === Profil Sekolah === */}
    <Route path="profil-sekolah" element={<SchoolProfile />} />

    {/* === Keuangan === */}
    <Route path="keuangan" element={<SchoolFinance />} />

    {/* Halaman belum bisa */}
    <Route path="keuangan/detail/:id" element={<DetailBill />} />

    {/* === Guru === */}
    <Route path="guru">
      <Route index element={<SchoolTeacher />} />
      <Route path=":id" element={<DetailTeacher />} />
    </Route>

    {/* === Akademik === */}
    <Route path="akademik">
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
      {/* <Route path="all-announcement" element={<AllAnnouncement />} /> */}
      <Route path="sekolah" element={<SchoolDashboard showBack />} />
      <Route path="room-school" element={<RoomSchool showBack />} />
      <Route path="room-school/:id" element={<DetailRoomSchool />} />
      <Route path="spp" element={<SchoolSpp />} />
      <Route path="pelajaran" element={<SchoolSubject />} />
      <Route path="sertifikat" element={<SchoolCertificate />} />
      <Route path="kalender" element={<CalenderAcademic />} />
      {/* <Route path="statistik" element={<SchoolStatistik />} /> */}
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
        <Route path="manage" element={<SchoolManageClass />} />
      </Route>
      <Route path="academic">
        <Route index element={<AcademicSchool showBack />} />
        <Route path="detail" element={<DetailAcademic />} />
        <Route path="manage" element={<ManagementAcademic />} />
      </Route>
    </Route>
  </Route>
);
