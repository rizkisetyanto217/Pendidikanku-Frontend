import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
const Button = ({ variant, children, onClick, disabled }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const background = variant === "primary" ? theme.primary : theme.tertiary;
    const backgroundHover = variant === "primary" ? theme.quaternary : theme.secondary;
    const textColor = variant === "primary" ? "#FFFFFF" : theme.black1;
    return (_jsx("button", { type: variant === "primary" ? "submit" : "button", className: "px-6 py-2 font-semibold rounded-[8px] transition-colors disabled:opacity-50", style: {
            backgroundColor: background,
            color: textColor,
            cursor: disabled ? "not-allowed" : "pointer",
        }, onClick: onClick, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = backgroundHover), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = background), disabled: disabled, children: children }));
};
export default function SubmitActionButtons({ isPending, isEditMode = false, onNextClick, disabled, }) {
    return (_jsxs("div", { className: "flex justify-end gap-4", children: [_jsx(Button, { variant: "primary", disabled: isPending || disabled, children: isPending
                    ? "Menyimpan..."
                    : isEditMode
                        ? "Simpan Perubahan"
                        : "Simpan Sekarang" }), onNextClick && (_jsx(Button, { variant: "next", onClick: onNextClick, children: "Lanjut" }))] }));
}
