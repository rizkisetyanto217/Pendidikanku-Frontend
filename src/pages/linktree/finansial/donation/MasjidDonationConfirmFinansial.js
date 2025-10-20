import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/axios";
import axios from "axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import CommonActionButton from "@/components/common/main/CommonActionButton";
const MasjidDonationConfirmMasjid = () => {
    const [searchParams] = useSearchParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const masjidDonation = Number(searchParams.get("masjid")) || 0;
    const masjidkuDonation = Number(searchParams.get("masjidku")) || 0;
    const [donationName, setDonationName] = useState("");
    const [donationMessage, setDonationMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const path = window.location.pathname;
    const slugMatch = path.match(/\/masjid\/([^\/]+)\//);
    const slug = slugMatch?.[1];
    const fee = 4000;
    const total = masjidDonation + masjidkuDonation + fee;
    const navigate = useNavigate();
    const theme = pickTheme(themeName, isDark);
    const format = (n) => `Rp ${new Intl.NumberFormat("id-ID").format(n)}`;
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "Mid-client-l1lXV0xwBLRhI_62");
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    const handlePayment = async () => {
        if (!slug) {
            alert("Slug masjid tidak ditemukan.");
            return;
        }
        const donationData = {
            donation_name: donationName,
            donation_message: donationMessage,
            donation_amount_masjid: masjidDonation,
            donation_amount_masjidku: masjidkuDonation,
        };
        setIsLoading(true); // 👈 mulai loading
        // ✅ Log sebelum request
        console.log("📤 POST to:", `/public/donations/${slug}`);
        console.log("📤 Payload:", donationData);
        try {
            const response = await api.post(`/public/donations/${slug}`, donationData, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            // ✅ Log response sukses
            console.log("✅ Response:", response.data);
            if (response.status === 200) {
                const snapToken = response.data.snap_token;
                if (window.snap) {
                    window.snap.pay(snapToken, {
                        onSuccess: () => {
                            if (slug) {
                                navigate(`/masjid/${slug}`);
                            }
                            else {
                                navigate("/"); // fallback kalau slug tidak ditemukan
                            }
                        },
                        onPending: () => alert("Pembayaran sedang diproses..."),
                        onError: () => alert("Pembayaran gagal. Silakan coba lagi."),
                    });
                }
                else {
                    alert("Payment system not ready. Please refresh the page.");
                }
            }
        }
        catch (error) {
            // ✅ Log error detail
            console.error("❌ Error during POST donation:", error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("❌ Error Response:", error.response.data);
                    const message = error.response.data?.error ||
                        error.response.data?.message ||
                        "Server error";
                    alert(`❌ Server Error (${error.response.status}): ${message}`);
                }
                else if (error.request) {
                    console.error("❌ Error Request:", error.request);
                    alert("❌ Network Error: Tidak dapat terhubung ke server");
                }
                else {
                    alert(`❌ Request Error: ${error.message}`);
                }
            }
            else {
                alert("❌ Unknown Error");
            }
        }
        finally {
            setIsLoading(false); // 👈 selesai loading
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Donasi Saya", onBackClick: () => {
                    if (window.history.length > 1)
                        navigate(-1);
                } }), _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("p", { className: "text-sm mb-3", style: { color: theme.black2 }, children: "Berikut adalah rincian donasi detail" }), _jsx("div", { className: "overflow-x-auto rounded border", style: { borderColor: theme.silver1 }, children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { style: {
                                            backgroundColor: theme.white2,
                                            color: theme.black1,
                                        }, children: [_jsx("th", { className: "p-3", children: "No" }), _jsx("th", { className: "p-3", children: "Deskripsi" }), _jsx("th", { className: "p-3 text-right", children: "Rincian" })] }) }), _jsxs("tbody", { style: { color: theme.black1 }, children: [_jsxs("tr", { children: [_jsx("td", { className: "p-3", children: "1" }), _jsx("td", { className: "p-3", children: "Nominal Donasi" }), _jsx("td", { className: "p-3 text-right", children: format(masjidDonation) })] }), _jsxs("tr", { children: [_jsx("td", { className: "p-3", children: "2" }), _jsx("td", { className: "p-3", children: "Biaya Transaksi" }), _jsx("td", { className: "p-3 text-right", children: format(fee) })] }), _jsxs("tr", { children: [_jsx("td", { className: "p-3", children: "3" }), _jsx("td", { className: "p-3", children: "Dukungan Perkembangan Aplikasi" }), _jsx("td", { className: "p-3 text-right", children: format(masjidkuDonation) })] }), _jsxs("tr", { className: "font-semibold", style: { backgroundColor: theme.success2 }, children: [_jsx("td", { className: "p-3", colSpan: 2, children: "Total Transfer" }), _jsx("td", { className: "p-3 text-right", children: format(total) })] })] })] }) }), _jsxs("p", { className: "text-xs leading-relaxed", style: { color: theme.silver2 }, children: ["* Biaya transaksi digunakan untuk kebutuhan sistem pembayaran.", _jsx("br", {}), "* Dukungan perkembangan aplikasi digunakan untuk operasional dan pengembangan fitur Masjidku."] })] }), _jsxs("div", { className: "mt-4 max-w-md mx-auto space-y-3", children: [_jsx("input", { type: "text", placeholder: "Nama Anda (opsional)", value: donationName, onChange: (e) => setDonationName(e.target.value), className: "w-full p-3 rounded-md border text-sm outline-none transition-all duration-200", style: {
                            borderColor: theme.silver1,
                            backgroundColor: theme.white1,
                            color: theme.black1,
                        }, onFocus: (e) => (e.currentTarget.style.borderColor = theme.primary), onBlur: (e) => (e.currentTarget.style.borderColor = theme.silver1) }), _jsx("textarea", { placeholder: "Ucapan atau pesan (opsional)", value: donationMessage, onChange: (e) => setDonationMessage(e.target.value), className: "w-full p-3 rounded-md border text-sm outline-none transition-all duration-200", rows: 3, style: {
                            borderColor: theme.silver1,
                            backgroundColor: theme.white1,
                            color: theme.black1,
                        }, onFocus: (e) => (e.currentTarget.style.borderColor = theme.primary), onBlur: (e) => (e.currentTarget.style.borderColor = theme.silver1) })] }), _jsx("div", { className: "fixed bottom-0 left-0 w-full px-4 py-4 border-t shadow-md", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver1,
                }, children: _jsx("div", { className: "max-w-xl mx-auto", children: _jsx(CommonActionButton, { text: "Lanjut", onClick: handlePayment, className: "w-full py-3", disabled: isLoading }) }) })] }));
};
export default MasjidDonationConfirmMasjid;
