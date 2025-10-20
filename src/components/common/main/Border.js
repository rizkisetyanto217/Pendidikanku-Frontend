import { jsx as _jsx } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlThema from "@/hooks/useHTMLThema";
const BorderLine = ({ className = "", style }) => {
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    return (_jsx("div", { className: `border-t my-6 ${className}`, style: { borderColor: theme.silver2, ...style } }));
};
export default BorderLine;
