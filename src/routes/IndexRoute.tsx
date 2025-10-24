import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Halaman Auth
import Login from "@/pages/sekolahislamku/auth/Login";
// import Register from "@/pages/dashboard/auth/Register";

// Not Found
import NotFound from "@/pages/NotFound";

// Auth Route Guard
import MasjidLinkTree from "@/pages/linktree/MasjidLinkTreeHome";
import MasjidDonationMasjid from "@/pages/linktree/finansial/donation/MasjidDonation";
import MasjidLayout from "@/pages/linktree/MasjidLayout";
import MasjidDonationConfirmDonation from "@/pages/linktree/finansial/donation/MasjidDonationConfirmFinansial";
import MasjidProfile from "@/pages/linktree/profil/MasjidProfil";
import MasjidDKMPengajarProfil from "@/pages/linktree/profil/MasjidDKMPengajarProfil";
import MasjidDetailSpeech from "@/pages/linktree/profil/MasjidDetailSpeechProfil";
import MasjidProfileDetail from "@/pages/linktree/profil/MasjidDetailProfil";
import MasjidDonationMotivation from "@/pages/linktree/finansial/donation/MasjidDonationMotivation";

import MasjidQuizLectureSessions from "@/pages/sekolahislamku/quizzes/MasjidQuizLectureSessions";


import MasjidResultQuizLectureSessions from "@/pages/sekolahislamku/quizzes/MasjidResultQuizLectureSessions";

import MasjidMyDonation from "@/pages/linktree/finansial/report/MasjidMyDonation";

import MasjidSholat from "@/pages/linktree/home/sholat/MasjidSholat";

import MasjidkuHome from "@/pages/masjidku/MasjidkuHome";

import MasjidDetailDKMPengajarMobile from "@/pages/linktree/profil/MasjidDetailDKMPengajarProfilMobile";
import MasjidkuLayout from "@/layout/MasjidkuLayout";

// School Routes
import MasjidkuWebHome from "@/pages/masjidku/website/MasjidkuWebHome";
import RegisterAdminMasjid from "@/pages/sekolahislamku/auth/register/RegisterAdminMasjid";
import RegisterUser from "@/pages/sekolahislamku/auth/register/RegisterUser";
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* === Public Routes Masjidku === */}
      <Route element={<MasjidkuLayout />}>
        <Route index element={<MasjidkuHome />} />

        <Route path="website" element={<MasjidkuWebHome />} />
        <Route path="website/dukungan" element={<SupportPage />} />
        <Route path="website/panduan" element={<Panduan />} />
        <Route path="website/fitur" element={<Fitur />} />
        <Route path="website/about" element={<About />} />
        <Route path="website/hubungi-kami" element={<Contact />} />
      </Route>
      {/* ==== Public Routes ==== */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/website/daftar-sekarang"
        element={<RegisterAdminMasjid />}
      />
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

          <Route
            path="soal-materi/:lecture_session_slug/latihan-soal"
            element={<MasjidQuizLectureSessions />}
          />
          <Route
            path="soal-materi/:lecture_session_slug/latihan-soal/hasil"
            element={<MasjidResultQuizLectureSessions />}
          />
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
