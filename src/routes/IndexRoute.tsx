//src/routes/IndexRoute.tsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import Unauthorized from "./UnAuthorized";
import NotFound from "@/pages/NotFound";

// Layout & Pages
import MasjidkuLayout from "@/layout/MasjidkuLayout";
import MasjidkuHome from "@/pages/pendidikanku-profile/website/MasjidkuHome";
import MasjidkuWebHome from "@/pages/pendidikanku-profile/website/website/MasjidkuWebHome";
import RegisterAdminMasjid from "@/pages/pendidikanku-dashboard/auth/register/RegisterAdminMasjid";
import RegisterUser from "@/pages/pendidikanku-dashboard/auth/register/RegisterUser";
import SupportPage from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/support";
import Panduan from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/panduan";
import Fitur from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/fitur";
import About from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/about";
import Contact from "@/pages/pendidikanku-profile/website/website/pages/navbar-page/contact";

import MasjidLayout from "@/pages/pendidikanku-profile/linktree/MasjidLayout";
import MasjidLinkTree from "@/pages/pendidikanku-profile/linktree/MasjidLinkTreeHome";
import MasjidQuizLectureSessions from "@/pages/pendidikanku-dashboard/quizzes/TeacherMasjidQuizLectureSessions";
import MasjidResultQuizLectureSessions from "@/pages/pendidikanku-dashboard/quizzes/TeacherMasjidResultQuizLectureSessions";

import { TeacherRoutes } from "./TeacherRoutes";
import { StudentRoutes } from "./StudentRoutes";
import { SchoolRoutes } from "./SchoolRoutes";
import Login from "@/pages/pendidikanku-dashboard/auth/Login";
import Forbidden403 from "@/pages/Forbidden403";
import RequireMasjidRoles from "./RequireMasjidRoles";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Public Masjidku --- */}
      <Route element={<MasjidkuLayout />}>
        <Route index element={<MasjidkuHome />} />
        <Route path="website" element={<MasjidkuWebHome />} />
        <Route path="website/dukungan" element={<SupportPage />} />
        <Route path="website/panduan" element={<Panduan />} />
        <Route path="website/fitur" element={<Fitur />} />
        <Route path="website/about" element={<About />} />
        <Route path="website/hubungi-kami" element={<Contact />} />
      </Route>

      {/* --- Public Auth --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route
        path="/website/daftar-sekarang"
        element={<RegisterAdminMasjid />}
      />

      {/* --- LinkTree --- */}
      <Route path="/" element={<MasjidLayout />}>
        <Route path="masjid/:slug" index element={<MasjidLinkTree />} />
        <Route path="masjid/:slug">
          <Route path="login" element={<Login />} />
          <Route path="login/:id" element={<RegisterAdminMasjid />} />
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

      {/* --- Protected (dengan masjidId) --- */}
      {/* Ganti :masjid_id -> :masjidId agar konsisten */}
      <Route path=":masjidId" element={<ProtectedRoute />}>
        {/* ===== Guru cluster: hanya teacher/admin/dkm ===== */}
        <Route
          element={<RequireMasjidRoles allow={["teacher", "admin", "dkm"]} />}
        >
          {TeacherRoutes}
        </Route>

        {/* ===== Murid cluster: student/admin/dkm ===== */}
        <Route
          element={<RequireMasjidRoles allow={["student", "admin", "dkm"]} />}
        >
          {StudentRoutes}
        </Route>

        {/* ===== Sekolah/Manajemen: admin/dkm ===== */}
        <Route element={<RequireMasjidRoles allow={["admin", "dkm"]} />}>
          {SchoolRoutes}
        </Route>
      </Route>

      {/* --- Forbidden harus di atas wildcard --- */}
      <Route path=":masjidId/forbidden" element={<Forbidden403 />} />

      {/* --- 404 & Unauthorized --- */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}