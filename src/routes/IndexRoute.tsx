import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Halaman Auth
import Login from "@/pages/dashboard/auth/Login";
// import Register from "@/pages/dashboard/auth/Register";

// Not Found
import NotFound from "@/pages/NotFound";

// Auth Route Guard
import RequireRoleRoute from "./RequireRoleRoute";
import AuthorLayout from "@/layout/AuthorLayout";
import TeacherLayout from "@/layout/TeacherLayout";
import TreasurerLayout from "@/layout/TreasurerLayout";
import AdminLayout from "@/layout/AdminLayout";
import AdminHome from "@/pages/dashboard/admin/home/AdminHome";
import MasjidLinkTree from "@/pages/linktree/MasjidLinkTreeHome";
import MasjidDonationMasjid from "@/pages/linktree/finansial/donation/MasjidDonation";
import MasjidLayout from "@/pages/linktree/MasjidLayout";
import MasjidDonationConfirmDonation from "@/pages/linktree/finansial/donation/MasjidDonationConfirmFinansial";
import MasjidProfile from "@/pages/linktree/profil/MasjidProfil";
import MasjidDKMPengajarProfil from "@/pages/linktree/profil/MasjidDKMPengajarProfil";
import MasjidDetailSpeech from "@/pages/linktree/profil/MasjidDetailSpeechProfil";
import MasjidProfileDetail from "@/pages/linktree/profil/MasjidDetailProfil";
import MasjidScheduleLecture from "@/pages/linktree/lecture/schedule/MasjidScheduleLectureSessions";
import MasjidReportFinansial from "@/pages/linktree/finansial/report/MasjidReportFinansial";
import MasjidDetailLecture from "@/pages/linktree/lecture/schedule/MasjidDetailScheduleLectureSessions";
import MasjidDonationMotivation from "@/pages/linktree/finansial/donation/MasjidDonationMotivation";
import MasjidLectureMaterial from "@/pages/linktree/lecture/material/lecture/main/MasjidLecture";
import MasjidDetailLectureMaterial from "@/pages/linktree/lecture/schedule/MasjidDetailScheduleLectureSessions";
import MasjidInformationLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/main/MasjidInformationLectureSessions";
import MasjidQuizLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/quizzes/MasjidQuizLectureSessions";
import MasjidFullTranscriptLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/materials/MasjidFullTranscriptLectureSessions";
import MasjidSummaryLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/materials/MasjidSummaryLectureSessions";
import MasjidDocsLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/assets/MasjidDocsLectureSessions";
import MasjidResultQuizLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/quizzes/MasjidResultQuizLectureSessions";
import MasjidVideoAudioLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/assets/MasjidVideoAudioLectureSessions";
import MasjidMaterial from "@/pages/linktree/lecture/material/MasjidMaterial";
import MasjidCertificateLecture from "@/pages/linktree/lecture/certificate/MasjidCertificate";
import MasjidDocsLecture from "@/pages/linktree/lecture/material/lecture/assets/MasjidDocsLecture";
import MasjidVideoAudioLecture from "@/pages/linktree/lecture/material/lecture/assets/MasjidVideoAudioLecture";
import MasjidQuizLecture from "@/pages/linktree/lecture/material/lecture/quizzes/MasjidQuizLecture";
import MasjidFullTransciptLecture from "@/pages/linktree/lecture/material/lecture/materials/MasjidFullTransciptLecture";
import MasjidSummaryLecture from "@/pages/linktree/lecture/material/lecture/materials/MasjidSummaryLecture";
import MasjidLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/main/MasjidLectureSessions";
import MasjidExamLecture from "@/pages/linktree/lecture/material/lecture/exams/MasjidExamLecture";
import MasjidResultExamLecture from "@/pages/linktree/lecture/material/lecture/exams/MasjidResultExamLecture";
import MasjidMyProfile from "@/pages/linktree/activity/setting/MasjidMyProfile";
import MasjidMyActivity from "@/pages/linktree/activity/my-activity/MasjidMyActivity";
import MasjidPost from "@/pages/linktree/post/main/MasjidPost";
import MasjidDetailDonation from "@/pages/linktree/post/main/MasjidDetailMotivation";
import MasjidSettingLayout from "@/layout/masjid/MasjidSettingLayout";
import MasjidAppereance from "@/pages/linktree/activity/setting/MasjidAppereance";
import MasjidSupportUs from "@/pages/linktree/activity/setting/MasjidSupportUs";
import MasjidPartnership from "@/pages/linktree/activity/setting/MasjidPartnership";
import MasjidFaq from "@/pages/linktree/activity/setting/MasjidFaq";
import MasjidSettingMenu from "@/layout/masjid/MasjidSettingMenu";
import MasjidMyDonation from "@/pages/linktree/finansial/report/MasjidMyDonation";

