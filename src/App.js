import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import AppRoutes from "@/routes/IndexRoute";
import { Toaster } from "react-hot-toast";
import "./index.css";
import ScrollToTop from "./components/common/home/ScroolToTop";
import { useCurrentUser } from "@/hooks/useCurrentUser";
// ⬇️ Import ThemeProvider
import { ThemeProvider } from "@/hooks/ThemeContext";
function App() {
    // ⬇️ Trigger sekali di awal load (prefetch user)
    useCurrentUser();
    return (_jsxs(ThemeProvider, { children: [_jsx(ScrollToTop, {}), _jsx(AppRoutes, {}), _jsx(Toaster, { position: "top-right" })] }));
}
export default App;
