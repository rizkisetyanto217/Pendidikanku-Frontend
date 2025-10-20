import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function AttendanceModal({ show, onClose, sessionId, onSuccess, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [attendanceChoice, setAttendanceChoice] = useState(null);
    const [kajianInsight, setKajianInsight] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current &&
                !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, onClose]);
    const handleAttendanceSubmit = async () => {
        if (!attendanceChoice) {
            console.log("❌ Belum memilih jenis kehadiran");
            return;
        }
        try {
            setIsSubmitting(true);
            let status = 0;
            if (attendanceChoice === "tatap_muka")
                status = 1;
            else if (attendanceChoice === "online")
                status = 2;
            const payload = {
                user_lecture_sessions_attendance_lecture_session_id: sessionId,
                user_lecture_sessions_attendance_status: status,
                user_lecture_sessions_attendance_notes: status !== 0 ? kajianInsight : "",
            };
            console.log("📤 Mengirim data kehadiran:", payload);
            const res = await axios.post("/public/user-lecture-sessions-attendance", payload);
            console.log("✅ Respon backend:", res.data);
            alert("✅ Kehadiran berhasil dicatat.");
            onClose();
            onSuccess?.();
        }
        catch (err) {
            console.error("❌ Gagal mencatat kehadiran:", err);
            alert("❌ Gagal mencatat kehadiran.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { ref: modalRef, className: "w-full max-w-md rounded-lg p-5", style: {
                backgroundColor: theme.white1,
                color: theme.black1,
                border: `1px solid ${theme.silver1}`,
            }, children: [_jsx("h2", { className: "text-base font-semibold mb-4", children: "Catat Kehadiran" }), _jsx("div", { className: "space-y-2", children: [
                        { value: "tatap_muka", label: "Hadir Tatap Muka" },
                        { value: "online", label: "Hadir Online" },
                        { value: "tidak_hadir", label: "Tidak Hadir" },
                    ].map((opt) => (_jsxs("div", { onClick: () => setAttendanceChoice(opt.value), className: "cursor-pointer flex items-center justify-between p-3 rounded hover:opacity-90 transition-all", style: {
                            backgroundColor: theme.white2,
                            border: `1px solid ${theme.silver1}`,
                        }, children: [_jsxs("span", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "radio", name: "attendance", checked: attendanceChoice === opt.value, readOnly: true }), _jsx("span", { style: { color: theme.black1 }, children: opt.label })] }), _jsx("span", { style: { color: theme.silver4 }, children: "\u203A" })] }, opt.value))) }), attendanceChoice !== "tidak_hadir" && attendanceChoice !== null && (_jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm mb-1", children: "Hal-hal yang didapatkan dari kajian:" }), _jsx("textarea", { value: kajianInsight, onChange: (e) => setKajianInsight(e.target.value), className: "w-full p-2 text-sm rounded", rows: 3, placeholder: "Tulis insight yang kamu dapatkan...", style: {
                                backgroundColor: theme.white2,
                                color: theme.black1,
                                border: `1px solid ${theme.silver1}`,
                            } })] })), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { onClick: onClose, className: "text-sm px-4 py-1 rounded", style: { color: theme.silver2 }, disabled: isSubmitting, children: "Batal" }), _jsx("button", { onClick: handleAttendanceSubmit, className: "text-sm px-4 py-1 rounded", style: {
                                backgroundColor: theme.primary,
                                color: theme.white1,
                                opacity: isSubmitting || !attendanceChoice ? 0.5 : 1,
                            }, disabled: isSubmitting || !attendanceChoice, children: isSubmitting ? "Menyimpan..." : "Simpan" })] })] }) }));
}
