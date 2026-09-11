import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { StudentAvatar } from "@/components/student-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolvePack } from "@/lib/avatars";
import { SHOP_ITEMS, type ShopItem, type ShopItemType } from "@/lib/shop";
import { useClassStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS: { id: ShopItemType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shield", label: "Shields" },
  { id: "star", label: "Stars" },
  { id: "banner", label: "Banners" },
  { id: "frame", label: "Frames" },
  { id: "home", label: "Nest" },
];

interface ShopPanelProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  classId: string;
  studentId: string;
  studentName: string;
}

export function ShopPanel({
  open,
  onOpenChange,
  classId,
  studentId,
  studentName,
}: ShopPanelProps) {
  const buyItem = useClassStore((s) => s.buyItem);
  const equipBanner = useClassStore((s) => s.equipBanner);
  const equipFrame = useClassStore((s) => s.equipFrame);
  const studentPoints = useClassStore((s) => s.studentPoints);
  const studentSpent = useClassStore((s) => s.studentSpent);
  const studentWallet = useClassStore((s) => s.studentWallet);
  const student = useClassStore((s) => s.students.find((x) => x.id === studentId));
  const classroom = useClassStore((s) => s.classes.find((c) => c.id === classId));
  const earned = studentPoints(studentId);
  const spent = studentSpent(studentId);
  const wallet = studentWallet(studentId);
  const pack = resolvePack(classroom?.avatarPack);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");

  const items = SHOP_ITEMS.filter((i) => tab === "all" || i.type === tab);

  function buy(itemId: string) {
    const res = buyItem({ classId, studentId, itemId });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`Bought ${res.item.name}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex !flex max-h-[92dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 sm:px-5">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-accent" />
            Point Shop
          </DialogTitle>
          <DialogDescription>
            {studentName.split(" ")[0]} · wallet{" "}
            <span className="font-bold tabular-nums text-fg">{wallet}</span>
            <span className="text-muted-fg">
              {" "}
              · earned {earned} · spent {spent}
            </span>
          </DialogDescription>
        </DialogHeader>

        {student && (
          <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-2/40 px-4 py-3">
            <StudentAvatar
              avatarId={student.avatarId}
              name={student.name}
              pack={pack}
              points={earned}
              size="lg"
              stars={student.stars}
              frameId={student.frameId}
              bannerId={student.bannerId}
              shieldCharges={student.shieldCharges}
              showLevelBadge={false}
            />
            <p className="text-sm font-bold">{student.name.split(" ")[0]}</p>
          </div>
        )}

        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition",
                tab === t.id
                  ? "bg-accent text-accent-fg"
                  : "bg-surface-2 text-muted-fg hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div data-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((item) => (
              <ShopCard
                key={item.id}
                item={item}
                pts={wallet}
                student={student}
                onBuy={() => buy(item.id)}
                onEquipBanner={(id, off) => {
                  equipBanner(studentId, off ? null : id);
                  toast.message(off ? "Banner off" : "Banner on");
                }}
                onEquipFrame={(id, off) => {
                  equipFrame(studentId, off ? null : id);
                  toast.message(off ? "Frame off" : "Frame on");
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShopCard({
  item,
  pts,
  student,
  onBuy,
  onEquipBanner,
  onEquipFrame,
}: {
  item: ShopItem;
  pts: number;
  student:
    | {
        ownedBanners?: string[];
        ownedFrames?: string[];
        homeItems?: string[];
        bannerId?: string | null;
        frameId?: string | null;
        stars?: number;
      }
    | undefined;
  onBuy: () => void;
  onEquipBanner: (id: string, off: boolean) => void;
  onEquipFrame: (id: string, off: boolean) => void;
}) {
  const canAfford = pts >= item.cost;
  let owned = false;
  let equipped = false;
  if (student) {
    if (item.type === "banner") {
      owned = (student.ownedBanners ?? []).includes(item.id);
      equipped = student.bannerId === item.id;
    } else if (item.type === "frame") {
      owned = (student.ownedFrames ?? []).includes(item.id);
      equipped = student.frameId === item.id;
    } else if (item.type === "home") {
      owned = (student.homeItems ?? []).includes(item.id);
    } else if (item.type === "star") {
      owned = (student.stars ?? 0) >= (item.max ?? 5);
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 bg-surface-2/50",
        equipped ? "border-accent" : "border-border",
      )}
    >
      <div className="relative aspect-[5/3] bg-surface-3">
        <img
          src={item.src}
          alt=""
          className={cn(
            "size-full",
            item.type === "frame" ? "object-contain p-3" : "object-cover",
          )}
        />
        <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/70 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
          {item.badge}
        </span>
      </div>
      <div className="space-y-1.5 p-2.5">
        <p className="truncate text-sm font-bold">{item.name}</p>
        <p className="line-clamp-2 text-[11px] leading-snug text-muted-fg">
          {item.description}
        </p>
        {owned && item.type === "banner" ? (
          <Button
            size="sm"
            className="h-9 w-full"
            variant={equipped ? "default" : "secondary"}
            onClick={() => onEquipBanner(item.id, equipped)}
          >
            {equipped ? "Equipped" : "Equip"}
          </Button>
        ) : owned && item.type === "frame" ? (
          <Button
            size="sm"
            className="h-9 w-full"
            variant={equipped ? "default" : "secondary"}
            onClick={() => onEquipFrame(item.id, equipped)}
          >
            {equipped ? "Equipped" : "Equip"}
          </Button>
        ) : owned && item.type === "home" ? (
          <p className="py-1.5 text-center text-xs font-bold text-muted-fg">In nest</p>
        ) : (
          <Button
            size="sm"
            className="h-9 w-full tabular-nums"
            disabled={!canAfford || owned}
            onClick={onBuy}
          >
            {owned ? "Max" : `${item.cost} pts`}
          </Button>
        )}
      </div>
    </div>
  );
}
