import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, Users, UserCheck, MapPin, UserPlus, Edit3, Trash2, GraduationCap, Clock, X, Save, Plus, } from "lucide-react";
import Swal from "sweetalert2";
// Modal Component
const Modal = ({ isOpen, onClose, title, palette, children }) => {
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 transition-opacity duration-300", style: { backgroundColor: `${palette.black1}60` }, onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-hidden", style: {
                    background: palette.white1,
                    border: `1px solid ${palette.black1}10`,
                }, children: [_jsxs("div", { className: "px-6 py-4 border-b flex items-center justify-between", style: {
                            background: `linear-gradient(135deg, ${palette.primary}10, ${palette.primary}05)`,
                            borderColor: `${palette.black1}10`,
                        }, children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: palette.black1 }, children: title }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg transition-all duration-200 hover:scale-105", style: {
                                    background: `${palette.black1}10`,
                                    color: palette.black1,
                                }, children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-120px)]", children: children })] })] }));
};
// Form Input Component
const FormInput = ({ label, value, onChange, placeholder, palette, required }) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium opacity-80", children: [label, required && _jsx("span", { style: { color: palette.error1 }, children: " *" })] }), _jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2", style: {
                background: palette.white2,
                border: `1px solid ${palette.black1}20`,
                color: palette.black1,
                // focusRingColor: palette.primary,
            } })] }));
// Assistant Item Component
const AssistantItem = ({ assistant, onRemove, palette }) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border", style: {
        background: palette.white2,
        border: `1px solid ${palette.black1}10`,
    }, children: [_jsx("span", { className: "font-medium", children: assistant }), _jsx("button", { onClick: onRemove, className: "p-1 rounded-full transition-all duration-200 hover:scale-105", style: {
                background: `${palette.error1}10`,
                color: palette.error1,
            }, children: _jsx(X, { size: 16 }) })] }));
