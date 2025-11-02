import { Route } from "react-router-dom";
import DashboardLayout from "@/layout/CDashboardLayout";

// Pages
import SchoolDashboard from "@/pages/pendidikanku-dashboard/dashboard-school/SchoolMainDashboard";
import SchoolStudent from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/student-(pending)/SchoolStudent";
import SchoolAllSchedule from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolAllSchedule";
import SchoolProfile from "@/pages/pendidikanku-dashboard/dashboard-school/profile/SchoolProfile";
import SchoolFinance from "@/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolFinance";
import SchoolDetailBill from "@/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolDetailBill";
import SchoolTeacher from "@/pages/pendidikanku-dashboard/dashboard-school/teacher/SchoolTeacher";
import SchoolDetailTeacher from "@/pages/pendidikanku-dashboard/dashboard-school/teacher/components/CSchoolDetailTeacher";
import SchoolAcademic from "@/pages/pendidikanku-dashboard/dashboard-school/academic/SchoolAcademic";
import DetailAcademic from "@/pages/pendidikanku-dashboard/dashboard-school/academic/components/SchoolDetailAcademic";
import SchoolManagementAcademic from "@/pages/pendidikanku-dashboard/dashboard-school/academic/SchoolManagementAcademic";
import SchoolDetailSchedule from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolDetailSchedule";
import SchoolAllInvoices from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolAllInvoices";
import SchoolBill from "@/pages/pendidikanku-dashboard/dashboard-school/finance/SchoolBill";
import SchoolTryoutTahfizhExam from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolTryoutTahfizhExam";
import SchoolAllAnnouncement from "@/pages/pendidikanku-dashboard/dashboard-school/dashboard/SchoolAllAnnouncement";
import SchoolClasses from "@/pages/pendidikanku-dashboard/dashboard-school/class/SchoolClass";
import SchoolManageClass from "@/pages/pendidikanku-dashboard/dashboard-school/class/detail/SchoolDetailClass";
import SchoolQuizPage from "@/pages/pendidikanku-dashboard/dashboard-school/class/components/CSchoolQuizPage";
import SchoolQuizDetailPage from "@/pages/pendidikanku-dashboard/dashboard-school/class/components/CSchoolQuizDetailPage";
import SchoolAttendance from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/attendance-(pending)/SchoolAttendance";
import SchoolAnnouncement from "@/pages/pendidikanku-dashboard/dashboard-school/coming-soon/announcement-(pending)/SchoolAnnouncement";
import SchoolBooks from "@/pages/pendidikanku-dashboard/dashboard-school/books/SchoolBooks";
import SchoolDetailBook from "@/pages/pendidikanku-dashboard/dashboard-school/books/detail/SchoolDetailBook";

// Menu Utama
import SchoolMenuGrids from "@/pages/pendidikanku-dashboard/dashboard-school/menu/SchoolMenuGrids";
import SchoolRoom from "@/pages/pendidikanku-dashboard/dashboard-school/academic/rooms/SchoolRoom";
import SchoolDetailRoom from "@/pages/pendidikanku-dashboard/dashboard-school/academic/rooms/SchoolDetailRoom";
import SchoolSpp from "@/pages/pendidikanku-dashboard/dashboard-school/finance/spp/SchoolSpp";
import SchoolSubject from "@/pages/pendidikanku-dashboard/dashboard-school/subject/SchoolSubject";
import SchoolCertificate from "@/pages/pendidikanku-dashboard/dashboard-school/academic/certificate/SchoolCertificate";
import SchoolDetailCertificate from "@/pages/pendidikanku-dashboard/dashboard-school/academic/certificate/components/CSchoolDetailCertificate";
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
    <Route path="jadwal" element={<SchoolAllSchedule />} />
    {/*^ Belum diimplementasikan  */}
    <Route path="jadwal/detail/:scheduleId" element={<SchoolDetailSchedule />} />

    {/* === Profil Sekolah === */}
    <Route path="profil-sekolah" element={<SchoolProfile />} />

    {/* === Keuangan === */}
    <Route path="keuangan" element={<SchoolFinance />} />

    {/* Halaman belum bisa */}
    <Route path="keuangan/detail/:id" element={<SchoolDetailTeacher />} />

    {/* === Guru === */}
    <Route path="guru">
      <Route index element={<SchoolTeacher />} />
      <Route path=":id" element={<SchoolDetailTeacher />} />
    </Route>

    {/* === Akademik === */}
    <Route path="akademik">
      <Route index element={<SchoolAcademic />} />
      <Route path="detail" element={<DetailAcademic />} />
      <Route path="kelola" element={<SchoolManagementAcademic />} />
    </Route>

    {/* === Tagihan & Invoice === */}
    <Route path="tagihan">
      <Route index element={<SchoolAllInvoices />} />
      <Route path=":id" element={<SchoolBill />} />
    </Route>

    {/* === Lainnya === */}
    <Route path="tryout-tahfizh-exam" element={<SchoolTryoutTahfizhExam />} />
    <Route path="all-announcement" element={<SchoolAllAnnouncement />} />
    <Route path="kelas">
      <Route index element={<SchoolClasses />} />
      <Route path="detail/:id" element={<SchoolManageClass />} />
      <Route path="quiz/:id" element={<SchoolQuizPage />} />
      <Route path="quiz/:id/do" element={<SchoolQuizDetailPage />} />
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
      <Route path="keuangan/detail/:id" element={<SchoolDetailBill />} />
      <Route path="guru" element={<SchoolTeacher showBack />} />
      {/* <Route path="all-announcement" element={<AllAnnouncement />} /> */}
      <Route path="sekolah" element={<SchoolDashboard showBack />} />
      <Route path="ruangan" element={<SchoolRoom showBack />} />
      <Route path="ruangan/:id" element={<SchoolDetailRoom />} />
      <Route path="spp" element={<SchoolSpp />} />
      <Route path="pelajaran" element={<SchoolSubject />} />
      <Route path="sertifikat" element={<SchoolCertificate />} />
      <Route path="kalender" element={<CalenderAcademic />} />
      {/* <Route path="statistik" element={<SchoolStatistik />} /> */}
      <Route path="pengaturan" element={<SchoolSettings />} />
      <Route path="kelas-aktif" element={<SchoolActiveClass />} />
      <Route
        path="sertifikat/detail/:classId/:studentId"
        element={<SchoolDetailCertificate />}
      />
      <Route path="murid" element={<SchoolStudent showBack />} />
      <Route path="buku">
        <Route index element={<SchoolBooks showBack />} />
        <Route path="detail/:id" element={<SchoolDetailBook />} />
      </Route>
      <Route path="kelas">
        <Route index element={<SchoolClasses showBack />} />
        <Route path="kelola" element={<SchoolManageClass />} />
      </Route>
      <Route path="academic">
        <Route index element={<SchoolAcademic showBack />} />
        <Route path="detail" element={<DetailAcademic />} />
        <Route path="kelola" element={<SchoolManagementAcademic />} />
      </Route>
    </Route>
  </Route>
);
