import { Route, Navigate } from "react-router-dom";
import StudentLayout from "@/layout/StudentLayout";
import TeacherDashboard from "@/pages/pendidikanku-dashboard/dashboard-teacher/TeacherDashboard";
import TeacherAttendance from "@/pages/pendidikanku-dashboard/dashboard-teacher/attendance/TeacherAttendance";
import AttendanceDetail from "@/pages/pendidikanku-dashboard/dashboard-teacher/attendance/components/AttendanceDetail";
import TeacherProfil from "@/pages/pendidikanku-dashboard/dashboard-teacher/profil/TeacherProfil";
import TeacherGrading from "@/pages/pendidikanku-dashboard/dashboard-teacher/grade/TeacherGrade";
import DetailGrading from "@/pages/pendidikanku-dashboard/dashboard-teacher/grade/components/TeacherDetailGrading";
import TeacherAnnouncements from "@/pages/pendidikanku-dashboard/dashboard-teacher/announcement/TeacherAnnouncement";
import DetailClassQuiz from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailClassQuiz";
import TeacherSchedule from "@/pages/pendidikanku-dashboard/dashboard-teacher/schedule/TeacherSchedule";
import AllAssignment from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherAllAssignment";
import DetailStudent from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailStudent";
import TaskScore from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherTaskScore";
import AttendanceManagement from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherAttendanceManagement";
import HomeroomTeacher from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherHomeroomTeacher";
import AllAnnouncementTeacher from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherAllAnnouncement";
import DetailAnnouncementTeacher from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherDetailAnnouncement";
import ManagementClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/dashboard/TeacherManagementClass";
import ScheduleThreeDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherScheduleThreeDays";
import DetailScheduleThreeDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailScheduleThreeDays";
import ScheduleSevenDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherScheduleSevenDays";
import DetailScheduleSevenDays from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailScheduleSevenDays";
import TeacherClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/TeacherClass";
import DetailClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailClass";
import ClassAttandence from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherClassAttandence";
import DetailMateri from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailMateri";
import ClassMateri from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherClassMateri";
import AssignmentClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherAssignmentClass";
import DetailAssignmentClass from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherDetailAssignmentClass";
import StudentScore from "@/pages/pendidikanku-dashboard/dashboard-teacher/class/components/TeacherStudentScore";
import TeacherMenuGrids from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/TeacherMenuGrids";
import AllClasses from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/TeacherAllClasses";
import ClassDetail from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/TeacherDetailClasses";
import TeacherSettings from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/settings/TeacherSettings";
import TeacherAssignment from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/assignments/TeacherAssignment";
import TeacherCertificate from "@/pages/pendidikanku-dashboard/dashboard-teacher/menu/certificate/TeacherCertificate";

export const TeacherRoutes = (
  <Route path="/:id/guru" element={<StudentLayout />}>
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
