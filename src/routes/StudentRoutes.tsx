import { Route } from "react-router-dom";
import StudentLayout from "@/layout/StudentLayout";
import StudentDashboard from "@/pages/sekolahislamku/dashboard-student/StudentDashboard";
import StudentProgressDetail from "@/pages/sekolahislamku/dashboard-student/progress/StudentProgress";
import AllScheduleStudent from "@/pages/sekolahislamku/dashboard-student/dashboard/AllScheduleStudent";
import StudentProfil from "@/pages/sekolahislamku/dashboard-student/profil/StudentProfil";
import StudentAssignmentClass from "@/pages/sekolahislamku/dashboard-student/assignment/StudentAssignmentClass";
import DetailScheduleStudent from "@/pages/sekolahislamku/dashboard-student/dashboard/DetailScheduleStudent";
import AnnouncementsStudent from "@/pages/sekolahislamku/dashboard-student/dashboard/AnnouncementsStudent";
import DetailAnnouncementStudent from "@/pages/sekolahislamku/dashboard-student/dashboard/DetailAnnouncementStudent";
import InvoiceTagihan from "@/pages/sekolahislamku/dashboard-student/dashboard/InvoiceTagihan";
import StudentRaport from "@/pages/sekolahislamku/dashboard-student/progress/raport/StudentRaport";
import StudentDetail from "@/pages/sekolahislamku/dashboard-student/dashboard/StudentDetail";
import StudentFInance from "@/pages/sekolahislamku/dashboard-student/finance/StudentFinance";
import StudentSchedule from "@/pages/sekolahislamku/dashboard-student/schedule/StudentSchedule";
import ListFinance from "@/pages/sekolahislamku/dashboard-student/dashboard/ListFinnance";
import StudentAnnouncement from "@/pages/sekolahislamku/dashboard-student/announcement/StudentAnnouncement";
import StudentDetailAnnouncement from "@/pages/sekolahislamku/dashboard-student/announcement/StudentDetailAnnouncement";
import StudentAbsence from "@/pages/sekolahislamku/dashboard-student/progress/absence/StudentAbsence";
import StudentNotesSummary from "@/pages/sekolahislamku/dashboard-student/progress/notes-summary/StudentNotesSummary";
import StudentMenuGrids from "@/pages/sekolahislamku/dashboard-student/menu-utama/StudentMenuGrids";
import MyClass from "@/pages/sekolahislamku/dashboard-student/class/MyClass";
import StudentMateri from "@/pages/sekolahislamku/dashboard-student/class/StudentMateri";
import StudentAssignment from "@/pages/sekolahislamku/dashboard-student/class/StudentAssignment";
import StudentQuizPage from "@/pages/sekolahislamku/dashboard-student/class/QuizPage";
import StudentAttandenceClass from "@/pages/sekolahislamku/dashboard-student/class/StudentAttandenceClass";
import StudentExam from "@/pages/sekolahislamku/dashboard-student/class/StudentExam";
import StudentCertificate from "@/pages/sekolahislamku/dashboard-student/certificate/StudentCertificate";

export const StudentRoutes = (
  <Route path="masjid/:id/murid" element={<StudentLayout />}>
    <Route index element={<StudentDashboard />} />
    <Route path="progress" element={<StudentProgressDetail />} />
    <Route path="all-schedule" element={<AllScheduleStudent />} />
    <Route path="profil-murid" element={<StudentProfil />} />
    <Route path="tugas" element={<StudentAssignmentClass />} />
    <Route
      path="all-schedule/detail/:scheduleId"
      element={<DetailScheduleStudent />}
    />
    <Route path="announcements" element={<AnnouncementsStudent />} />
    <Route path="announcements/:id" element={<DetailAnnouncementStudent />} />
    <Route path="tagihan/:id" element={<InvoiceTagihan />} />
    <Route path="progress/raport" element={<StudentRaport />} />
    <Route path="detail" element={<StudentDetail />} />
    <Route path="finance" element={<StudentFInance />} />
    <Route path="jadwal" element={<StudentSchedule />} />
    <Route path="finnance-list" element={<ListFinance />} />
    <Route path="finnance-list/:id" element={<InvoiceTagihan />} />
    <Route path="pengumuman">
      <Route index element={<StudentAnnouncement />} />
      <Route path="detail/:id" element={<StudentDetailAnnouncement />} />
    </Route>
    <Route path="progress/absensi" element={<StudentAbsence />} />
    <Route path="progress/catatan-hasil" element={<StudentNotesSummary />} />
    <Route path="menu-utama">
      <Route index element={<StudentMenuGrids />} />
      <Route path="my-class" element={<MyClass />} />
      <Route path="my-class/:id/materi" element={<StudentMateri />} />
      <Route path="my-class/:id/tugas" element={<StudentAssignment />} />
      <Route path="my-class/:id/quiz" element={<StudentQuizPage />} />
      <Route
        path="my-class/:id/kehadiran"
        element={<StudentAttandenceClass />}
      />
      <Route path="my-class/:id/ujian" element={<StudentExam />} />
      <Route path="profil-murid" element={<StudentProfil />} />
      <Route path="sertifikat-murid" element={<StudentCertificate />} />
    </Route>
  </Route>
);
