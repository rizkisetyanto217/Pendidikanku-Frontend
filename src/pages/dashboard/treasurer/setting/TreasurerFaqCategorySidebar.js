import { jsx as _jsx } from "react/jsx-runtime";
export default function FaqCategorySidebar({ categories, selected, onSelect, }) {
    return (_jsx("div", { className: "rounded-xl border p-4 space-y-2 bg-white dark:bg-[#1C1C1C]", children: categories.map((cat) => (_jsx("button", { onClick: () => onSelect(cat), className: `block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${selected === cat
                ? 'bg-teal-600 text-white'
                : 'text-gray-700 hover:bg-teal-100 dark:text-gray-300 dark:hover:bg-teal-800'}`, children: cat }, cat))) }));
}
