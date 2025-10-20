import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import FormattedDate from "@/constants/formattedDate";
export default function DKMDetailThemaPost() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const data = location.state;
    if (!data) {
        return (_jsx("div", { className: "p-4 text-red-600 font-semibold", children: "Data tema tidak ditemukan." }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Detail Tema Post", backTo: "/dkm/post-tema", actionButton: {
                    label: "Edit",
                    onClick: () => navigate("/dkm/post-tema/tambah-edit", { state: data }),
                } }), _jsxs("div", { className: "p-6 max-w-2xl rounded-lg shadow", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white", children: "Nama Tema" }), _jsx("p", { children: data.post_theme_name })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white", children: "Deskripsi" }), _jsx("p", { children: data.post_theme_description })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-700 dark:text-white", children: "Tanggal Dibuat" }), _jsx("p", { children: _jsx(FormattedDate, { value: data.post_theme_created_at }) })] })] })] }));
}
