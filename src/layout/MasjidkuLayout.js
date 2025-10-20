import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
export default function MasjidkuLayout() {
    return (_jsx("div", { className: "min-h-screen flex flex-col", children: _jsxs("main", { className: "flex-1 w-full max-w-2xl mx-auto px-4", children: [_jsx(Outlet, {}), " "] }) }));
}
