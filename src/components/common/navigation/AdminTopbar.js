import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, Moon, Sun } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlThema from "@/hooks/useHTMLThema";
import UserDropdown from "./AdminDropDownTopbar";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
export default function AdminTopbar({ onMenuClick, title }) {
    const { isDark, toggleDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    const { data: user, isLoading } = useCurrentUser();
    const isLoggedIn = !!user;
    return (_jsxs("header", { className: "flex items-center justify-between px-6 py-4 shadow md:ml-0", style: {
            backgroundColor: theme.white1,
            color: theme.black1,
            borderBottom: `1px solid ${theme.white3}`,
        }, children: [_jsx("div", { className: "md:hidden", children: _jsx("button", { onClick: onMenuClick, className: "p-2 rounded-md transition hover:opacity-85", style: {
                        border: `1px solid ${theme.white3}`,
                        backgroundColor: theme.white2,
                    }, "aria-label": "Open sidebar menu", children: _jsx(Menu, { className: "w-5 h-5" }) }) }), _jsx("div", { className: "hidden md:block", children: title ? (_jsx("h1", { className: "text-sm md:text-base font-semibold", style: { color: theme.black1 }, children: title })) : (_jsx("span", { className: "sr-only", children: "Admin Topbar" })) }), _jsx("div", { className: "flex-1" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: toggleDark, className: "p-2 rounded-full transition", style: {
                            border: `1px solid ${theme.white3}`,
                            backgroundColor: isDark ? theme.white2 : "transparent",
                        }, "aria-label": "Toggle dark mode", title: isDark ? "Switch to light mode" : "Switch to dark mode", children: isDark ? _jsx(Sun, { className: "w-5 h-5" }) : _jsx(Moon, { className: "w-5 h-5" }) }), isLoading ? null : isLoggedIn ? (_jsx(UserDropdown, {})) : (_jsx(Link, { to: "/login", className: "text-sm font-medium hover:underline", style: { color: theme.primary }, children: "Login" }))] })] }));
}