const HomeroomTeacher = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { state } = useLocation();
    // Modal states
    const [modalType, setModalType] = useState(null);
    const [editData, setEditData] = useState({
        homeroom: state?.homeroom || "",
        room: state?.room || "",
        assistants: state?.assistants || [],
    });
    const [newAssistant, setNewAssistant] = useState("");
    const currentDate = new Date().toISOString();
    const handleDelete = async () => {
        const res = await Swal.fire({
            title: "Hapus Wali Kelas?",
            text: `Wali kelas "${state?.homeroom}" akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: palette.error1,
            cancelButtonColor: palette.silver2,
            background: palette.white1,
            color: palette.black1,
        });
        if (!res.isConfirmed)
            return;
        await Swal.fire({
            title: "Terhapus",
            text: "Data wali kelas berhasil dihapus.",
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
            background: palette.white1,
            color: palette.black1,
        });
        navigate(-1);
    };
    const handleSaveEdit = async () => {
        if (!editData.homeroom.trim()) {
            await Swal.fire({
                title: "Error",
                text: "Nama wali kelas tidak boleh kosong.",
                icon: "error",
                background: palette.white1,
                color: palette.black1,
            });
            return;
        }
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await Swal.fire({
            title: "Berhasil",
            text: "Data wali kelas berhasil diperbarui.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: palette.white1,
            color: palette.black1,
        });
        setModalType(null);
    };
    const handleAddAssistant = () => {
        if (!newAssistant.trim())
            return;
        setEditData((prev) => ({
            ...prev,
            assistants: [...prev.assistants, newAssistant.trim()],
        }));
        setNewAssistant("");
    };
    const handleRemoveAssistant = (index) => {
        setEditData((prev) => ({
            ...prev,
            assistants: prev.assistants.filter((_, i) => i !== index),
        }));
    };
    const handleSaveAssistants = async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await Swal.fire({
            title: "Berhasil",
            text: "Daftar guru pendamping berhasil diperbarui.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: palette.white1,
            color: palette.black1,
        });
        setModalType(null);
    };
    const openEditModal = () => {
        setEditData({
            homeroom: state?.homeroom || "",
            room: state?.room || "",
            assistants: state?.assistants || [],
        });
        setModalType("edit");
    };
    const openAssistantModal = () => {
        setEditData((prev) => ({
            ...prev,
            assistants: state?.assistants || [],
        }));
        setNewAssistant("");
        setModalType("addAssistant");
    };
    return (_jsxs("div", { className: "min-h-screen w-full transition-colors duration-200", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Wali Kelas", gregorianDate: currentDate }), _jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-8", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0 lg:sticky lg:top-20 shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 space-y-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate(-1), className: "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105", style: {
                                                background: palette.white1,
                                                border: `1px solid ${palette.black1}20`,
                                                color: palette.black1,
                                            }, children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Detail Wali Kelas" }), _jsx("p", { className: "text-sm opacity-70 mt-1", children: "Informasi lengkap wali kelas dan pendamping" })] })] }), _jsxs(SectionCard, { palette: palette, className: "overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b", style: {
                                                background: `linear-gradient(135deg, ${palette.primary}15, ${palette.primary}10)`,
                                                borderColor: `${palette.black1}10`,
                                            }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center", style: { background: `${palette.primary}20` }, children: _jsx(UserCheck, { size: 24, style: { color: palette.primary } }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Profil Wali Kelas" }), _jsx("p", { className: "text-sm opacity-60", children: "Informasi dasar wali kelas" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: openAssistantModal, className: "p-2 rounded-lg transition-all duration-200 hover:scale-105", style: {
                                                                    background: `${palette.primary}10`,
                                                                    color: palette.primary,
                                                                }, title: "Kelola Pendamping", children: _jsx(UserPlus, { size: 18 }) }), _jsx("button", { onClick: openEditModal, className: "p-2 rounded-lg transition-all duration-200 hover:scale-105", style: {
                                                                    background: `${palette.primary}10`,
                                                                    color: palette.primary,
                                                                }, title: "Edit", children: _jsx(Edit3, { size: 18 }) }), _jsx("button", { onClick: handleDelete, className: "p-2 rounded-lg transition-all duration-200 hover:scale-105", style: {
                                                                    background: `${palette.error1}10`,
                                                                    color: palette.error1,
                                                                }, title: "Hapus", children: _jsx(Trash2, { size: 18 }) })] })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium opacity-60", children: [_jsx(GraduationCap, { size: 12 }), "NAMA WALI KELAS"] }), _jsx("p", { className: "text-xl font-bold", children: state?.homeroom || (_jsx("span", { className: "opacity-60 font-normal text-base", children: "Belum ada data" })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium opacity-60", children: [_jsx(MapPin, { size: 12 }), "RUANG KELAS"] }), _jsx("p", { className: "text-xl font-bold", children: state?.room || (_jsx("span", { className: "opacity-60 font-normal text-base", children: "Belum ditentukan" })) })] })] }), state?.assistants?.length ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium opacity-70", children: [_jsx(Users, { size: 14 }), "Guru Pendamping"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: state.assistants.map((assistant, index) => (_jsx(Badge, { palette: palette, variant: "outline", className: "px-3 py-1", children: assistant }, index))) })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium opacity-70", children: [_jsx(Users, { size: 14 }), "Guru Pendamping"] }), _jsx("p", { className: "text-sm opacity-60 italic", children: "Belum ada guru pendamping" })] })), _jsx("div", { className: "h-px", style: { background: `${palette.black1}10` } }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsxs("div", { className: "p-4 rounded-lg text-center", style: { background: `${palette.primary}05` }, children: [_jsx("div", { className: "flex items-center justify-center mb-2", children: _jsx(Users, { size: 24, style: { color: palette.primary } }) }), _jsx("p", { className: "text-2xl font-bold", style: { color: palette.primary }, children: state?.studentsCount ?? 0 }), _jsx("p", { className: "text-xs opacity-70 mt-1", children: "Total Siswa" })] }), _jsxs("div", { className: "p-4 rounded-lg text-center", style: { background: `${palette.primary}05` }, children: [_jsx("div", { className: "flex items-center justify-center mb-2", children: _jsx(UserCheck, { size: 24, style: { color: palette.primary } }) }), _jsx("p", { className: "text-2xl font-bold", style: { color: palette.primary }, children: (state?.assistants?.length ?? 0) + 1 }), _jsx("p", { className: "text-xs opacity-70 mt-1", children: "Total Pengajar" })] }), _jsxs("div", { className: "p-4 rounded-lg text-center", style: { background: `${palette.silver2}20` }, children: [_jsx("div", { className: "flex items-center justify-center mb-2", children: _jsx(Clock, { size: 24, style: { color: palette.silver2 } }) }), _jsx("p", { className: "text-lg font-bold", style: { color: palette.silver2 }, children: "Aktif" }), _jsx("p", { className: "text-xs opacity-70 mt-1", children: "Status" })] })] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { background: palette.primary } }), "Aksi Tersedia"] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs(Btn, { palette: palette, onClick: openAssistantModal, className: "w-full py-3 font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2", children: [_jsx(UserPlus, { size: 18 }), "Kelola Pendamping"] }), _jsxs(Btn, { palette: palette, variant: "ghost", onClick: openEditModal, className: "w-full py-3 font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2", children: [_jsx(Edit3, { size: 18 }), "Edit Data"] }), _jsxs(Btn, { palette: palette, variant: "destructive", onClick: handleDelete, className: "w-full py-3 font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2", children: [_jsx(Trash2, { size: 18 }), "Hapus Wali Kelas"] })] })] })] })] }) }), _jsx(Modal, { isOpen: modalType === "edit", onClose: () => setModalType(null), title: "Edit Wali Kelas", palette: palette, children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormInput, { label: "Nama Wali Kelas", value: editData.homeroom, onChange: (value) => setEditData((prev) => ({ ...prev, homeroom: value })), placeholder: "Masukkan nama wali kelas", palette: palette, required: true }), _jsx(FormInput, { label: "Ruang Kelas", value: editData.room, onChange: (value) => setEditData((prev) => ({ ...prev, room: value })), placeholder: "Contoh: Kelas 1A, Ruang 101", palette: palette }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { onClick: () => setModalType(null), className: "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105", style: {
                                        background: `${palette.black1}10`,
                                        color: palette.black1,
                                    }, children: "Batal" }), _jsxs("button", { onClick: handleSaveEdit, className: "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2", style: {
                                        background: palette.primary,
                                        color: palette.white1,
                                    }, children: [_jsx(Save, { size: 18 }), "Simpan"] })] })] }) }), _jsx(Modal, { isOpen: modalType === "addAssistant", onClose: () => setModalType(null), title: "Kelola Guru Pendamping", palette: palette, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium opacity-80", children: "Tambah Guru Pendamping" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: newAssistant, onChange: (e) => setNewAssistant(e.target.value), placeholder: "Nama guru pendamping", className: "flex-1 px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2", style: {
                                                background: palette.white2,
                                                border: `1px solid ${palette.black1}20`,
                                                color: palette.black1,
                                            }, onKeyPress: (e) => e.key === "Enter" && handleAddAssistant() }), _jsx("button", { onClick: handleAddAssistant, disabled: !newAssistant.trim(), className: "px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                                background: palette.primary,
                                                color: palette.white1,
                                            }, children: _jsx(Plus, { size: 18 }) })] })] }), editData.assistants.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium opacity-80", children: "Guru Pendamping Saat Ini" }), _jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: editData.assistants.map((assistant, index) => (_jsx(AssistantItem, { assistant: assistant, onRemove: () => handleRemoveAssistant(index), palette: palette }, index))) })] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { onClick: () => setModalType(null), className: "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105", style: {
                                        background: `${palette.black1}10`,
                                        color: palette.black1,
                                    }, children: "Batal" }), _jsxs("button", { onClick: handleSaveAssistants, className: "flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2", style: {
                                        background: palette.primary,
                                        color: palette.white1,
                                    }, children: [_jsx(Save, { size: 18 }), "Simpan Perubahan"] })] })] }) })] }));
};
export default HomeroomTeacher;
