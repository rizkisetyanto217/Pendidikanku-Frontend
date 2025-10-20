import { jsx as _jsx } from "react/jsx-runtime";
import SaldoAkhirPage from "./components/SaldoAkhirPage";
import PemasukanPage from "./components/PemasukanPage";
import PengeluaranPage from "./components/PengeluaranPage";
export const financeRoutes = [
    {
        path: "financial/saldo-akhir", // Hapus prefix /masjidku/
        element: _jsx(SaldoAkhirPage, {}),
    },
    {
        path: "financial/pemasukan",
        element: _jsx(PemasukanPage, {}),
    },
    {
        path: "financial/pengeluaran",
        element: _jsx(PengeluaranPage, {}),
    },
];
