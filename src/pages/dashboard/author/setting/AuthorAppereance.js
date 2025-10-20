import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useHtmlDarkMode from '@/hooks/userHTMLDarkMode';
import { colors } from '@/constants/colorsThema';
export default function Appereance() {
    const { isDark, setDarkMode } = useHtmlDarkMode();
    const theme = isDark ? colors.dark : colors.light;
    const handleChange = (e) => {
        setDarkMode(e.target.value === 'dark');
    };
    return (_jsxs("div", { className: "p-6 rounded-xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Tampilan" }), _jsx("label", { className: "block text-sm font-medium mb-2", htmlFor: "themeSelect", children: "Tema" }), _jsxs("div", { className: "relative w-fit", children: [_jsxs("select", { id: "themeSelect", onChange: handleChange, value: isDark ? 'dark' : 'light', className: "appearance-none border pr-10 pl-4 py-2 rounded-md text-sm w-40", style: {
                            backgroundColor: theme.white2,
                            color: theme.black1,
                            borderColor: theme.silver1,
                        }, children: [_jsx("option", { value: "light", children: "Terang" }), _jsx("option", { value: "dark", children: "Gelap" })] }), _jsx("div", { className: "pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400", children: "\u25BC" })] })] }));
}
