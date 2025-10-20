import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Clock } from "lucide-react";
export default function MasjidkuHomePrayerCard({ location, slug, className, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    // ============ Fetchers ============
    const getHijriDate = async () => {
        const today = new Date().toISOString().split("T")[0];
        const res = await axios.get(`https://api.myquran.com/v2/cal/hijr/?adj=-1&date=${today}`);
        const [day, hijri] = res.data.data.date;
        return `${day}, ${hijri}`;
    };
    const getPrayerSchedule = async () => {
        const base = "https://api.myquran.com/v2";
        const kota = 1301; // DKI Jakarta (contoh)
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const [resToday, resTomorrow] = await Promise.all([
            axios.get(`${base}/sholat/jadwal/${kota}/${today.toISOString().split("T")[0]}`),
            axios.get(`${base}/sholat/jadwal/${kota}/${tomorrow.toISOString().split("T")[0]}`),
        ]);
        const toDate = (hhmm, baseDate) => {
            const [h, m] = hhmm.split(":").map(Number);
            const d = new Date(baseDate);
            d.setHours(h, m, 0, 0);
            return d;
        };
        const J1 = resToday.data.data.jadwal;
        const J2 = resTomorrow.data.data.jadwal;
        const todayList = [
            { name: "Subuh", time: toDate(J1.subuh, today) },
            { name: "Dzuhur", time: toDate(J1.dzuhur, today) },
            { name: "Ashar", time: toDate(J1.ashar, today) },
            { name: "Maghrib", time: toDate(J1.maghrib, today) },
            { name: "Isya", time: toDate(J1.isya, today) },
        ];
        const subuhBesok = {
            name: "Subuh",
            time: toDate(J2.subuh, tomorrow),
        };
        return [...todayList, subuhBesok];
    };
    const { data: hijri, isLoading: loadingHijri } = useQuery({
        queryKey: ["hijri-date"],
        queryFn: getHijriDate,
        staleTime: 1000 * 60 * 60 * 3,
    });
    const { data: schedule, isLoading: loadingSchedule } = useQuery({
        queryKey: ["prayer-schedule"],
        queryFn: getPrayerSchedule,
        staleTime: 1000 * 60 * 15,
    });
    // ============ Logic Next Prayer ============
    const { next, isDuring } = useMemo(() => {
        if (!schedule)
            return { next: null, isDuring: false };
        // “During” = 15 menit setelah masuk waktu
        for (let i = 0; i < schedule.length; i++) {
            const t = schedule[i].time.getTime();
            const duringUntil = t + 15 * 60 * 1000;
            if (now.getTime() < t)
                return { next: schedule[i], isDuring: false };
            if (now.getTime() >= t && now.getTime() < duringUntil) {
                return { next: schedule[i], isDuring: true };
            }
        }
        // fallback: kalau sudah lewat semua, anggap next adalah item terakhir (Subuh besok)
        return { next: schedule[schedule.length - 1], isDuring: false };
    }, [now, schedule]);
    const countdown = useMemo(() => {
        if (!next)
            return "--:--";
        const target = isDuring
            ? new Date(next.time.getTime() + 15 * 60 * 1000)
            : next.time;
        const diff = target.getTime() - now.getTime();
        if (diff <= 0)
            return "00:00";
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return h > 0
            ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }, [now, next, isDuring]);
    // ============ UI ============
    return (_jsx(Link, { to: `/masjid/${slug}/sholat`, className: "block", children: _jsxs("div", { className: "w-full flex items-center justify-between rounded-xl px-4 py-3 ring-1 shadow-sm hover:opacity-95 transition", style: {
                background: theme.secondary, // tetap sesuai tema
                color: theme.white1, // semua teks utama putih
                borderColor: theme.silver1,
            }, children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx(Clock, { size: 18, className: "opacity-90" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-base font-semibold truncate", children: loadingSchedule || !next
                                        ? "Jadwal Sholat"
                                        : `Waktu ${isDuring ? "Berlangsung" : "Berikutnya"}: ${next.name}` }), _jsxs("p", { className: "text-base opacity-80 truncate", style: { color: theme.white1 }, children: [loadingHijri ? "Memuat…" : hijri, " \u2022 ", location, " \u2022", " ", loadingSchedule || !next
                                            ? "--:--"
                                            : next.time.toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })] })] })] }), _jsx("span", { className: "text-base font-semibold px-2 py-1 rounded-md shrink-0", style: {
                        background: theme.primary2,
                        color: theme.white1, // teks badge putih
                    }, children: countdown })] }) }));
}
