import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Search, Heart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllPropertyCMS } from "../../../../actions/property";
import { PropertyResult } from "../../../../types/property";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../../context/GoogleMapsProvider";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type SortKey = "match" | "low" | "high";
type ViewKey = "list" | "map";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  match: number;
  beds: number;
  baths: number;
  cars: number;
  type: string;
  pets: boolean;
  tags: string[];
  img: string;
  lat?: number; // from backend basic.latitude
  lng?: number; // from backend basic.longitude
  available_from?: string;
}

/* ── Map a raw API record to our display shape ── */
const mapApiProperty = (raw: PropertyResult): Property => {
  const basic = raw.property_details?.basic;
  const rent = raw.property_details?.rent_details as any;
  const features = raw.property_details?.features as any;
  const additional = raw.property_details?.additional_information as any;
  const documents = raw.property_details?.documents as any;

  /* Pick featured image → first image → placeholder */
  const images: any[] = documents?.images ?? [];
  const featuredImg =
    images.find((i: any) => i.is_featured)?.url ??
    images[0]?.url ??
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80";

  /* Build a small tag list */
  const tags: string[] = [];
  if (additional?.pets === "ALLOWED") tags.push("Pet friendly");
  if (rent?.available_from) {
    const availDate = new Date(rent.available_from);
    const now = new Date();
    if (availDate <= now) tags.push("Available now");
    else
      tags.push(
        `Available ${availDate.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`,
      );
  }
  if (rent?.rent_details_lease_terms)
    tags.push(`${rent.rent_details_lease_terms}-month lease`);

  return {
    id: raw._id,
    title: basic?.property_name ?? "Rental Property",
    location:
      [basic?.subrup, basic?.state].filter(Boolean).join(", ") ||
      basic?.full_address ||
      "Australia",
    price: Number(rent?.weekly_rent_price) || 0,
    match: 0,
    beds: Number(features?.no_of_bedrooms) || 0,
    baths: Number(features?.no_of_bathrooms) || 0,
    cars: Number(features?.no_of_garage) || 0,
    // explore API only populates property_type_id with name/description (no slug)
    type: (basic?.property_type_id as any)?.name?.toLowerCase() ?? "house",
    pets: additional?.pets === "ALLOWED",
    tags,
    img: featuredImg,
    lat: basic?.latitude ? Number(basic.latitude) : undefined,
    lng: basic?.longitude ? Number(basic.longitude) : undefined,
    available_from: rent?.available_from,
  };
};

const TAG_COLORS = [
  { bg: "#e4f5e8", color: "#326b43" },
  { bg: "#f1f6d9", color: "#66762e" },
  { bg: "#e7f0fc", color: "#2a5e9f" },
];

/* ─────────────────────────────────────────────
   SHARED TOKENS
───────────────────────────────────────────── */
const GREEN = "#075d51";
const BLUE = "#1761d7";
const INK = "#102a2a";
const MUTED = "#647472";
const LINE = "#dbe5e2";
const PAPER = "#f7faf8";
const SHADOW = "0 14px 36px rgba(16,42,42,.08)";

