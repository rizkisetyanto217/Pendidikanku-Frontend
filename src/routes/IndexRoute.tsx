import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Halaman Auth
import Login from "@/pages/pendidikanku-dashboard/auth/Login";
// import Register from "@/pages/dashboard/auth/Register";

// Not Found
import NotFound from "@/pages/NotFound";

// Auth Route Guard
import MasjidLinkTree from "@/pages/pendidikanku-profile/linktree/MasjidLinkTreeHome";
import MasjidLayout from "@/pages/pendidikanku-profile/linktree/MasjidLayout";

import MasjidQuizLectureSessions from "@/pages/pendidikanku-dashboard/quizzes/MasjidQuizLectureSessions";

import MasjidResultQuizLectureSessions from "@/pages/pendidikanku-dashboard/quizzes/MasjidResultQuizLectureSessions";

import MasjidkuHome from "@/pages/pendidikanku-profile/website/MasjidkuHome";

import MasjidkuLayout from "@/layout/MasjidkuLayout";

// School Routes
import MasjidkuWebHome from "@/pages/pendidikanku-profile/website/website/MasjidkuWebHome";
import RegisterAdminMasjid from "@/pages/pendidikanku-dashboard/auth/register/RegisterAdminMasjid";
import RegisterUser from "@/pages/pendidikanku-dashboard/auth/register/RegisterUser";
import SupportPage from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/support";
import Panduan from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/panduan";
import Fitur from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/fitur";
import About from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/about";
import Contact from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/contact";
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
