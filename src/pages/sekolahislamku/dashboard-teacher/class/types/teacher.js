// src/pages/sekolahislamku/api/teacher.ts
export const TEACHER_HOME_QK = ["teacher-home"];
// ================= Helpers =================
const startOfDay = (d = new Date()) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};
const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};
// sementara masih mock; ganti ke axios nanti
export async function fetchTeacherHome() {
    const now = new Date();
    const iso = now.toISOString();
    const todayClasses = [
        {
            id: "tc1",
            time: "07:30",
            className: "TPA A",
            subject: "Tahsin",
            room: "Aula 1",
            studentCount: 22,
            status: "ongoing",
        },
        {
            id: "tc2",
            time: "09:30",
            className: "TPA B",
            subject: "Hafalan Juz 30",
            room: "R. Tahfiz",
            studentCount: 20,
            status: "upcoming",
        },
    ];
    // 🔹 Generate upcoming 7 hari (hari ini s/d +6) dari template todayClasses
    const baseDate = startOfDay(now);
    const upcomingClasses = Array.from({ length: 7 }).flatMap((_, i) => {
        const dIso = startOfDay(addDays(baseDate, i)).toISOString();
        return todayClasses.map((c) => ({
            ...c,
            // beri id unik per tanggal (supaya aman dipakai sebagai key)
            id: `${c.id}-${dIso.slice(0, 10)}`,
            dateISO: dIso,
            // status default untuk jadwal mendatang
            status: i === 0 ? c.status : "upcoming",
        }));
    });
    return {
        hijriDate: "16 Muharram 1447 H",
        gregorianDate: iso,
        todayClasses,
        announcements: [
            {
                id: "a1",
                title: "Tryout Ujian Tahfiz",
                date: iso,
                body: "Tryout internal hari Kamis. Mohon siapkan rubrik penilaian makhraj & tajwid.",
                type: "info",
            },
            {
                id: "a2",
                title: "Rapat Kurikulum",
                date: iso,
                body: "Rapat kurikulum pekan depan. Draft silabus sudah di folder bersama.",
                type: "success",
            },
        ],
        upcomingClasses,
    };
}
