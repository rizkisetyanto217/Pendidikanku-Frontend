import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/StudentExam.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, ClipboardList, Clock, Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
/* ===== Utils ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ===== Meta kelas untuk title ===== */
const CLASS_META = {
    "tpa-a": { name: "TPA A", room: "Aula 1", homeroom: "Ustadz Abdullah" },
    "tpa-b": { name: "TPA B", room: "R. Tahfiz", homeroom: "Ustadz Salman" },
};
const mkDue = (d) => new Date(Date.now() + d * 864e5).toISOString();
const EXAM_BANK = {
    // Tajwid & Makharijul Huruf (lanjutan dari quiz TPA A)
    "tpa-a": [
        {
            id: "ex-001",
            title: "UTS — Tajwid & Makharijul Huruf",
            description: "Cakupan: Mad thabi'i, mad far'i (jaiz/mutawassit), dan makharij huruf.",
            durationMin: 20,
            dueAt: mkDue(2),
            questions: [
                {
                    id: "q1",
                    text: "Mad thabi'i dibaca panjang…",
                    options: ["1 harakat", "2 harakat", "4–5 harakat", "6 harakat"],
                    answer: 1,
                },
                {
                    id: "q2",
                    text: "Contoh lafaz yang mengandung mad thabi'i adalah…",
                    options: ["قِيلَ", "قَالَ", "جَاءَ", "مُؤْمِنُونَ"],
                    answer: 1,
                },
                {
                    id: "q3",
                    text: "Mad jaiz munfashil terjadi ketika…",
                    options: [
                        "Huruf mad bertemu sukun asli",
                        "Huruf mad bertemu hamzah pada kata yang sama",
                        "Huruf mad di akhir kata bertemu hamzah di awal kata berikutnya",
                        "Huruf mad berada di akhir ayat",
                    ],
                    answer: 2,
                },
                {
                    id: "q4",
                    text: "Panjang bacaan mad jaiz munfashil yang umum dipakai adalah…",
                    options: [
                        "2 harakat",
                        "4 harakat",
                        "6 harakat",
                        "2 atau 4 atau 6 harakat",
                    ],
                    answer: 3,
                },
                {
                    id: "q5",
                    text: "Makharij huruf ق (qaf) berasal dari…",
                    options: ["Ujung lidah", "Tengah lidah", "Pangkal lidah", "Bibir"],
                    answer: 2,
                },
                {
                    id: "q6",
                    text: "Huruf ب (ba) keluar dari…",
                    options: [
                        "Hidung",
                        "Pertemuan dua bibir",
                        "Ujung lidah & gusi atas",
                        "Tenggorokan",
                    ],
                    answer: 1,
                },
                {
                    id: "q7",
                    text: "Huruf ض (dhad) keluar dari…",
                    options: [
                        "Sisi lidah & geraham atas",
                        "Ujung lidah & gusi atas",
                        "Pangkal lidah",
                        "Pertemuan dua bibir",
                    ],
                    answer: 0,
                },
                {
                    id: "q8",
                    text: "Mad aridh lissukun terjadi karena…",
                    options: [
                        "Waqaf pada huruf hidup sehingga menjadi sukun",
                        "Hamzah sebelum huruf mad",
                        "Sukun asli setelah huruf mad",
                        "Idgham pada nun sukun",
                    ],
                    answer: 0,
                },
                {
                    id: "q9",
                    text: "Pilihan panjang bacaan mad aridh lissukun adalah…",
                    options: ["2 saja", "4 saja", "6 saja", "2 atau 4 atau 6 harakat"],
                    answer: 3,
                },
                {
                    id: "q10",
                    text: "Makharij huruf ط (tha') berasal dari…",
                    options: [
                        "Ujung lidah menyentuh gusi atas",
                        "Ujung lidah sedikit menekan gigi seri atas",
                        "Sisi lidah",
                        "Pangkal lidah",
                    ],
                    answer: 0,
                },
            ],
        },
    ],
    // Hafalan Juz 30 (lanjutan quiz TPA B)
    "tpa-b": [
        {
            id: "ex-101",
            title: "UTS — Hafalan Juz 30",
            description: "Cakupan: Surah An-Naba' s.d. An-Nazi'at (sebagian).",
            durationMin: 20,
            dueAt: mkDue(3),
            questions: [
                {
                    id: "q1",
                    text: "Kata pertama Surah An-Naba' adalah…",
                    options: ["عَن", "مَا", "يَتَسَاءَلُونَ", "النَّبَإِ"],
                    answer: 0,
                },
                {
                    id: "q2",
                    text: "Makna 'النَّبَإِ الْعَظِيمِ' adalah…",
                    options: [
                        "Berita yang agung",
                        "Azab yang pedih",
                        "Nikmat yang besar",
                        "Hari yang berat",
                    ],
                    answer: 0,
                },
                {
                    id: "q3",
                    text: "Pada An-Naba' ayat 9, tidur disebut sebagai…",
                    options: ["Perhiasan", "Penutup", "Istirahat", "Peringatan"],
                    answer: 2,
                },
                {
                    id: "q4",
                    text: "Surah An-Nazi'at diawali dengan sumpah atas…",
                    options: [
                        "Malaikat yang mencabut nyawa dengan keras",
                        "Gunung",
                        "Matahari",
                        "Bulan",
                    ],
                    answer: 0,
                },
                {
                    id: "q5",
                    text: "Lanjutan lafaz 'عَمَّ' adalah…",
                    options: [
                        "يَتَسَاءَلُونَ",
                        "عَنِ النَّبَإِ",
                        "الْعَظِيمِ",
                        "عَنِ الْحُكْمِ",
                    ],
                    answer: 0,
                },
                {
                    id: "q6",
                    text: "Pada An-Naba', nikmat malam dijelaskan sebagai…",
                    options: ["Penerang", "Istirahat", "Hiasan", "Azab"],
                    answer: 1,
                },
                {
                    id: "q7",
                    text: "Surah An-Nazi'at menjelaskan kisah Nabi…",
                    options: ["Ibrahim", "Musa", "Yunus", "Nuh"],
                    answer: 1,
                },
                {
                    id: "q8",
                    text: "Ayat yang menyebut 'الْمِهَادَ' merujuk pada…",
                    options: ["Langit", "Bumi sebagai hamparan", "Gunung", "Lautan"],
                    answer: 1,
                },
                {
                    id: "q9",
                    text: "Frasa 'وَبَنَيْنَا فَوْقَكُمْ سَبْعًا شِدَادًا' menjelaskan…",
                    options: [
                        "Tujuh laut",
                        "Tujuh langit yang kokoh",
                        "Tujuh gunung",
                        "Tujuh pintu",
                    ],
                    answer: 1,
                },
                {
                    id: "q10",
                    text: "An-Naba' menegaskan Hari Keputusan pada…",
                    options: [
                        "Yaumul Hisab",
                        "Yaumul Qiyamah",
                        "Yaumut Tanaad",
                        "Yaumut Taghabun",
                    ],
                    answer: 1,
                },
            ],
        },
    ],
};
const StudentExam = () => {
    const { slug, id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const classMeta = CLASS_META[id ?? ""] ?? { name: id ?? "-" };
    const exams = EXAM_BANK[id ?? ""] ?? [];
    // state pengerjaan
    const [activeEid, setActiveEid] = useState(null);
    const activeExam = useMemo(() => exams.find((e) => e.id === activeEid) || null, [activeEid, exams]);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState({});
    const startExam = (eid) => {
        const ex = exams.find((x) => x.id === eid);
        if (!ex)
            return;
        // Jika sudah pernah submit, tidak boleh ulang (demo aturan ujian)
        if (submitted[eid]) {
            Swal.fire({
                title: "Ujian sudah selesai",
                text: "Kamu sudah mengirim jawaban untuk ujian ini.",
                icon: "info",
                background: palette.white1,
                color: palette.black1,
                confirmButtonColor: palette.primary,
            });
            return;
        }
        setActiveEid(eid);
        setIdx(0);
        setAnswers(Array(ex.questions.length).fill(-1));
    };
    const pick = (i) => {
        if (!activeExam)
            return;
        const copy = [...answers];
        copy[idx] = i;
        setAnswers(copy);
    };
    const prev = () => setIdx((v) => Math.max(0, v - 1));
    const next = () => setIdx((v) => Math.min((activeExam?.questions.length ?? 1) - 1, v + 1));
    const submit = async () => {
        if (!activeExam)
            return;
        const empty = answers.findIndex((a) => a < 0);
        if (empty !== -1) {
            const ok = await Swal.fire({
                title: "Masih ada yang kosong",
                text: "Yakin kirim sekarang? Ujian tidak dapat diulang.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, kirim",
                cancelButtonText: "Cek lagi",
                background: palette.white1,
                color: palette.black1,
                confirmButtonColor: palette.primary,
            });
            if (!ok.isConfirmed)
                return;
        }
        const total = activeExam.questions.length;
        let correct = 0;
        activeExam.questions.forEach((q, i) => {
            if (answers[i] === q.answer)
                correct++;
        });
        const score = Math.round((correct / total) * 100);
        setSubmitted((prev) => ({
            ...prev,
            [activeExam.id]: {
                score,
                correct,
                total,
                submittedAt: new Date().toISOString(),
            },
        }));
        setActiveEid(null);
        await Swal.fire({
            title: "Ujian dikirim!",
            html: `<p>Skor: <b>${score}</b> (${correct}/${total} benar)</p>`,
            icon: "success",
            background: palette.white1,
            color: palette.black1,
            confirmButtonColor: palette.primary,
        });
    };
    const goBackToMyClass = () => navigate(`/${slug}/murid/menu-utama/my-class`, { replace: false });
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Ujian — ${classMeta.name}`, gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: goBackToMyClass, children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Daftar Ujian" })] }), _jsx("div", { className: "grid gap-3", children: exams.length === 0 ? (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm text-center", style: { color: palette.silver2 }, children: "Belum ada ujian untuk kelas ini." }) })) : (exams.map((ex) => {
                                        const res = submitted[ex.id];
                                        return (_jsxs(SectionCard, { palette: palette, className: "p-0", children: [_jsx("div", { className: "p-4 md:p-5", children: _jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("div", { className: "text-base md:text-lg font-semibold", style: { color: palette.black2 }, children: ex.title }), _jsx(Badge, { palette: palette, variant: res ? "success" : "outline", className: "h-6", children: res ? "Selesai" : "Belum dikerjakan" })] }), ex.description && (_jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: ex.description })), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm", style: { color: palette.black2 }, children: [_jsx(ClipboardList, { size: 14 }), _jsxs("span", { children: [ex.questions.length, " soal"] }), _jsx("span", { children: "\u2022" }), _jsx(Clock, { size: 14 }), _jsxs("span", { children: [ex.durationMin, " menit"] }), ex.dueAt && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Jatuh tempo: ", dateLong(ex.dueAt)] })] })), res && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx(CheckCircle2, { size: 14 }), _jsxs("span", { children: ["Skor: ", _jsx("b", { children: res.score }), " (", res.correct, "/", res.total, ")"] })] }))] })] }) }) }), _jsxs("div", { className: "px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Aksi" }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [!res && (_jsxs(Btn, { palette: palette, size: "sm", onClick: () => startExam(ex.id), children: [_jsx(Play, { size: 16, className: "mr-1" }), "Mulai Ujian"] })), res && (_jsxs(Btn, { palette: palette, size: "sm", variant: "secondary", disabled: true, children: [_jsx(CheckCircle2, { size: 16, className: "mr-1" }), "Sudah dikerjakan"] }))] })] })] }, ex.id));
                                    })) }), activeExam && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "font-semibold", children: activeExam.title }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx(Clock, { size: 14 }), _jsxs("span", { children: ["Estimasi ", activeExam.durationMin, " menit"] })] })] }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Soal ", idx + 1, " / ", activeExam.questions.length] }), _jsxs("div", { className: "p-4 rounded-lg border", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx("div", { className: "font-medium mb-3", style: { color: palette.black2 }, children: activeExam.questions[idx].text }), _jsx("div", { className: "grid gap-2", children: activeExam.questions[idx].options.map((opt, i) => {
                                                            const selected = answers[idx] === i;
                                                            return (_jsxs("button", { onClick: () => pick(i), className: `text-left px-3 py-2 rounded-lg border ${selected ? "ring-1" : ""}`, style: {
                                                                    borderColor: palette.silver1,
                                                                    background: selected
                                                                        ? palette.white2
                                                                        : palette.white1,
                                                                    color: palette.black1,
                                                                }, children: [_jsxs("span", { className: "mr-2 font-mono", children: [String.fromCharCode(65 + i), "."] }), opt] }, i));
                                                        }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: answers[idx] >= 0
                                                            ? "Jawaban dipilih."
                                                            : "Belum memilih jawaban." }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Btn, { palette: palette, variant: "secondary", onClick: prev, disabled: idx === 0, children: [_jsx(ChevronLeft, { size: 16, className: "mr-1" }), "Sebelumnya"] }), idx < activeExam.questions.length - 1 ? (_jsxs(Btn, { palette: palette, onClick: next, children: ["Selanjutnya", " ", _jsx(ChevronRight, { size: 16, className: "ml-1" })] })) : (_jsxs(Btn, { palette: palette, onClick: submit, children: [_jsx(Pause, { size: 16, className: "mr-1" }), "Kirim Ujian"] }))] })] })] }) })), _jsx("div", { className: "md:hidden", children: _jsxs(Btn, { palette: palette, variant: "outline", onClick: goBackToMyClass, children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), " Kembali ke Kelas"] }) })] })] }) })] }));
};
export default StudentExam;
