import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import PageHeader from "@/components/common/home/PageHeaderDashboard";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import InputField from "@/components/common/main/InputField"; // pastikan path-nya sesuai
export default function DKMEditProfileDKMTeacher() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data, isLoading } = useQuery({
        queryKey: ["masjid-profile-teacher-dkm", id],
        queryFn: async () => {
            const res = await axios.get(`/public/masjid-profile-teacher-dkm/${id}`);
            return res.data.data;
        },
        enabled: !!id,
    });
    const [form, setForm] = useState({});
    useEffect(() => {
        if (data) {
            setForm(data);
        }
    }, [data]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async () => {
        try {
            await axios.put(`/api/a/masjid-profile-teacher-dkm/${id}`, form);
            navigate("/dkm/pengajar");
        }
        catch (err) {
            console.error("Gagal update", err);
        }
    };
    if (isLoading || !data)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Edit Profil Pengajar", onBackClick: () => navigate(-1) }), _jsxs("div", { className: "space-y-4", children: [_jsx(InputField, { label: "Nama", name: "masjid_profile_teacher_dkm_name", value: form.masjid_profile_teacher_dkm_name, onChange: handleChange }), _jsx(InputField, { label: "Peran / Jabatan", name: "masjid_profile_teacher_dkm_role", value: form.masjid_profile_teacher_dkm_role, onChange: handleChange }), _jsx(InputField, { label: "Sambutan", name: "masjid_profile_teacher_dkm_message", as: "textarea", value: form.masjid_profile_teacher_dkm_message, onChange: handleChange }), _jsx(InputField, { label: "Deskripsi", name: "masjid_profile_teacher_dkm_description", as: "textarea", value: form.masjid_profile_teacher_dkm_description, onChange: handleChange }), _jsx(InputField, { label: "Gambar URL", name: "masjid_profile_teacher_dkm_image_url", value: form.masjid_profile_teacher_dkm_image_url, onChange: handleChange }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 rounded text-white", style: { backgroundColor: theme.primary }, children: "Simpan Perubahan" })] })] }));
}