import MasjidMyStats from "@/pages/linktree/activity/my-activity/MasjidMyStats";
import MasjidInformationLecture from "@/pages/linktree/lecture/material/lecture/main/MasjidInformationLecture";
import MasjidSholat from "@/pages/linktree/home/sholat/MasjidSholat";
import MasjidAllMyLecture from "@/pages/linktree/activity/my-activity/MasjidAllMyLecture";
import MasjidMyNotesLectureSessions from "@/pages/linktree/lecture/material/lecture-sessions/arsip/MasjidMyNotesLectureSessions";
import MasjidkuHome from "@/pages/masjidku/MasjidkuHome";
import MasjidMaterialByMonth from "@/pages/linktree/lecture/material/lecture-sessions-by-month/MasjidLectureSessionsByMonth";
import MasjidDetailSummaryLecture from "@/pages/linktree/lecture/material/lecture/materials/MasjidDetailSummaryLecture";
import MasjidDetailDKMPengajarMobile from "@/pages/linktree/profil/MasjidDetailDKMPengajarProfilMobile";
import MasjidkuLayout from "@/layout/MasjidkuLayout";
import MasjidkuFinancial from "@/pages/masjidku/financial/MasjidkuFinacial";
import MasjidkuListMasjid from "@/pages/masjidku/masjid/MasjidkuListMasjid";
import MasjidkuProfil from "@/pages/masjidku/profil/MasjidkuProfil";
import MasjidkuProgram from "@/pages/masjidku/program/MasjidkuProgram";


// School Routes
import { financeRoutes } from "@/pages/masjidku/financial/routes";
import MasjidkuWebHome from "@/pages/masjidku/website/MasjidkuWebHome";
import RegisterAdminMasjid from "@/pages/dashboard/auth/register/RegisterAdminMasjid";
import RegisterUser from "@/pages/dashboard/auth/register/RegisterUser";
import SupportPage from "@/pages/masjidku/website/pages/navbar-page/support";
import Panduan from "@/pages/masjidku/website/pages/navbar-page/panduan";
import Fitur from "@/pages/masjidku/website/pages/navbar-page/fitur";
import About from "@/pages/masjidku/website/pages/navbar-page/about";
import Contact from "@/pages/masjidku/website/pages/navbar-page/contact";
import Unauthorized from "./UnAuthorized";
import ProtectedRoute from "./ProtectedRoutes";
import { TeacherRoutes } from "./TeacherRoutes";
import { StudentRoutes } from "./StudentRoutes";
import { SchoolRoutes } from "./SchoolRoutes";

