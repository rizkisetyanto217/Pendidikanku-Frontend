import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function PageHeader({ title, backTo, actionButton, onBackClick, }) {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const handleBack = () => {
        if (onBackClick)
            return onBackClick();
        if (backTo)
            return navigate(backTo);
    };
    const handleAction = () => {
        if (actionButton?.onClick)
            return actionButton.onClick();
        if (actionButton?.to)
            return navigate(actionButton.to, { state: actionButton.state });
    };
    return (_jsxs("div", { className: "px-1 pt-1 pb-1 mb-5", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-4", children: [(backTo || onBackClick) && (_jsx("button", { onClick: handleBack, className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600", children: _jsx(ArrowLeft, { className: "w-5 h-5 text-gray-600 dark:text-gray-200" }) })), _jsx("h1", { className: "text-2xl font-medium", children: title })] }), actionButton && (_jsx("button", { onClick: handleAction, className: "py-2 px-4 rounded-lg", style: {
                            backgroundColor: theme.primary,
                            color: theme.white1,
                        }, children: actionButton.label }))] }), _jsx("hr", { className: "mt-2 border-t", style: { borderColor: theme.silver1 } })] }));
}
