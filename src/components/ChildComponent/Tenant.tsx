import React from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../custom-hooks/use-toast";

type User = {
  name: string;
  image?: string;
  gender?: string;
  user_name?: string;
  userName?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
};

type TenantProps = {
  id: string;
  user: User;
  type?: string;
  location: string;
  title?: string;
  beds?: number;
  baths?: number;
  sqm?: String;
  postedDate?: Date | any;
  moveInDate?: string;
  price: string | number;
  isUrgent?: boolean;
  matchPercentage?: number;
  tags?: string[];
  index?: number;
};

const AVATAR_THEMES = [
  { bg: "bg-[#E8F8EE]", text: "text-[#15803D]" }, // Mint
  { bg: "bg-[#EEF4FF]", text: "text-[#1E40AF]" }, // Soft Blue
  { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]" }, // Soft Purple
];

const DUMMY_MATCHES = [94, 91, 88, 95, 92, 89];

const DEFAULT_TAG_SETS = [
  ["Budget fits", "Preferred suburb", "Dates align"],
  ["Budget fits", "Pets considered", "Dates align"],
  ["Budget fits", "Property type", "Lease length"],
];

const Tenant: React.FC<TenantProps> = ({
  id,
  user,
  location,
  postedDate,
  moveInDate,
  price,
  matchPercentage,
  tags,
  index = 0,
}) => {
  const navigate = useNavigate();

  const handleRedirectFilter = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate(`/tenant-post-details/${id}`);
    } else {
      toast({
        title: `Please Login to your account`,
        description: `Explore the advance search & other features.`,
        variant: "success",
      });
      navigate("/login");
    }
  };

  // 1. Initials from unique renter name / username
  const getInitials = (): string => {
    const rawUsername = (
      user.user_name ||
      user.userName ||
      user.member_id ||
      ""
    ).trim();
    if (
      rawUsername.toUpperCase().includes("RM-") ||
      rawUsername.toUpperCase().startsWith("RM")
    ) {
      return "RM";
    }
    const first = user.first_name || user.firstName;
    const last = user.last_name || user.lastName;
    if (first && last && first !== "Renter") {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
    if (first && first !== "Renter" && first.trim().length >= 2) {
      return first.trim().slice(0, 2).toUpperCase();
    }
    if (
      user.name &&
      user.name !== "Anonymous" &&
      !user.name.toLowerCase().startsWith("renter")
    ) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      if (parts[0].length >= 2) {
        return parts[0].slice(0, 2).toUpperCase();
      }
    }
    if (rawUsername) {
      const clean = rawUsername
        .replace(/^Renter\s*/i, "")
        .replace(/[^a-zA-Z0-9]/g, "");
      if (clean.length >= 2) return clean.slice(0, 2).toUpperCase();
    }
    if (id && id.length >= 2) {
      return id.slice(-2).toUpperCase();
    }
    return "RM";
  };

  // 2. Username instead of real name
  const getDisplayUsername = (): string => {
    const raw = (
      user.user_name ||
      user.userName ||
      user.member_id ||
      ""
    ).trim();
    if (raw) {
      if (raw.toLowerCase().startsWith("renter")) {
        return raw;
      }
      return `Renter ${raw}`;
    }
    const shortId = id ? id.slice(-4).toUpperCase() : "4812";
    return `Renter RM-${shortId}`;
  };

  // 3. Format Price
  const formatPrice = (): string => {
    if (!price || price === "N/A" || price === "$N/A") {
      return "Budget on request";
    }
    const str = String(price).trim();
    if (str.toLowerCase().includes("per week")) {
      return str;
    }
    if (str.includes("-")) {
      return `${str.replace("-", "to")} per week`;
    }
    return `${str} per week`;
  };

  // 4. Format Move-In timing
  const formatMoveIn = (): string => {
    if (moveInDate) return moveInDate;
    if (postedDate) {
      const d = new Date(postedDate);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "short" });
        return `Move in by ${day} ${month}`;
      }
      return `Move in: ${postedDate}`;
    }
    return "Move in available now";
  };

  const avatarTheme = AVATAR_THEMES[Math.abs(index) % AVATAR_THEMES.length];
  const displayMatch =
    matchPercentage || DUMMY_MATCHES[Math.abs(index) % DUMMY_MATCHES.length];
  const displayTags =
    tags && tags.length > 0
      ? tags
      : DEFAULT_TAG_SETS[Math.abs(index) % DEFAULT_TAG_SETS.length];

  return (
    <div className="bg-white rounded-[22px] p-6 border border-slate-100 shadow-[0_2px_14px_rgba(16,42,42,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Top Header: Initials Avatar + Username + Match % Badge */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm tracking-wider shrink-0 ${avatarTheme.bg} ${avatarTheme.text}`}
            >
              {getInitials()}
            </div>
            <h3
              className="font-bold text-slate-900 text-[15px] truncate"
              title={getDisplayUsername()}
            >
              {getDisplayUsername()}
            </h3>
          </div>
          {/* <div className="bg-[#E8F8EE] text-[#15803D] border border-emerald-100 font-semibold text-xs px-2.5 py-1 rounded-full shrink-0">
            {displayMatch}% match
          </div> */}
        </div>

        {/* Details: Location, Budget, Move-In */}
        <div className="space-y-1.5 text-sm mb-5">
          <p className="text-slate-600 font-normal truncate" title={location}>
            {location || "Preferred locations"}
          </p>
          <p className="text-slate-700 font-medium">{formatPrice()}</p>
          <p className="text-slate-500 font-normal">{formatMoveIn()}</p>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {displayTags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#E8F8EE] text-[#15803D] text-xs font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Lock Button */}
      <button
        type="button"
        onClick={handleRedirectFilter}
        className="w-full py-2.5 px-4 rounded-xl bg-[#F0F4FA] hover:bg-[#E2E8F0] text-[#1E40AF] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" />
        <span>Full profile after the renter accepts</span>
      </button>
    </div>
  );
};

export default Tenant;
