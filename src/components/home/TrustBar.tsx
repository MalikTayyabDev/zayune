import {
  Flower2,
  HandHeart,
  MessageCircle,
  Palette,
  Truck,
} from "lucide-react";
import { Icon } from "@/components/ui/Icon";

const items = [
  {
    title: "Crochet, by hand",
    body: "Every stitch formed in our Pakistan studio",
    icon: Flower2,
  },
  {
    title: "Handmade accessories",
    body: "Flowers, jewelry, keychains & keepsakes",
    icon: HandHeart,
  },
  {
    title: "Custom colorways",
    body: "Your palette — we crochet it for you",
    icon: Palette,
  },
  {
    title: "Nationwide shipping",
    body: "Delivered across Pakistan",
    icon: Truck,
  },
  {
    title: "WhatsApp support",
    body: "Order help when you need it",
    icon: MessageCircle,
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-stone bg-stone/25">
      <div className="container-content grid grid-cols-2 gap-6 py-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center border border-stone bg-porcelain">
              <Icon icon={item.icon} size={18} />
            </span>
            <p className="text-nav text-aubergine">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-aubergine/55">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
