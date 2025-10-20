import { jsx as _jsx } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export const Tabs = ({ tabs, value, onChange }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsx("div", { className: "flex gap-1", children: tabs.map((tab) => {
            const isActive = value === tab.value;
            return (_jsx("button", { onClick: () => onChange(tab.value), className: "flex-1 px-4 py-2 text-sm font-medium transition-all rounded-md", style: {
                    backgroundColor: isActive ? theme.white1 : theme.white2,
                    color: isActive ? theme.black1 : theme.silver2,
                    border: `1px solid ${theme.silver1}`,
                    borderBottom: isActive
                        ? `2px solid ${theme.primary}`
                        : `1px solid ${theme.silver1}`,
                }, children: tab.label }, tab.value));
        }) }));
};
export const TabsContent = ({ value, children, current }) => {
    return value === current ? _jsx("div", { className: "mt-4", children: children }) : null;
};
