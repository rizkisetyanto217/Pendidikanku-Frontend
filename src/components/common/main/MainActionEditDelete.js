import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/common/ActionEditDelete.tsx
import { Edit, Trash2 } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function ActionEditDelete({ onEdit, onDelete, showEdit = true, showDelete = true, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "flex items-center gap-2", children: [showEdit && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation(); // ⛔️ Cegah trigger onRowClick
                    onEdit?.();
                }, title: "Edit", className: "transition", style: { color: theme.primary }, children: _jsx(Edit, { size: 18 }) })), showDelete && (_jsx("button", { onClick: (e) => {
                    e.stopPropagation(); // ⛔️ Cegah trigger onRowClick
                    onDelete?.();
                }, title: "Hapus", className: "transition", style: { color: theme.error1 }, children: _jsx(Trash2, { size: 18 }) }))] }));
}
