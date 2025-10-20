import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
export default function SaldoAkhirPage() {
    // Data dummy
    const dummyData = [
        {
            id: 1,
            tanggal: "2025-08-01",
            keterangan: "Saldo awal bulan",
            jumlah: 5000000,
        },
        {
            id: 2,
            tanggal: "2025-08-05",
            keterangan: "Pemasukan donasi",
            jumlah: 1500000,
        },
        {
            id: 3,
            tanggal: "2025-08-10",
            keterangan: "Pengeluaran operasional",
            jumlah: -500000,
        },
    ];
    const [search, setSearch] = useState("");
    const filteredData = useMemo(() => {
        return dummyData.filter((item) => item.keterangan.toLowerCase().includes(search.toLowerCase()) ||
            item.tanggal.includes(search));
    }, [search, dummyData]);
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Saldo Akhir" }), _jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Cari berdasarkan keterangan atau tanggal...", className: "border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500", value: search, onChange: (e) => setSearch(e.target.value) }), _jsx("div", { className: "overflow-x-auto rounded-lg shadow-md border border-gray-200", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100", children: [_jsx("th", { className: "p-3 border-b font-semibold", children: "Tanggal" }), _jsx("th", { className: "p-3 border-b font-semibold", children: "Keterangan" }), _jsx("th", { className: "p-3 border-b font-semibold text-right", children: "Jumlah" })] }) }), _jsx("tbody", { children: filteredData.length > 0 ? (filteredData.map((item) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "p-3 border-b", children: item.tanggal }), _jsx("td", { className: "p-3 border-b", children: item.keterangan }), _jsx("td", { className: `p-3 border-b text-right font-medium ${item.jumlah < 0 ? "text-red-500" : "text-green-600"}`, children: item.jumlah.toLocaleString("id-ID") })] }, item.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 3, className: "text-center p-6 text-gray-500 italic", children: "Tidak ada data yang cocok" }) })) })] }) })] }));
}
