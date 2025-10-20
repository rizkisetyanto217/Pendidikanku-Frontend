import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import SimpleTable from "@/components/common/main/SimpleTable";
import ActionEditDelete from "@/components/common/main/MainActionEditDelete";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import FormattedDate from "@/constants/formattedDate";
const getAdvicesByLecture = async (lectureId) => {
    const res = await axios.get(`/api/a/advices/by-lecture/${lectureId}`);
    return res.data;
};
export default function DKMSuggestLecture() {
    const { id: lectureId } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ["advices", lectureId],
        queryFn: () => getAdvicesByLecture(lectureId),
        enabled: !!lectureId,
    });
    const columns = ["No", "Pengirim", "Saran & Masukan", "Tanggal", "Aksi"];
    const rows = useMemo(() => {
        if (!data)
            return [];
        return data.map((item, index) => [
            index + 1,
            "Pengguna", // Bisa diganti jika ada data nama user
            item.advice_description,
            _jsx(FormattedDate, { value: item.advice_created_at }),
            _jsx("div", { onClick: (e) => e.stopPropagation(), children: _jsx(ActionEditDelete, { onEdit: () => console.log("Edit", item.advice_id), onDelete: () => {
                        if (confirm("Yakin ingin menghapus saran ini?")) {
                            console.log("Delete", item.advice_id);
                            // tambahkan fungsi hapus kalau sudah siap
                        }
                    } }) }),
        ]);
    }, [data]);
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Saran & Masukan", onBackClick: () => history.back() }), _jsx("div", { className: "mt-4", children: _jsx(SimpleTable, { columns: columns, rows: rows, emptyText: isLoading ? "Memuat data..." : "Belum ada saran masuk." }) })] }));
}
