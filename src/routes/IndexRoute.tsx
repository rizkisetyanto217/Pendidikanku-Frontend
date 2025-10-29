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

      {/* === Public Auth === */}
      <Route path="/login" element={<Login />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/website/daftar-sekarang" element={<RegisterAdminMasjid />} />

      {/* === LinkTree Masjid === */}
      <Route path="masjid/:slug" index element={<MasjidLinkTree />} />
      <Route path="/" element={<MasjidLayout />}>
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

      {/* === Protected Routes dengan masjidId === */}
      <Route path=":masjidId" element={<ProtectedRoute />}>
        {TeacherRoutes}
        {StudentRoutes}
        {SchoolRoutes}
      </Route>

      {/* === 404 & Unauthorized === */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>

    
  );
} 
