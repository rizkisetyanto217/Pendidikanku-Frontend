import { jsx as _jsx } from "react/jsx-runtime";
import GenericAdminLayout from './GenericAdminLayout';
import { teacherDesktopDataSidebar } from '@/constants/sidebar/TeacherDekstopDataSidebar';
import { teacherMobileDataSidebar } from '@/constants/sidebar/TeacherMobileDataSidebar';
export default function TeacherLayout() {
    return (_jsx(GenericAdminLayout, { desktopSidebar: teacherDesktopDataSidebar, mobileSidebar: teacherMobileDataSidebar, topbarTitle: "Pengajar" }));
}
