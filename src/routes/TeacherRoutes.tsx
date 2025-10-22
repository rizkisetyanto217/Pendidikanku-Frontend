import { Route, Navigate } from "react-router-dom";
import StudentLayout from "@/layout/StudentLayout";
import TeacherDashboard from "@/pages/sekolahislamku/dashboard-teacher/TeacherDashboard";
import TeacherAttendance from "@/pages/sekolahislamku/dashboard-teacher/attendance/TeacherAttendance";
import AttendanceDetail from "@/pages/sekolahislamku/dashboard-teacher/attendance/components/AttendanceDetail";
import TeacherProfil from "@/pages/sekolahislamku/dashboard-teacher/profil/TeacherProfil";
import TeacherGrading from "@/pages/sekolahislamku/dashboard-teacher/grade/TeacherGrade";
import DetailGrading from "@/pages/sekolahislamku/dashboard-teacher/grade/components/DetailGrading";
import TeacherAnnouncements from "@/pages/sekolahislamku/dashboard-teacher/announcement/TeacherAnnouncement";
import DetailClassQuiz from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailClassQuiz";
import TeacherSchedule from "@/pages/sekolahislamku/dashboard-teacher/schedule/TeacherSchedule";
import AllAssignment from "@/pages/sekolahislamku/dashboard-teacher/class/components/AllAssignment";
import DetailStudent from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailStudent";
import TaskScore from "@/pages/sekolahislamku/dashboard-teacher/class/components/TaskScore";
import AttendanceManagement from "@/pages/sekolahislamku/dashboard-teacher/class/components/AttendanceManagement";
import HomeroomTeacher from "@/pages/sekolahislamku/dashboard-teacher/class/components/HomeroomTeacher";
import AllAnnouncementTeacher from "@/pages/sekolahislamku/dashboard-teacher/dashboard/AllAnnouncementTeacher";
import DetailAnnouncementTeacher from "@/pages/sekolahislamku/dashboard-teacher/dashboard/DetailAnnouncementTeacher";
import ManagementClass from "@/pages/sekolahislamku/dashboard-teacher/dashboard/ManagementClass";
import ScheduleThreeDays from "@/pages/sekolahislamku/dashboard-teacher/class/components/ScheduleThreeDays";
import DetailScheduleThreeDays from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailScheduleThreeDays";
import ScheduleSevenDays from "@/pages/sekolahislamku/dashboard-teacher/class/components/ScheduleSevenDays";
import DetailScheduleSevenDays from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailScheduleSevenDays";
import TeacherClass from "@/pages/sekolahislamku/dashboard-teacher/class/TeacherClass";
import DetailClass from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailClass";
import ClassAttandence from "@/pages/sekolahislamku/dashboard-teacher/class/components/ClassAttandence";
import DetailMateri from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailMateri";
import ClassMateri from "@/pages/sekolahislamku/dashboard-teacher/class/components/ClassMateri";
import AssignmentClass from "@/pages/sekolahislamku/dashboard-teacher/class/components/AssignmentClass";
import DetailAssignmentClass from "@/pages/sekolahislamku/dashboard-teacher/class/components/DetailAssignmentClass";
import StudentScore from "@/pages/sekolahislamku/dashboard-teacher/class/components/StudentScore";
import TeacherMenuGrids from "@/pages/sekolahislamku/dashboard-teacher/menu-utama/TeacherMenuGrids";
import AllClasses from "@/pages/sekolahislamku/dashboard-teacher/menu-utama/AllClasses";
import ClassDetail from "@/pages/sekolahislamku/dashboard-teacher/menu-utama/DetailClasses";
import TeacherSettings from "@/pages/sekolahislamku/dashboard-teacher/menu-utama/settings/TeacherSettings";
import TeacherAssignment from "@/pages/sekolahislamku/dashboard-teacher/menu-utama/assignments/TeacherAssignment";
import TeacherCertificate from "@/pages/sekolahislamku/dashboard-teacher/menu-utama/certificate/Certificate";

export const TeacherRoutes = (
  <Route path="masjid/:id/guru" element={<StudentLayout />}>
    <Route index element={<TeacherDashboard />} />
    <Route path="kehadiran" element={<TeacherAttendance />} />
    <Route path="kehadiran/:id" element={<AttendanceDetail />} />
    <Route path="profil-guru" element={<TeacherProfil />} />
    <Route path="penilaian" element={<TeacherGrading />} />
    <Route path="penilaian/:id" element={<DetailGrading />} />
    <Route path="pengumuman" element={<TeacherAnnouncements />} />
    <Route path="quizClass/:id" element={<DetailClassQuiz />} />
    <Route path="jadwal" element={<TeacherSchedule />} />
    <Route path="assignments" element={<AllAssignment />} />
    <Route path="assignments/:id" element={<DetailStudent />} />
    <Route path="kelas/:id/score" element={<TaskScore />} />
    <Route path="attendance-management" element={<AttendanceManagement />} />
    <Route path="kelas/homeroom" element={<HomeroomTeacher />} />
    <Route
      path="all-announcement-teacher"
      element={<AllAnnouncementTeacher />}
    />
    <Route
      path="all-announcement-teacher/detail/:id"
      element={<DetailAnnouncementTeacher />}
    />
    <Route path="management-class/:name" element={<ManagementClass />} />
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

    {/* kelas */}
    <Route path="kelas">
      <Route index element={<TeacherClass />} />
      <Route path=":id" element={<DetailClass />} />
      <Route path=":id/absensi" element={<ClassAttandence />} />
      <Route path=":id/material/:materialId" element={<DetailMateri />} />
      <Route path=":id/materi" element={<ClassMateri />} />
      <Route path=":id/tugas" element={<AssignmentClass />} />
      <Route
        path=":id/assignment/:assignmentId"
        element={<DetailAssignmentClass />}
      />
      <Route path=":id/student/:studentId/score" element={<StudentScore />} />
    </Route>

    {/* Menu Utama Guru */}
    <Route path="menu-utama">
      <Route index element={<TeacherMenuGrids />} />
      <Route path="all-classes">
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
