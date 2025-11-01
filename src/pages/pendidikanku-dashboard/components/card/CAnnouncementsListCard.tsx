import { Link } from "react-router-dom";
import { Bell, ChevronRight, Edit3, Trash2, Plus } from "lucide-react";
import {
  SectionCard,
  Btn,
  Badge,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

/* ================= Types ================= */
export interface Announcement {
  id: string;
  title: string;
  date: string; // ISO
  body: string;
  type?: "info" | "warning" | "success";
  slug?: string;
}

export interface AnnouncementsListCardProps<TSeeAllState = unknown> {
  palette: Palette;
  items: Announcement[];
  dateFmt?: (iso: string) => string;
  seeAllPath: string;
  seeAllState?: TSeeAllState;
  getDetailHref?: (a: Announcement) => string;
  getEditHref?: (a: Announcement) => string;
  onEdit?: (a: Announcement) => void;
  onDelete?: (a: Announcement) => void;
  showActions?: boolean;
  canAdd?: boolean;
  onAdd?: () => void;
  addHref?: string;
  deletingId?: string | null;
  className?: string;
}

/* ================= Utils ================= */
const generateSlug = (text: string): string =>
  (text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_—–]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const getBadgeVariant = (
  type?: "info" | "warning" | "success"
): "info" | "warning" | "success" => {
  switch (type) {
    case "warning":
      return "warning";
    case "success":
      return "success";
    default:
      return "info";
  }
};

const defaultDateFormat = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

/* ================= Subcomponents ================= */
const EmptyState = ({ palette }: { palette: Palette }) => (
  <div
    className="rounded-xl border p-4 text-sm"
    style={{ borderColor: palette.silver1, color: palette.black2 }}
  >
    Belum ada pengumuman.
  </div>
);

interface HeaderProps {
  palette: Palette;
  canAdd: boolean;
  onAdd?: () => void;
  addHref?: string;
  seeAllPath: string;
  seeAllState?: unknown;
}

const Header = ({
  palette,
  canAdd,
  onAdd,
  addHref,
  seeAllPath,
  seeAllState,
}: HeaderProps) => (
  <div
    className="p-4 md:p-5 pb-3 border-b"
    style={{ borderColor: palette.silver1 }}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="pb-1 font-medium flex items-center gap-2 md:-mt-1">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{
            background: palette.white3,
            color: palette.quaternary,
          }}
        >
          <Bell size={18} />
        </div>
        <h1 className="text-base font-semibold">Pengumuman</h1>
      </div>

      <div className="hidden md:flex flex-wrap items-center gap-2">
        {canAdd && (
          <>
            {onAdd ? (
              <Btn size="sm" palette={palette} onClick={onAdd}>
                <Plus className="mr-1" size={16} />
              </Btn>
            ) : addHref ? (
              <Link to={addHref}>
                <Btn size="sm" palette={palette}>
                  <Plus className="mr-1" size={16} />
                </Btn>
              </Link>
            ) : null}
          </>
        )}

        <Link to={seeAllPath} state={seeAllState}>
          <Btn variant="ghost" size="sm" palette={palette} className="gap-1">
            Lihat semua
            <ChevronRight size={16} />
          </Btn>
        </Link>
      </div>
    </div>
  </div>
);

interface AnnouncementCardProps {
  announcement: Announcement;
  palette: Palette;
  dateFmt: (iso: string) => string;
  detailHref: string;
  editHref: string;
  showActions: boolean;
  onEdit?: (a: Announcement) => void;
  onDelete?: (a: Announcement) => void;
  isDeleting: boolean;
}

const AnnouncementCard = ({
  announcement,
  palette,
  dateFmt,
  detailHref,
  editHref,
  showActions,
  onEdit,
  onDelete,
  isDeleting,
}: AnnouncementCardProps) => (
  <div
    className="rounded-xl border transition-all hover:translate-x-[1px]"
    style={{
      borderColor: palette.silver1,
      background: palette.white1,
    }}
  >
    <div className="p-3 sm:p-4 md:p-5 grid gap-3 md:gap-4 md:grid-cols-[1fr,auto]">
      {/* Content */}
      <Link to={detailHref} className="min-w-0 block">
        <div className="font-medium truncate">{announcement.title}</div>
        <div className="mt-0.5 text-sm" style={{ color: palette.black2 }}>
          {dateFmt(announcement.date)}
        </div>
        <p
          className="text-sm mt-2 line-clamp-3"
          style={{ color: palette.black2 }}
        >
          {announcement.body}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant={getBadgeVariant(announcement.type)} palette={palette}>
            {announcement.type ?? "info"}
          </Badge>
        </div>
      </Link>

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex items-center gap-2 justify-end">
          {onEdit && (
            <Btn
              size="sm"
              variant="outline"
              palette={palette}
              onClick={() => onEdit(announcement)}
            >
              <Edit3 size={14} />
            </Btn>
          )}
          {onDelete && (
            <Btn
              size="sm"
              variant="quaternary"
              palette={palette}
              onClick={() => onDelete(announcement)}
              disabled={isDeleting}
            >
              <Trash2 size={14} />
            </Btn>
          )}
        </div>
      )}
    </div>
  </div>
);

interface FooterProps {
  palette: Palette;
  seeAllPath: string;
  seeAllState?: unknown;
}

const Footer = ({ palette, seeAllPath, seeAllState }: FooterProps) => (
  <div className="px-4 pb-4 md:hidden">
    <Link to={seeAllPath} state={seeAllState}>
      <Btn
        size="sm"
        variant="ghost"
        palette={palette}
        className="w-full flex items-center justify-center gap-1"
      >
        Lihat semua
        <ChevronRight size={16} />
      </Btn>
    </Link>
  </div>
);

/* ================= Main Component ================= */
export default function AnnouncementsListCard<TSeeAllState = unknown>({
  palette,
  items,
  dateFmt = defaultDateFormat,
  seeAllPath,
  seeAllState,
  getDetailHref,
  getEditHref,
  onEdit,
  onDelete,
  showActions = false,
  canAdd = false,
  onAdd,
  addHref,
  deletingId,
  className = "",
}: AnnouncementsListCardProps<TSeeAllState>) {
  const isEmpty = !items || items.length === 0;

  return (
    <SectionCard palette={palette} className={className}>
      <Header
        palette={palette}
        canAdd={canAdd}
        onAdd={onAdd}
        addHref={addHref}
        seeAllPath={seeAllPath}
        seeAllState={seeAllState}
      />

      <div className="p-4 md:p-5 space-y-3">
        {isEmpty ? (
          <EmptyState palette={palette} />
        ) : (
          items.map((announcement) => {
            const slug = announcement.slug || generateSlug(announcement.title);
            const detailHref = getDetailHref
              ? getDetailHref(announcement)
              : `/pengumuman/${slug}`;
            const editHref = getEditHref?.(announcement) ?? detailHref;
            const isDeleting = deletingId === announcement.id;

            return (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                palette={palette}
                dateFmt={dateFmt}
                detailHref={detailHref}
                editHref={editHref}
                showActions={showActions}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            );
          })
        )}
      </div>

      <Footer
        palette={palette}
        seeAllPath={seeAllPath}
        seeAllState={seeAllState}
      />
    </SectionCard>
  );
}
