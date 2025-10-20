import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PublicUserDropdown from "@/components/common/public/UserDropDown";
export default function PageHeaderUser({ title, backTo, actionButton, onBackClick, withPaddingTop = false, // default false
 }) {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsx("div", { className: `sticky top-0 z-30 px-1 pb-2 backdrop-blur-md bg-opacity-80 ${withPaddingTop ? "pt-4" : "pt-1"}`, children: _jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-4", children: [(backTo || onBackClick) && (_jsx("button", { onClick: () => {
                                if (onBackClick)
                                    return onBackClick();
                                if (backTo)
                                    return navigate(backTo);
                            }, className: "p-2 rounded-lg", style: {
                                backgroundColor: theme.white3,
                                color: theme.black1,
                            }, children: _jsx(ArrowLeft, { className: "w-5 h-5" }) })), _jsx("h1", { className: "text-xl font-medium", style: { color: theme.black1 }, children: title })] }), _jsx(PublicUserDropdown, { variant: "icon" })] }) }));
}
