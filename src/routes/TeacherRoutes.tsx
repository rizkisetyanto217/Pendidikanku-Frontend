// src/routes/TeacherRoutes.tsx
import { Route, Navigate } from "react-router-dom";
import StudentLayout from "@/layout/StudentLayout";

// Dashboard & Profil
import TeacherDashboard from "@/pages/pendidikanku-dashboard/dashboard-teacher/TeacherMainDashboard";
import TeacherProfil from "@/pages/pendidikanku-dashboard/dashboard-teacher/profil/TeacherProfil";

// Attendance
import TeacherAttendance from "@/pages/pendidikanku-dashboard/dashboard-teacher/attendance/TeacherAttendance";
import AttendanceDetail from "@/pages/pendidikanku-dashboard/dashboard-teacher/attendance/components/CAttendanceDetail";

// Grading
import TeacherGrading from "@/pages/pendidikanku-dashboard/dashboard-teacher/grade/TeacherGrade";
import DetailGrading from "@/pages/pendidikanku-dashboard/dashboard-teacher/grade/components/CTeacherDetailGrading";

// Announcement
import TeacherAnnouncements from "@/pages/pendidikanku-dashboard/dashboard-teacher/announcement/TeacherAnnouncement";
import AllAnnouncementTeacher from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherAllAnnouncement";
import DetailAnnouncementTeacher from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherDetailAnnouncement";

// Class & Assignments
import TeacherClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/TeacherClass";
import DetailClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailClass";
import ClassAttandence from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherClassAttandence";
import DetailMateri from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailMateri";
import ClassMateri from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherClassMateri";
import AssignmentClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherAssignmentClass";
import DetailAssignmentClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailAssignmentClass";
import StudentScore from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherStudentScore";
import DetailStudent from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailStudent";
import TaskScore from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherTaskScore";
import AttendanceManagement from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherAttendanceManagement";
import HomeroomTeacher from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherHomeroomTeacher";
import ManagementClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherManagementClass";
import DetailClassQuiz from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailClassQuiz";
import AllAssignment from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherAllAssignment";

// Schedule
import TeacherSchedule from "@/pages/pendidikanku-dashboard/dashboard-teacher/schedule/TeacherSchedule";
import ScheduleThreeDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherScheduleThreeDays";
import DetailScheduleThreeDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailScheduleThreeDays";
import ScheduleSevenDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherScheduleSevenDays";
import DetailScheduleSevenDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/CTeacherDetailScheduleSevenDays";

// Menu utama guru
import TeacherMenuGrids from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/TeacherMenuGrids";
import AllClasses from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/TeacherAllClasses";
import ClassDetail from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/TeacherDetailClasses";
import TeacherSettings from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/settings/TeacherSettings";
import TeacherAssignment from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/assignments/TeacherAssignment";
import TeacherCertificate from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/certificate/TeacherCertificate";

export const TeacherRoutes = (
  <Route path="guru" element={<StudentLayout />}>
    {/* Dashboard */}
    <Route index element={<TeacherDashboard />} />

    {/* Kehadiran */}
    <Route path="kehadiran">
      <Route index element={<TeacherAttendance />} />
      <Route path="detail" element={<AttendanceDetail />} />
    </Route>

    {/* Profil & Penilaian */}
    <Route path="profil-guru" element={<TeacherProfil />} />
    <Route path="penilaian">
      <Route index element={<TeacherGrading />} />
      <Route path="detail" element={<DetailGrading />} />
    </Route>

    {/* Pengumuman */}
    <Route path="pengumuman" element={<TeacherAnnouncements />} />
    <Route path="all-announcement-teacher">
      <Route index element={<AllAnnouncementTeacher />} />
      <Route path="detail" element={<DetailAnnouncementTeacher />} />
    </Route>

    {/* Jadwal */}
    <Route path="jadwal" element={<TeacherSchedule />} />
    <Route path="schedule-3-hari">
      <Route index element={<ScheduleThreeDays />} />
      <Route path=":scheduleId" element={<DetailScheduleThreeDays />} />
    </Route>
    <Route path="schedule-seven-days">
      <Route index element={<ScheduleSevenDays />} />
      <Route path=":scheduleId" element={<DetailScheduleSevenDays />} />
    </Route>
    <Route
      path="schedule-seven-days/*"
      element={<Navigate to="../schedule-seven-days" replace />}
    />

    {/* Kelas */}
    <Route path="kelas">
      <Route index element={<TeacherClass />} />
      <Route path=":id" element={<DetailClass />} />
      <Route path=":id/absensi" element={<ClassAttandence />} />
      <Route path=":id/material/:materialId" element={<DetailMateri />} />
      <Route path=":id/materi" element={<ClassMateri />} />
      <Route path=":id/tugas" element={<AssignmentClass />} />
      <Route path=":id/assignment/:assignmentId" element={<DetailAssignmentClass />} />
      <Route path=":id/student/:studentId/score" element={<StudentScore />} />
    </Route>

    {/* Tugas & Manajemen */}
    <Route path="assignments">
      <Route index element={<AllAssignment />} />
      <Route path="detail" element={<DetailStudent />} />
    </Route>
    <Route path="kelas/detail/score" element={<TaskScore />} />
    <Route path="attendance-management" element={<AttendanceManagement />} />
    <Route path="kelas/homeroom" element={<HomeroomTeacher />} />
    <Route path="management-class/:name" element={<ManagementClass />} />
    <Route path="quizClass/detail" element={<DetailClassQuiz />} />

    {/* Menu Utama Guru */}
    <Route path="menu-utama">
      <Route index element={<TeacherMenuGrids />} />
      <Route path="seluruh-kelas">
        <Route index element={<AllClasses />} />
        <Route path=":id" element={<ClassDetail />} />
      </Route>
      <Route path="jadwal" element={<TeacherSchedule showBack />} />
      <Route path="profil-guru" element={<TeacherProfil />} />
      <Route path="pengaturan" element={<TeacherSettings />} />
      <Route path="tugas" element={<TeacherAssignment />} />
      <Route path="sertifikat" element={<TeacherCertificate />} />
    </Route>
  </Route>
);
