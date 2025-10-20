import { jsx as _jsx } from "react/jsx-runtime";
// layout/AdminDKMLayout.tsx
import { DKMDesktopDataSidebar } from '@/constants/sidebar/DKMDekstopDataSidebar';
import { DKMMobileDataSidebar } from '@/constants/sidebar/DKMMobileDataSidebar';
import GenericAdminLayout from './GenericAdminLayout';
export default function DKMLayout() {
    return (_jsx(GenericAdminLayout, { desktopSidebar: DKMDesktopDataSidebar, mobileSidebar: DKMMobileDataSidebar, topbarTitle: "DKM" }));
}
