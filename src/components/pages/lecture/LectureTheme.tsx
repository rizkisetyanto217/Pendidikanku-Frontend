// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { pickTheme, ThemeName } from "@/constants/thema";
// import useHtmlDarkMode from "@/hooks/useHTMLThema";

// interface LectureThemeCardProps {
//   slug: string;
//   lecture_slug: string;
//   lecture_title: string;
//   total_lecture_sessions: number;
// }

// export default function LectureThemeCard({
//   slug,
//   lecture_slug,
//   lecture_title,
//   total_lecture_sessions,
// }: LectureThemeCardProps) {
//   const { isDark, themeName } = useHtmlDarkMode();
//   const theme = pickTheme(themeName as ThemeName, isDark);
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() =>
//         navigate(`/masjid/${slug}/tema/${lecture_slug}`, {
//           state: {
//             from: { slug, tab: "tema" },
//           },
//         })
//       }
//       className="p-4 rounded-lg cursor-pointer hover:opacity-90"
//       style={{
//         backgroundColor: theme.white1,
//         border: `1px solid ${theme.silver1}`,
//       }}
//     >
//       <h3 className="text-base font-medium">{lecture_title}</h3>
//       <p className="text-sm" style={{ color: theme.silver2 }}>
//         Total {total_lecture_sessions} kajian
//       </p>
//     </div>
//   );
// }