const wrap: React.CSSProperties = {
  width: "min(1440px, calc(100% - 48px))",
  margin: "0 auto",
};

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
  <article
    style={{
      background: "#fff",
      border: `1px solid ${LINE}`,
      borderRadius: 17,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 225,
        background:
          "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "sk-shimmer 1.5s infinite",
      }}
    />
    <div style={{ padding: 18 }}>
      {[80, 55, 100].map((w, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 7,
            background: "#f0f0f0",
            width: `${w}%`,
            marginBottom: 12,
          }}
        />
      ))}
    </div>
    <style>{`@keyframes sk-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </article>
);

const ACCESSIBILITY_OPTIONS = [
  "Step-free entry",
  "Lift access",
  "Accessible bathroom",
  "Wide doorways",
  "Ground floor",
];

const PASTEL_BG = [
  "bg-[#EBF1FA]",
  "bg-[#F9EFE6]",
  "bg-[#EAEBF9]",
  "bg-[#EAF3ED]",
  "bg-[#FCF6DC]",
  "bg-[#F7ECF4]",
];

/* ─────────────────────────────────────────────
   PROPERTY CARD
───────────────────────────────────────────── */
const PropertyCard = ({ p }: { p: Property }) => {
  const [saved, setSaved] = useState(false);
  const availTag = p.tags.find((t) => t.toLowerCase().includes("available"));
  const otherTags = p.tags.filter(
    (t) => !t.toLowerCase().includes("available"),
  );

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group">
      {/* Visual / Image Container */}
      <div className="h-48 w-full relative overflow-hidden bg-slate-50 flex items-center justify-center">
        {p.img && !p.img.includes("placeholder") ? (
          <img
            src={p.img}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              PASTEL_BG[Math.abs(p.id.charCodeAt(0) || 0) % PASTEL_BG.length]
            }`}
          >
            <svg
              className="w-14 h-14 text-gray-400/50 stroke-[1.2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        {/* Availability tag */}
        {availTag && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
            {availTag}
          </span>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          aria-label={`Save ${p.title}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-xl font-extrabold text-[#1E3A8A] tracking-tight">
              ${p.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 font-normal">per week</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 leading-snug line-clamp-1 mb-1">
            {p.title}
          </h3>

          {/* Location */}
          <p className="text-xs text-gray-500 mb-2 truncate">{p.location}</p>

          {/* Specs */}
          <div className="text-xs text-gray-600 font-medium mb-3 flex items-center gap-1.5">
            <span>{p.beds} bed</span>
            <span>·</span>
            <span>{p.baths} bath</span>
            {p.cars > 0 && (
              <>
                <span>·</span>
                <span>{p.cars} car</span>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
          {otherTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium bg-[#E8F8EE] text-[#15803D] px-2.5 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
          {p.pets &&
            !otherTags.some((t) => t.toLowerCase().includes("pet")) && (
              <span className="text-[11px] font-medium bg-[#E8F8EE] text-[#15803D] px-2.5 py-0.5 rounded-md">
                Pets considered
              </span>
            )}
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
   GOOGLE MAP VIEW
───────────────────────────────────────────── */
const GOOGLE_MAP_KEY = process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/* Default center: Australia */
const AUS_CENTER = { lat: -25.2744, lng: 133.7751 };

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f0" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#bde0f4" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#dde5e2" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d4edda" }],
  },
];

const MapView = ({ properties }: { properties: Property[] }) => {
  /* Reuse the single SDK load from the app-root GoogleMapsProvider
     (avoids the "Loader must not be called again" conflict) */
  const { isLoaded, loadError } = useGoogleMaps();

  const [activePin, setActivePin] = useState<string | null>(null);

  /* Properties that have coordinates from the backend */
  const pinned = useMemo(
    () => properties.filter((p) => p.lat && p.lng),
    [properties],
  );

  /* Compute map center: average of pinned coords, or AUS default */
  const center = useMemo(() => {
    if (pinned.length === 0) return AUS_CENTER;
    const avgLat = pinned.reduce((s, p) => s + p.lat!, 0) / pinned.length;
    const avgLng = pinned.reduce((s, p) => s + p.lng!, 0) / pinned.length;
    return { lat: avgLat, lng: avgLng };
  }, [pinned]);

  const containerStyle: React.CSSProperties = {
    minHeight: 590,
    border: `1px solid ${LINE}`,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  };

  /* ── Not loaded yet (a load error / missing key falls through to the error state below) ── */
  if (!isLoaded && !loadError && GOOGLE_MAP_KEY) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(25deg,#e6efe9,#f5f0df 42%,#dce8ee)",
        }}
      >
        <div style={{ textAlign: "center", color: MUTED }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: `3px solid ${LINE}`,
              borderTopColor: GREEN,
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          Loading map…
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ── API key missing or load error ── */
  if (loadError || !GOOGLE_MAP_KEY) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff4f4",
          flexDirection: "column",
          gap: 8,
          color: "#8b2020",
        }}
      >
        <span style={{ fontSize: 28 }}>⚠️</span>
        <strong>Map could not load</strong>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
          {loadError?.message ??
            "REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY is not set."}
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%", minHeight: 590 }}
        center={center}
        zoom={pinned.length > 0 ? 11 : 5}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {pinned.map((prop) => (
          <MarkerF
            key={prop.id}
            position={{ lat: prop.lat!, lng: prop.lng! }}
            onClick={() => setActivePin(prop.id)}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
              fillColor: BLUE,
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
              scale: 1.8,
              anchor: new window.google.maps.Point(12, 22),
            }}
          >
            {activePin === prop.id && (
              <InfoWindowF
                position={{ lat: prop.lat!, lng: prop.lng! }}
                onCloseClick={() => setActivePin(null)}
              >
                <div
                  style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    minWidth: 190,
                    maxWidth: 240,
                  }}
                >
                  {/* Thumbnail */}
                  {prop.img && (
                    <img
                      src={prop.img}
                      alt={prop.title}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 6,
                        marginBottom: 8,
                        display: "block",
                      }}
                    />
                  )}
                  <strong
                    style={{
                      fontSize: 13,
                      color: INK,
                      display: "block",
                      marginBottom: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {prop.title}
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      color: MUTED,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    ⦿ {prop.location}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      background: BLUE,
                      color: "white",
                      borderRadius: 6,
                      padding: "4px 9px",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    ${prop.price.toLocaleString()}/wk
                  </span>
                  <div style={{ marginTop: 6, fontSize: 11, color: "#455553" }}>
                    {prop.beds} bed &nbsp;&bull;&nbsp; {prop.baths} bath
                    {prop.cars > 0 && <> &nbsp;&bull;&nbsp; {prop.cars} car</>}
                  </div>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>

      {/* Bottom info strip */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 18,
          background: "white",
          padding: "10px 14px",
          borderRadius: 10,
          boxShadow: SHADOW,
          fontSize: 13,
          color: MUTED,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {pinned.length > 0
          ? `${pinned.length} of ${properties.length} properties on map`
          : "No coordinates available for current results"}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const FindProperty = () => {
  /* ── Filter state ── */
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [maxRent, setMaxRent] = useState(1500); // 1500 means Any / No max
  const [minBeds, setMinBeds] = useState<number>(0); // 0 = Any, 1 = 1+, 2 = 2+, 3 = 3+, 4 = 4+
  const [moveInDate, setMoveInDate] = useState("");
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(
    [],
  );
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [sort, setSort] = useState<SortKey>("match");
  const [view, setView] = useState<ViewKey>("list");

  /* ── API state ── */
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const accessibilityRef = useRef<HTMLDivElement | null>(null);

  // Close accessibility popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accessibilityRef.current &&
        !accessibilityRef.current.contains(event.target as Node)
      ) {
        setShowAccessibility(false);
      }
    };
    if (showAccessibility) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccessibility]);

  const fetchProperties = useCallback(
    async (pg: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = { page: pg, limit: LIMIT };

        /* ── Search ── */
        if (search.trim()) params.search = search.trim();

        /* ── Rent range ── */
        if (maxRent < 1500) params.end_price = String(maxRent);

        /* ── Bedrooms ── */
        if (minBeds > 0) params.bedrooms = String(minBeds);

        /* ── Sort ── */
        if (sort === "low") params.sort_by_price = "LTH";
        else if (sort === "high") params.sort_by_price = "HTL";

        const res = await getAllPropertyCMS(params);
        const raw: PropertyResult[] =
          res?.data ?? res?.result ?? res?.properties ?? [];
        const totalCount: number =
          res?.pagination?.total_records ??
          res?.total ??
          res?.totalCount ??
          raw.length;
        setProperties(raw.map(mapApiProperty));
        setTotal(totalCount);
        setPage(pg);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to load properties. Please try again.",
        );
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [search, maxRent, minBeds, sort],
  );

  /* Debounced fetch on filter change */
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchProperties(1), 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchProperties]);

  /* ── Client-side filter + sort ── */
  const visible = useMemo(() => {
    let list = properties.filter((p) => {
      /* Bedrooms */
      const matchBeds = minBeds === 0 || p.beds >= minBeds;

      /* Rent cap */
      const matchRent = maxRent >= 1500 || p.price <= maxRent;

      /* Move in date */
      const matchDate =
        !moveInDate ||
        !p.available_from ||
        new Date(p.available_from) <= new Date(moveInDate);

      /* Accessibility */
      const matchAccessibility =
        selectedAccessibility.length === 0 ||
        selectedAccessibility.some((acc) =>
          p.tags?.some((t) => t.toLowerCase().includes(acc.toLowerCase())),
        );

      return matchBeds && matchRent && matchDate && matchAccessibility;
    });

    if (sort === "low") list = list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list = list.sort((a, b) => b.price - a.price);

    return list;
  }, [properties, minBeds, maxRent, moveInDate, selectedAccessibility, sort]);

  const clearAll = () => {
    setSearch("");
    setSearchInput("");
    setMaxRent(1500);
    setMinBeds(0);
    setMoveInDate("");
    setSelectedAccessibility([]);
    setSort("match");
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main
      className="min-h-screen bg-[#F8FAFC]"
      style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        color: "#0F172A",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      {/* ── TOP SECTION (Hero + Filter Form Card) ────────────────────── */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] tracking-tight mb-2">
          Browse rentals
        </h1>

        {/* ── Filter Form Card (2 rows) ── */}
        <div className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-slate-200/80 p-5 sm:p-6 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput);
              fetchProperties(1);
            }}
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              {/* Suburb or postcode */}
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Suburb or postcode
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. Inner West, NSW or 2042"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setSearch("");
                      }}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Weekly rent */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Weekly rent
                </label>
                <div className="relative">
                  <select
                    value={maxRent}
                    onChange={(e) => setMaxRent(Number(e.target.value))}
                    className="w-full h-11 px-4 pr-9 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white appearance-none focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition cursor-pointer"
                  >
                    <option value={1500}>Any rent</option>
                    <option value={400}>Up to $400</option>
                    <option value={500}>Up to $500</option>
                    <option value={650}>Up to $650</option>
                    <option value={850}>Up to $850</option>
                    <option value={1000}>Up to $1,000</option>
                    <option value={1200}>Up to $1,200</option>
                    <option value={1500}>Up to $1,500+</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bedrooms
                </label>
                <div className="relative">
                  <select
                    value={minBeds}
                    onChange={(e) => setMinBeds(Number(e.target.value))}
                    className="w-full h-11 px-4 pr-9 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white appearance-none focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition cursor-pointer"
                  >
                    <option value={0}>Any</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Move in from */}
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Move in from
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition cursor-pointer"
                />
              </div>

              {/* Accessibility features */}
              <div className="md:col-span-4 relative" ref={accessibilityRef}>
                <button
                  type="button"
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  className={`w-full h-11 px-4 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                    selectedAccessibility.length > 0
                      ? "border-emerald-600 text-emerald-800 bg-emerald-50/50"
                      : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">
                    {selectedAccessibility.length > 0
                      ? `Accessibility (${selectedAccessibility.length})`
                      : "Accessibility features"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>

                {/* Accessibility Popover */}
                {showAccessibility && (
                  <div className="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">
                        Accessibility features
                      </span>
                      {selectedAccessibility.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedAccessibility([])}
                          className="text-[11px] text-blue-600 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {ACCESSIBILITY_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none py-1 hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAccessibility.includes(opt)}
                            onChange={() =>
                              setSelectedAccessibility((prev) =>
                                prev.includes(opt)
                                  ? prev.filter((o) => o !== opt)
                                  : [...prev, opt],
                              )
                            }
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-[#0F7A4A]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-right">
                      <button
                        type="button"
                        onClick={() => setShowAccessibility(false)}
                        className="text-xs font-bold text-white bg-[#0F7A4A] px-3 py-1.5 rounded-lg hover:bg-[#0c623b]"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[#0F7A4A] hover:bg-[#0c623b] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Match Percentage Blue Banner ── */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE]/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <p className="text-xs sm:text-sm text-[#1E40AF] font-medium leading-relaxed">
            See how well each home matches you. Match percentages appear after
            you sign in and publish a rental brief.
          </p>
          <a
            href="/login"
            className="shrink-0 px-6 py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-bold shadow-sm transition"
          >
            Sign in
          </a>
        </div>

        {/* ── Results Top Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? (
              "Finding rentals..."
            ) : (
              <>
                {visible.length} {visible.length === 1 ? "rental" : "rentals"}
                {search.trim() ? ` in ${search}` : ""}
              </>
            )}
          </h2>

          <div className="flex items-center gap-3">
            {/* List / Map toggle */}
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  view === "list"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  view === "map"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Map
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white appearance-none cursor-pointer focus:outline-none focus:border-emerald-600 shadow-sm"
              >
                <option value="match">Sort: Newest</option>
                <option value="low">Sort: Rent (low to high)</option>
                <option value="high">Sort: Rent (high to low)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        {view === "list" ? (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6 flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => fetchProperties(page)}
                  className="px-3 py-1 bg-white border border-red-300 rounded-lg text-xs font-semibold"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : visible.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((p) => (
                  <PropertyCard key={p.id} p={p} />
                ))}
              </div>
            ) : !error ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No rentals match those filters
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Try broadening your search or resetting your filters.
                </p>
                <button
                  onClick={clearAll}
                  className="px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : null}

            {/* Circular Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 mb-8">
                {page > 1 && (
                  <button
                    onClick={() => fetchProperties(page - 1)}
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs font-bold transition shadow-sm"
                  >
                    ←
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchProperties(p)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition shadow-sm ${
                        p === page
                          ? "bg-[#1E40AF] text-white"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                {page < totalPages && (
                  <button
                    onClick={() => fetchProperties(page + 1)}
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center text-xs font-bold transition shadow-sm"
                  >
                    →
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mb-12">
            <MapView properties={visible} />
          </div>
        )}
      </section>
    </main>
  );
};

export default FindProperty;
