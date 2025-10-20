import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import SimpleTable from "@/components/common/main/SimpleTable";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import StatusBadge from "@/components/common/main/MainStatusBadge";
import { ExternalLink } from "lucide-react";
import FormattedDate from "@/constants/formattedDate"; // pastikan path sesuai
import ShimmerImage from "@/components/common/main/ShimmerImage";
const fetchLectureSessions = async (lectureId) => {
    const res = await axios.get(`/public/lecture-sessions-u/by-lecture/${lectureId}`);
    return Array.isArray(res.data.data) ? res.data.data : [];
};
export default function DKMAllLectureSession() {
    const { id: lectureId } = useParams();
    const navigate = useNavigate();
    const { data: sessions = [], isLoading, isError, } = useQuery({
        queryKey: ["lecture-sessions", lectureId],
        queryFn: () => fetchLectureSessions(lectureId),
        enabled: !!lectureId,
    });
    const columns = useMemo(() => ["No", "Gambar", "Tema", "Jumlah", "Tanggal", "Status", "Aksi"], []);
    const rows = useMemo(() => {
        return sessions.map((session, index) => [
            index + 1,
            _jsx(ShimmerImage, { src: session.lecture_session_image_url, alt: "gambar", className: "w-10 h-10 rounded object-cover" }),
            session.lecture_session_title,
            session.total_kajian || "-",
            _jsx(FormattedDate, { value: session.lecture_session_start_time, fullMonth: true }),
            _jsxs(_Fragment, { children: [_jsx(StatusBadge, { text: session.lecture_session_approved_by_dkm_at
                            ? "Soal & Materi tersedia"
                            : "Soal & Materi dalam Proses", variant: session.lecture_session_approved_by_dkm_at ? "info" : "warning" }), _jsx(StatusBadge, { text: session.lecture_session_is_active ? "Aktif" : "Nonaktif", variant: session.lecture_session_is_active ? "success" : "error" })] }),
            _jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    navigate(`/dkm/kajian/kajian-detail/${session.lecture_session_id}`, {
                        state: {
                            session,
                            from: location.pathname,
                        },
                    });
                }, children: _jsx(ExternalLink, { size: 16 }) }),
        ]);
    }, [sessions, navigate]);
    const emptyText = useMemo(() => {
        if (isLoading)
            return "Memuat data...";
        if (isError)
            return "Gagal memuat data.";
        return "Belum ada sesi kajian.";
    }, [isLoading, isError]);
    return (_jsxs(_Fragment, { children: [_jsx(PageHeader, { title: "Seluruh Kajian", onBackClick: () => history.back(), actionButton: {
                    label: "Tambah Kajian",
                    to: "/dkm/kajian/tambah",
                } }), _jsx(SimpleTable, { columns: columns, rows: isLoading || isError ? [] : rows, emptyText: emptyText })] }));
}