// import { schoolRoutes } from "@/pages/sekolahislamku/dashboard-school/routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* === Public Routes Masjidku === */}
      <Route element={<MasjidkuLayout />}>
        <Route index element={<MasjidkuHome />} />
        <Route path="finansial" element={<MasjidkuFinancial />} />
        <Route path="masjid" element={<MasjidkuListMasjid />} />
        <Route path="profil" element={<MasjidkuProfil />} />
        <Route path="website" element={<MasjidkuWebHome />} />
        <Route path="website/dukungan" element={<SupportPage />} />
        <Route path="website/panduan" element={<Panduan />} />
        <Route path="website/fitur" element={<Fitur />} />
        <Route path="website/about" element={<About />} />
        <Route path="website/hubungi-kami" element={<Contact />} />
        <Route path="program" element={<MasjidkuProgram />} />
        {financeRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path.replace("/masjidku/", "")} // Hapus prefix karena sudah di dalam MasjidkuLayout
            element={route.element}
          />
        ))}
      </Route>
      {/* ==== Public Routes ==== */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/website/daftar-sekarang"
        element={<RegisterAdminMasjid />}
      />
      {/* <Route
        path="/register-detail-sekolah"
        element={<RegisterDetailAdminMasjid />}
      /> */}
      <Route path="/register-user" element={<RegisterUser />} />
      {/* 1. Tanpa layout untuk LinkTree */}
      <Route path="masjid/:slug" index element={<MasjidLinkTree />} />
      {/* 2. Dengan layout untuk halaman lainnya */}
      <Route path="/" element={<MasjidLayout />}>
        <Route path="masjid/:slug">
          {/* ==== Public Routes ==== */}
          <Route path="login" element={<Login />} />
          <Route path="register-masjid" element={<RegisterAdminMasjid />} />
          {/* Profil Masjid */}
          <Route path="profil">
            <Route index element={<MasjidProfile />} />
            <Route path="dkm-pengajar" element={<MasjidDKMPengajarProfil />} />
            <Route path="sambutan" element={<MasjidDetailSpeech />} />
            {/* Group DKM & Pengajar */}
            <Route path="dkm-pengajar">
              <Route index element={<MasjidDKMPengajarProfil />} />
              <Route
                path="detail/:id"
                element={<MasjidDetailDKMPengajarMobile />}
              />
            </Route>
            <Route path="detail" element={<MasjidProfileDetail />} />
          </Route>
          {/* Home  */}
          <Route path="sholat" element={<MasjidSholat />} />
          {/* Donasi */}
          <Route path="donasi" element={<MasjidDonationMasjid />} />
          <Route
            path="donasi/konfirmasi"
            element={<MasjidDonationConfirmDonation />}
          />
          <Route path="donasi/pesan" element={<MasjidDonationMotivation />} />
          {/* Laporan Keuangan */}
          {/* <Route path="keuangan" element={<MasjidReportFinansial />} /> */}
          {/* Jadwal Kajian dan Detail */}
          <Route path="jadwal-kajian" element={<MasjidScheduleLecture />} />
          <Route path="jadwal-kajian/:id" element={<MasjidDetailLecture />} />
          {/* Soal & Materi Kajian */}
          <Route path="soal-materi" element={<MasjidMaterial />} />
          <Route
            path="soal-materi/:lecture_session_slug"
            element={<MasjidLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/informasi"
            element={<MasjidInformationLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/latihan-soal"
            element={<MasjidQuizLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/latihan-soal/hasil"
            element={<MasjidResultQuizLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/video-audio"
            element={<MasjidVideoAudioLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/materi-lengkap"
            element={<MasjidFullTranscriptLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/ringkasan"
            element={<MasjidSummaryLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/catatanku"
            element={<MasjidMyNotesLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/dokumen"
            element={<MasjidDocsLectureSessions />}
          />
          {/* Materi per Bulan */}
          <Route
            path="materi-bulan/:month"
            element={<MasjidMaterialByMonth />}
          />
          {/* Tema */}
          <Route
            path="tema/:lecture_slug"
            element={<MasjidLectureMaterial />}
          />
          <Route
            path="tema/:lecture_slug/informasi"
            element={<MasjidInformationLecture />}
          />
          <Route
            path="tema/:lecture_slug/certificate/:user_exam_id"
            element={<MasjidCertificateLecture />}
          />
          <Route
            path="tema/:lecture_slug/dokumen"
            element={<MasjidDocsLecture />}
          />
          <Route
            path="tema/:lecture_slug/video-audio"
            element={<MasjidVideoAudioLecture />}
          />
          <Route
            path="tema/:lecture_slug/ujian"
            element={<MasjidExamLecture />}
          />
          <Route
            path="tema/:lecture_slug/ujian/hasil"
            element={<MasjidResultExamLecture />}
          />
          <Route
            path="tema/:lecture_slug/latihan-soal"
            element={<MasjidQuizLecture />}
          />
          <Route
            path="tema/:lecture_slug/materi-lengkap"
            element={<MasjidFullTransciptLecture />}
          />
          <Route
            path="tema/:lecture_slug/ringkasan"
            element={<MasjidSummaryLecture />}
          />
          <Route
            path="tema/:lecture_slug/ringkasan/detail"
            element={<MasjidDetailSummaryLecture />}
          />{" "}
          {/* detail */}
          <Route path="post" element={<MasjidPost />} />
          {/* <Route path="post/:postId" element={<MasjidDetailPost />} /> */}
          <Route path="motivation/:id" element={<MasjidDetailDonation />} />
          {/* Activity  */}
          <Route path="aktivitas" element={<MasjidMyActivity />} />
          {/* Menu Activity  */}
          <Route
            path="aktivitas/kajian-saya"
            element={<MasjidAllMyLecture />}
          />
          <Route path="aktivitas/donasi-saya" element={<MasjidMyDonation />} />
          <Route path="aktivitas/statistik-saya" element={<MasjidMyStats />} />
          {/* Nested setting layout */}
          <Route path="aktivitas/pengaturan" element={<MasjidSettingLayout />}>
            <Route path="menu" element={<MasjidSettingMenu />} />
            <Route path="profil-saya" element={<MasjidMyProfile />} />
            <Route path="tampilan" element={<MasjidAppereance />} />
            <Route path="dukung-kami" element={<MasjidSupportUs />} />
            <Route path="kerjasama" element={<MasjidPartnership />} />
            <Route path="tanya-jawab" element={<MasjidFaq />} />
          </Route>
        </Route>
      </Route>

      {/* ==== Protected Routes - Teacher ==== */}
      {/* <Route element={<RequireRoleRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherHome />} />
        </Route>
      </Route> */}

      {/* ==== Protected Routes - Teacher ==== */}
      <Route element={<RequireRoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
      </Route>

      {/* === 🔒 Protected Dashboard Routes === */}
      <Route element={<ProtectedRoute />}>
        {TeacherRoutes}
        {StudentRoutes}
        {SchoolRoutes}
      </Route>

      {/* ==== 404 ==== */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
