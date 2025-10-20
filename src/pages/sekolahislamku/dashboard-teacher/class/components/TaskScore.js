import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/TaskScore.tsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Download, RefreshCw, Save, AlertCircle, Eye, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
export default function TaskScore() {
    const { id: assignmentId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const assignment = state?.assignment;
    // State management
    const [students, setStudents] = useState([
        {
            id: "s1",
            name: "Ahmad Fadhil",
            submitted: true,
            score: 85,
            submissionDate: "2024-01-15",
            submissionFile: "ahmad_tugas.pdf",
            feedback: "",
        },
        {
            id: "s2",
            name: "Aisyah Putri",
            submitted: true,
            score: 92,
            submissionDate: "2024-01-14",
            submissionFile: "aisyah_tugas.docx",
            feedback: "Kerja yang sangat baik!",
        },
        {
            id: "s3",
            name: "Rizky Abdullah",
            submitted: false,
            submissionDate: undefined,
            submissionFile: undefined,
            feedback: "",
        },
        {
            id: "s4",
            name: "Siti Nurhaliza",
            submitted: true,
            score: undefined,
            submissionDate: "2024-01-16",
            submissionFile: "siti_tugas.pdf",
            feedback: "",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [showFeedback, setShowFeedback] = useState({});
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    // Load data on component mount
    useEffect(() => {
        loadStudentData();
    }, [assignmentId]);
    const loadStudentData = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(`Loading data for assignment: ${assignmentId}`);
        }
        catch (error) {
            console.error("Error loading student data:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleChangeScore = (studentId, score) => {
        // Validate score (0-100)
        if (score < 0 || score > 100) {
            setValidationErrors((prev) => [
                ...prev.filter((e) => e.studentId !== studentId),
                { studentId, message: "Nilai harus antara 0-100" },
            ]);
            return;
        }
        // Clear validation error for this student
        setValidationErrors((prev) => prev.filter((e) => e.studentId !== studentId));
        setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, score } : s)));
    };
    const handleChangeFeedback = (studentId, feedback) => {
        setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, feedback } : s)));
    };
    const toggleFeedback = (studentId) => {
        setShowFeedback((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };
    const handleSave = async () => {
        // Validate all scores
        const errors = [];
        students.forEach((student) => {
            if (student.submitted &&
                (student.score === undefined ||
                    student.score < 0 ||
                    student.score > 100)) {
                errors.push({
                    studentId: student.id,
                    message: student.score === undefined
                        ? "Nilai belum diisi"
                        : "Nilai tidak valid",
                });
            }
        });
        if (errors.length > 0) {
            setValidationErrors(errors);
            alert("Mohon perbaiki kesalahan pada form sebelum menyimpan");
            return;
        }
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const dataToSave = {
                assignmentId,
                scores: students.map((s) => ({
                    studentId: s.id,
                    score: s.score,
                    feedback: s.feedback,
                })),
            };
            console.log("Data tersimpan:", dataToSave);
            alert("Nilai berhasil disimpan!");
            // Clear validation errors
            setValidationErrors([]);
        }
        catch (error) {
            console.error("Error saving scores:", error);
            alert("Gagal menyimpan nilai. Silakan coba lagi.");
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleExportScores = () => {
        const csvContent = [
            ["Nama Siswa", "Status", "Nilai", "Tanggal Submit", "Feedback"],
            ...students.map((s) => [
                s.name,
                s.submitted ? "Terkumpul" : "Belum",
                s.score ?? "-",
                s.submissionDate ?? "-",
                s.feedback ?? "",
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nilai_${assignment?.title ?? assignmentId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const handleViewSubmission = (student) => {
        if (student.submissionFile) {
            // In real app, this would open the file or navigate to submission view
            alert(`Membuka file: ${student.submissionFile}`);
            console.log("View submission for:", student);
        }
    };
    const handleRefresh = () => {
        loadStudentData();
    };
    // Filter and sort students
    const filteredAndSortedStudents = students
        .filter((student) => {
        if (filterStatus === "submitted")
            return student.submitted;
        if (filterStatus === "pending")
            return !student.submitted;
        return true;
    })
        .sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.name.localeCompare(b.name);
            case "score":
                return (b.score ?? 0) - (a.score ?? 0);
            case "date":
                if (!a.submissionDate)
                    return 1;
                if (!b.submissionDate)
                    return -1;
                return (new Date(b.submissionDate).getTime() -
                    new Date(a.submissionDate).getTime());
            default:
                return 0;
        }
    });
    const submittedCount = students.filter((s) => s.submitted).length;
    const totalStudents = students.length;
    const averageScore = students
        .filter((s) => s.score !== undefined)
        .reduce((sum, s) => sum + (s.score ?? 0), 0) /
        students.filter((s) => s.score !== undefined).length;
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center", style: { background: palette.white2 }, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: "animate-spin", size: 20 }), _jsx("span", { children: "Memuat data..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Penilaian Tugas", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", style: { background: palette.silver1 }, children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("span", { children: ["Nilai Tugas: ", assignment?.title ?? `Tugas ${assignmentId}`] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: handleRefresh, className: "p-2 rounded hover:opacity-80", style: { background: palette.silver1 }, title: "Refresh Data", children: _jsx(RefreshCw, { size: 16 }) }), _jsx("button", { onClick: handleExportScores, className: "p-2 rounded hover:opacity-80", style: { background: palette.silver1 }, title: "Export ke CSV", children: _jsx(Download, { size: 16 }) })] })] }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 text-center", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: palette.primary }, children: [submittedCount, "/", totalStudents] }), _jsx("div", { className: "text-sm opacity-70", children: "Terkumpul" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", style: { color: palette.primary }, children: totalStudents - submittedCount }), _jsx("div", { className: "text-sm opacity-70", children: "Belum Submit" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", style: { color: palette.primary }, children: isNaN(averageScore) ? "-" : Math.round(averageScore) }), _jsx("div", { className: "text-sm opacity-70", children: "Rata-rata Nilai" })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: palette.primary }, children: [Math.round((submittedCount / totalStudents) * 100), "%"] }), _jsx("div", { className: "text-sm opacity-70", children: "Tingkat Submit" })] })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mr-2", children: "Filter:" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-1 border rounded text-sm", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                        }, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "submitted", children: "Sudah Submit" }), _jsx("option", { value: "pending", children: "Belum Submit" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mr-2", children: "Urutkan:" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-1 border rounded text-sm", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                        }, children: [_jsx("option", { value: "name", children: "Nama" }), _jsx("option", { value: "score", children: "Nilai" }), _jsx("option", { value: "date", children: "Tanggal Submit" })] })] })] }) }), validationErrors.length > 0 && (_jsxs(SectionCard, { palette: palette, className: "p-4 border-red-200 bg-red-50", children: [_jsxs("div", { className: "flex items-center gap-2 text-red-600 mb-2", children: [_jsx(AlertCircle, { size: 16 }), _jsx("span", { className: "font-medium", children: "Terdapat kesalahan:" })] }), _jsx("ul", { className: "text-sm text-red-600 space-y-1", children: validationErrors.map((error, index) => {
                                                const student = students.find((s) => s.id === error.studentId);
                                                return (_jsxs("li", { children: [student?.name, ": ", error.message] }, index));
                                            }) })] })), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: `2px solid ${palette.silver1}` }, className: "text-left", children: [_jsx("th", { className: "py-3 font-semibold", children: "Nama Siswa" }), _jsx("th", { className: "py-3 font-semibold", children: "Status" }), _jsx("th", { className: "py-3 font-semibold", children: "Tanggal Submit" }), _jsx("th", { className: "py-3 font-semibold", children: "Nilai" }), _jsx("th", { className: "py-3 font-semibold", children: "Feedback" }), _jsx("th", { className: "py-3 font-semibold", children: "Aksi" })] }) }), _jsx("tbody", { children: filteredAndSortedStudents.map((student, index) => (_jsxs(React.Fragment, { children: [_jsxs("tr", { style: {
                                                                        borderBottom: `1px solid ${palette.silver1}`,
                                                                        backgroundColor: index % 2 === 0 ? palette.white1 : palette.white2,
                                                                    }, children: [_jsx("td", { className: "py-3 font-medium", children: student.name }), _jsx("td", { className: "py-3", children: student.submitted ? (_jsxs("span", { className: "text-green-600 flex items-center gap-1", children: [_jsx(CheckCircle2, { size: 14 }), " Terkumpul"] })) : (_jsxs("span", { className: "text-red-500 flex items-center gap-1", children: [_jsx(AlertCircle, { size: 14 }), " Belum Submit"] })) }), _jsx("td", { className: "py-3", children: student.submissionDate
                                                                                ? new Date(student.submissionDate).toLocaleDateString("id-ID")
                                                                                : "-" }), _jsx("td", { className: "py-3", children: student.submitted ? (_jsxs("div", { children: [_jsx("input", { type: "number", value: student.score ?? "", onChange: (e) => handleChangeScore(student.id, Number(e.target.value)), placeholder: "0-100", min: "0", max: "100", className: "w-20 px-2 py-1 border rounded text-center", style: {
                                                                                            borderColor: validationErrors.some((e) => e.studentId === student.id)
                                                                                                ? "#ef4444"
                                                                                                : palette.silver1,
                                                                                            background: palette.white1,
                                                                                            color: palette.black1,
                                                                                        } }), validationErrors.some((e) => e.studentId === student.id) && (_jsx("div", { className: "text-xs text-red-500 mt-1", children: validationErrors.find((e) => e.studentId === student.id)?.message }))] })) : ("-") }), _jsx("td", { className: "py-3", children: student.submitted ? (_jsx("div", { children: _jsxs("button", { onClick: () => toggleFeedback(student.id), className: "text-xs px-2 py-1 rounded border", style: {
                                                                                        borderColor: palette.silver1,
                                                                                        background: showFeedback[student.id]
                                                                                            ? palette.primary
                                                                                            : palette.white1,
                                                                                        color: showFeedback[student.id]
                                                                                            ? "white"
                                                                                            : palette.black1,
                                                                                    }, children: [showFeedback[student.id]
                                                                                            ? "Tutup"
                                                                                            : "Tambah", " ", "Feedback"] }) })) : ("-") }), _jsx("td", { className: "py-3", children: _jsx("div", { className: "flex items-center gap-1", children: student.submitted && student.submissionFile && (_jsx("button", { onClick: () => handleViewSubmission(student), className: "p-1 rounded hover:opacity-80", style: { background: palette.silver1 }, title: "Lihat Submission", children: _jsx(Eye, { size: 14 }) })) }) })] }), showFeedback[student.id] && student.submitted && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-2", style: { background: palette.white2 }, children: _jsxs("div", { className: "px-4", children: [_jsxs("label", { className: "text-xs font-medium block mb-1", children: ["Feedback untuk ", student.name, ":"] }), _jsx("textarea", { value: student.feedback ?? "", onChange: (e) => handleChangeFeedback(student.id, e.target.value), placeholder: "Tulis feedback untuk siswa...", className: "w-full px-3 py-2 border rounded text-sm resize-none", rows: 2, style: {
                                                                                        borderColor: palette.silver1,
                                                                                        background: palette.white1,
                                                                                        color: palette.black1,
                                                                                    } })] }) }) }))] }, student.id))) })] }) }), filteredAndSortedStudents.length === 0 && (_jsx("div", { className: "text-center py-8 opacity-60", children: "Tidak ada data siswa yang sesuai dengan filter" })), _jsxs("div", { className: "mt-6 flex justify-between items-center", children: [_jsxs("div", { className: "text-sm opacity-70", children: ["Menampilkan ", filteredAndSortedStudents.length, " dari", " ", totalStudents, " siswa"] }), _jsx("div", { className: "flex gap-2", children: _jsx(Btn, { palette: palette, onClick: handleSave, disabled: isSaving || validationErrors.length > 0, className: "flex items-center gap-2", children: isSaving ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "animate-spin", size: 16 }), "Menyimpan..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { size: 16 }), "Simpan Semua Nilai"] })) }) })] })] })] })] }) })] }));
}
