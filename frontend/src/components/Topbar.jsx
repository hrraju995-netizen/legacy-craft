import { Phone } from "lucide-react";
import Link from "next/link";

const Topbar = ({ settings = {} }) => {
  // Admin-editable; falls back to the original copy when the API is down.
  const enabled = settings.topbar_enabled ?? true;
  const phone = settings.topbar_phone || "+8801897711118";
  const text =
    settings.topbar_text ||
    "( 9:00 AM to 9:00 PM ) For Shopping & Design Assistance";

  if (!enabled) return null;

  return (
    <div className="bg-primary text-white text-xs sm:text-sm py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-center">
        <Phone className="w-4 h-4 fill-white stroke-none" />

        <Link
          href={`tel:${phone}`}
          className="font-bold hover:underline tracking-wide"
        >
          {phone}
        </Link>

        <span className="text-white font-medium">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Topbar;