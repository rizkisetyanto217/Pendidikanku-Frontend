import { jsx as _jsx } from "react/jsx-runtime";
import GenericAdminLayout from './GenericAdminLayout';
import { treasurerDesktopDataSidebar } from '@/constants/sidebar/TreasurerDekstopDataSidebar';
import { treasurerMobileDataSidebar } from '@/constants/sidebar/TreasurerMobileDataSidebar';
export default function TreasurerLayout() {
    return (_jsx(GenericAdminLayout, { desktopSidebar: treasurerDesktopDataSidebar, mobileSidebar: treasurerMobileDataSidebar, topbarTitle: "Pengajar" }));
}
