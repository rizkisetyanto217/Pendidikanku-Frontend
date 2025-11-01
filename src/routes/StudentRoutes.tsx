import { Route } from "react-router-dom";
import DashboardLayout from "@/layout/CDashboardLayout";
import StudentDashboard from "@/pages/pendidikanku-dashboard/dashboard-student/StudentMainDashboard";
import StudentProgressDetail from "@/pages/pendidikanku-dashboard/dashboard-student/progress/StudentProgress";
import StudentAllSchedule from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentAllSchedule";
import StudentProfil from "@/pages/pendidikanku-dashboard/dashboard-student/profil/StudentProfil";
import StudentAssignmentClass from "@/pages/pendidikanku-dashboard/dashboard-student/assignment/StudentAssignmentClass";
import DetailScheduleStudent from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentDetailSchedule";
import AnnouncementsStudent from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentAnnouncements";
import DetailAnnouncementStudent from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentDetailAnnouncement";
import InvoiceTagihan from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentInvoiceTagihan";
import StudentRaport from "@/pages/pendidikanku-dashboard/dashboard-student/progress/raport/StudentRaport";
import StudentDetail from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentDetail";
import StudentFInance from "@/pages/pendidikanku-dashboard/dashboard-student/finance/StudentFinance";
import StudentSchedule from "@/pages/pendidikanku-dashboard/dashboard-student/schedule/StudentSchedule";
import ListFinance from "@/pages/pendidikanku-dashboard/dashboard-student/dashboard/StudentListFinnance";
import StudentAnnouncement from "@/pages/pendidikanku-dashboard/dashboard-student/announcement/StudentAnnouncement";
import StudentDetailAnnouncement from "@/pages/pendidikanku-dashboard/dashboard-student/announcement/StudentDetailAnnouncement";
import StudentAbsence from "@/pages/pendidikanku-dashboard/dashboard-student/progress/absence/StudentAbsence";
import StudentNotesSummary from "@/pages/pendidikanku-dashboard/dashboard-student/progress/notes-summary/StudentNotesSummary";
import StudentMenuGrids from "@/pages/pendidikanku-dashboard/dashboard-student/menu/StudentMenuGrids";
import MyClass from "@/pages/pendidikanku-dashboard/dashboard-student/class/StudentMyClass";
import StudentMateri from "@/pages/pendidikanku-dashboard/dashboard-student/class/StudentMateri";
import StudentAssignment from "@/pages/pendidikanku-dashboard/dashboard-student/class/StudentAssignment";
import StudentQuizPage from "@/pages/pendidikanku-dashboard/dashboard-student/class/StudentQuizPage";
import StudentAttandenceClass from "@/pages/pendidikanku-dashboard/dashboard-student/class/StudentAttandenceClass";
import StudentExam from "@/pages/pendidikanku-dashboard/dashboard-student/class/StudentExam";
import StudentCertificate from "@/pages/pendidikanku-dashboard/dashboard-student/certificate/StudentCertificate";

// ======================
// Routing untuk halaman MURID (Student Dashboard)
// ======================

export const StudentRoutes = (
  // Route utama: semua path di bawah "/murid"
  <Route path="murid" element={<DashboardLayout />}>
    {/* =====================
        DASHBOARD UTAMA
    ===================== */}
    {/* Halaman utama dashboard murid */}
    <Route index element={<StudentDashboard />} />

    {/* =====================
        PROGRESS AKADEMIK
    ===================== */}
    {/* Detail perkembangan belajar murid */}
    <Route path="progress" element={<StudentProgressDetail />} />
    {/* Halaman raport */}
    <Route path="progress/raport" element={<StudentRaport />} />
    {/* Halaman absensi */}
    <Route path="progress/absensi" element={<StudentAbsence />} />
    {/* Halaman catatan hasil belajar */}
    <Route path="progress/catatan-hasil" element={<StudentNotesSummary />} />

    {/* =====================
        JADWAL & DETAILNYA
    ===================== */}
    {/* Halaman semua jadwal */}
    <Route path="semua-jadwal" element={<StudentAllSchedule />} />
    {/* Detail jadwal tertentu berdasarkan ID */}
    <Route path="semua-jadwal/:id" element={<DetailScheduleStudent />} />
    {/* Jadwal utama (khusus tampilan kelas saya / tab jadwal) */}
    <Route path="jadwal" element={<StudentSchedule />} />

    {/* =====================
        PROFIL & MENU LAINNYA
    ===================== */}
    {/* Profil murid */}
    <Route path="profil-murid" element={<StudentProfil />} />
    {/* Detail umum murid */}
    <Route path="detail" element={<StudentDetail />} />

    {/* =====================
        TUGAS / ASSIGNMENT
    ===================== */}
    {/* Daftar tugas */}
    <Route path="tugas" element={<StudentAssignmentClass />} />

    {/* =====================
        KEUANGAN / TAGIHAN
    ===================== */}
    {/* Halaman keuangan ringkas */}
    <Route path="keuangan" element={<StudentFInance />} />
    {/* Daftar seluruh tagihan */}
    <Route path="keuangan-list" element={<ListFinance />} />
    {/* Detail tagihan berdasarkan ID */}
    <Route path="keuangan-list/:id" element={<InvoiceTagihan />} />
    {/* Tagihan langsung dari route lain */}
    <Route path="tagihan/:id" element={<InvoiceTagihan />} />

    {/* =====================
        MENU UTAMA KELAS SAYA
    ===================== */}
    <Route path="menu-utama">
      {/* Halaman utama menu grid murid */}
      <Route index element={<StudentMenuGrids />} />

      {/* Halaman daftar kelas */}
      <Route path="kelas-saya" element={<MyClass />} />

      {/* Halaman keuangan ringkas */}
      <Route path="keuangan" element={<StudentFInance />} />

      {/* Jadwal utama (khusus tampilan kelas saya / tab jadwal) */}
      <Route path="jadwal" element={<StudentSchedule />} />

      {/* Detail per kelas (dengan dynamic :id) */}
      <Route path="kelas-saya/:id/materi" element={<StudentMateri />} />
      <Route path="kelas-saya/:id/tugas" element={<StudentAssignment />} />
      <Route path="kelas-saya/:id/quiz" element={<StudentQuizPage />} />
      <Route
        path="kelas-saya/:id/kehadiran"
        element={<StudentAttandenceClass />}
      />
      <Route path="kelas-saya/:id/ujian" element={<StudentExam />} />

      {/* Profil murid dari menu utama */}
      <Route path="profil-murid" element={<StudentProfil />} />

      {/* Sertifikat murid (sementara dinonaktifkan)
      <Route path="sertifikat-murid" element={<StudentCertificate />} /> */}
    </Route>

    {/* =====================
        PENGUMUMAN (sementara dinonaktifkan)
    ===================== */}
    {/* <Route path="announcements" element={<AnnouncementsStudent />} />
    <Route path="announcements/:id" element={<DetailAnnouncementStudent />} /> */}
    {/* <Route path="pengumuman">
      <Route index element={<StudentAnnouncement />} />
      <Route path="detail/:id" element={<StudentDetailAnnouncement />} />
    </Route> */}
  </Route>
);
