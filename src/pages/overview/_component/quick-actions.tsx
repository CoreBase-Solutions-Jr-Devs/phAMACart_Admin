import {
  Plus,
  Tag,
  Ticket,
  Image,
  MapPin,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Actions ────────────────────────────────────────────────────────────────
const ACTIONS = [
  { label: "Product", icon: Plus, href: "/products/create" },
  { label: "Category", icon: Tag, href: "/categories/create" },
  { label: "Coupon", icon: Ticket, href: "/coupons/create" },
  { label: "Banner", icon: Image, href: "/banners/create" },
  { label: "Locations", icon: MapPin, href: "/settings/locations" },
  { label: "Delivery", icon: Truck, href: "/settings/delivery" },
];

// ── Component ───────────────────────────────────────────────────────────────
const QuickActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.label}
            to={action.href}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/40 transition-colors"
          >
            <Icon size={12} />
            {action.label}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;