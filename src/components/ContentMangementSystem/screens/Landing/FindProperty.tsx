import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { getAllPropertyCMS } from "../../../../actions/property";
import { PropertyResult } from "../../../../types/property";
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
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
  lat?: number;   // from backend basic.latitude
  lng?: number;   // from backend basic.longitude
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
        `Available ${availDate.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`
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

/* ─────────────────────────────────────────────
   PROPERTY CARD
───────────────────────────────────────────── */
const PropertyCard = ({ p }: { p: Property }) => {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      style={{
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 17,
        overflow: "hidden",
        boxShadow: hovered ? SHADOW : "0 5px 18px rgba(16,42,42,.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <div
        style={{
          height: 225,
          position: "relative",
          background: `#e8eeeb url("${p.img}") center/cover no-repeat`,
        }}
      >
        {/* Match badge – only show when score is available */}
        {p.match > 0 && (
          <span
            style={{
              position: "absolute",
              top: 13,
              left: 13,
              background: "#ecf8e6",
              color: "#3f6d2a",
              border: "1px solid #d1e7c7",
              borderRadius: 8,
              padding: "7px 10px",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {p.match}% match
          </span>
        )}
        {/* Property type badge */}
        <span
          style={{
            position: "absolute",
            top: 13,
            left: 13,
            background: "rgba(7,93,81,0.85)",
            color: "#fff",
            borderRadius: 8,
            padding: "6px 10px",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "capitalize",
          }}
        >
          {p.type}
        </span>
        {/* Save button */}
        <button
          onClick={() => setSaved((s) => !s)}
          aria-label={`Save ${p.title}`}
          style={{
            position: "absolute",
            right: 13,
            top: 13,
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: saved ? `1px solid ${BLUE}` : "1px solid #d4dedb",
            background: saved ? BLUE : "rgba(255,255,255,.95)",
            color: saved ? "white" : INK,
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            transition: "background .2s, color .2s",
          }}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: 18 }}>
        <h3
          style={{
            fontFamily: "Manrope,sans-serif",
            fontWeight: 700,
            fontSize: 19,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            margin: "0 0 7px",
            color: INK,
          }}
        >
          {p.title}
        </h3>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
          ⌖ {p.location}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "Manrope,sans-serif",
              fontWeight: 800,
              fontSize: 20,
              marginRight: "auto",
              color: INK,
            }}
          >
            ${p.price.toLocaleString()}/wk
          </span>
          {[
            {
              label: `${p.beds} bed`,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 4 }}>
                  <path d="M2 4v16"/>
                  <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
                  <path d="M2 17h20"/>
                  <path d="M6 8v9"/>
                </svg>
              ),
            },
            {
              label: `${p.baths} bath`,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 4 }}>
                  <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
                  <line x1="10" x2="8" y1="5" y2="7"/>
                  <line x1="2" x2="22" y1="12" y2="12"/>
                  <line x1="7" x2="7" y1="19" y2="21"/>
                  <line x1="17" x2="17" y1="19" y2="21"/>
                </svg>
              ),
            },
            {
              label: `${p.cars} car`,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 4 }}>
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                  <circle cx="7" cy="17" r="2"/>
                  <path d="M9 17h6"/>
                  <circle cx="17" cy="17" r="2"/>
                </svg>
              ),
            },
          ].map((item) => (
              <span key={item.label} style={{ fontSize: 12, color: "#455553", display: "inline-flex", alignItems: "center" }}>
                {item.icon}
                {item.label}
              </span>
            )
          )}
        </div>
        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 15 }}>
          {p.tags.map((t, i) => (
            <span
              key={t}
              style={{
                padding: "6px 9px",
                borderRadius: 7,
                fontSize: 11,
                background: TAG_COLORS[i % 3].bg,
                color: TAG_COLORS[i % 3].color,
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
   GOOGLE MAP VIEW
───────────────────────────────────────────── */
const GOOGLE_MAP_KEY =
  process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/* Default center: Australia */
const AUS_CENTER = { lat: -25.2744, lng: 133.7751 };

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f0" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#bde0f4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#dde5e2" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d4edda" }] },
];

const MapView = ({ properties }: { properties: Property[] }) => {
  /* Reuse the single SDK load from the app-root GoogleMapsProvider
     (avoids the "Loader must not be called again" conflict) */
  const { isLoaded, loadError } = useGoogleMaps();

  const [activePin, setActivePin] = useState<string | null>(null);

  /* Properties that have coordinates from the backend */
  const pinned = useMemo(
    () => properties.filter((p) => p.lat && p.lng),
    [properties]
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
          {loadError?.message ?? "REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY is not set."}
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
                  <span style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 6 }}>
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
  const [maxRent, setMaxRent] = useState(1500);
  const [beds, setBeds] = useState<number[]>([]);
  const [baths, setBaths] = useState<number[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [petsOnly, setPetsOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("match");
  const [view, setView] = useState<ViewKey>("list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── API state ── */
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

        /* ── Bedrooms: multi-select → comma-separated; val=4 means "4+" ──
           Backend field name: bedrooms (single value supported by CMS API).
           When multiple are selected we fall back to client-side filtering,
           but still send the lowest selected so the backend narrows results. */
        if (beds.length > 0) {
          const hasPlus = beds.includes(4);          // "4+" checkbox
          const specific = beds.filter((b) => b < 4);
          if (specific.length === 1 && !hasPlus) {
            // single exact value
            params.bedrooms = String(specific[0]);
          } else if (hasPlus && specific.length === 0) {
            // only "4+" checked → send 4 as minimum
            params.bedrooms = "4";
          }
          // Multiple mixed → don't send, client-side filter handles it
        }

        /* ── Bathrooms: same pattern ── */
        if (baths.length > 0) {
          const hasPlus = baths.includes(3);          // "3+" checkbox
          const specific = baths.filter((b) => b < 3);
          if (specific.length === 1 && !hasPlus) {
            params.bathrooms = String(specific[0]);
          } else if (hasPlus && specific.length === 0) {
            params.bathrooms = "3";
          }
        }

        /* ── Property type: single type supported by API ── */
        if (types.length === 1) {
          params.type = types[0];
        }
        // Multiple types → client-side filter handles it

        /* ── Pets: use location param isn't right; pets filtering is
           done client-side since "pets" isn't in the CMS API whitelist ── */

        /* ── Sort ── */
        /* backend explore endpoint expects sort_by_price = LTH | HTL */
        if (sort === "low") params.sort_by_price = "LTH";
        else if (sort === "high") params.sort_by_price = "HTL";

        const res = await getAllPropertyCMS(params);
        const raw: PropertyResult[] = res?.data ?? res?.result ?? res?.properties ?? [];
        const totalCount: number = res?.pagination?.total_records ?? res?.total ?? res?.totalCount ?? raw.length;
        setProperties(raw.map(mapApiProperty));
        setTotal(totalCount);
        setPage(pg);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load properties. Please try again."
        );
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [search, maxRent, beds, baths, types, petsOnly, sort]
  );

  /* Debounced fetch on filter change */
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchProperties(1), 400);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [fetchProperties]);

  /* ── Client-side filter + sort
       Handles multi-selection and pets which the API doesn't support natively ── */
  const visible = useMemo(() => {
    let list = properties.filter((p) => {
      /* Bedrooms: val=4 means "4 or more" */
      const matchBeds =
        beds.length === 0 ||
        beds.some((b) => (b === 4 ? p.beds >= 4 : p.beds === b));

      /* Bathrooms: val=3 means "3 or more" */
      const matchBaths =
        baths.length === 0 ||
        baths.some((b) => (b === 3 ? p.baths >= 3 : p.baths === b));

      /* Property type: match any selected type */
      const matchType = types.length === 0 || types.includes(p.type);

      /* Pets */
      const matchPets = !petsOnly || p.pets;

      /* Rent cap (in case API returned records above the slider) */
      const matchRent = maxRent >= 1500 || p.price <= maxRent;

      return matchBeds && matchBaths && matchType && matchPets && matchRent;
    });

    if (sort === "low") list = list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list = list.sort((a, b) => b.price - a.price);

    return list;
  }, [properties, beds, baths, types, petsOnly, maxRent, sort]);

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const clearAll = () => {
    setSearch("");
    setSearchInput("");
    setMaxRent(1500);
    setBeds([]);
    setBaths([]);
    setTypes([]);
    setPetsOnly(false);
    setSort("match");
  };

  const totalPages = Math.ceil(total / LIMIT);

  /* ── Checkbox helpers ── */
  const BedCheck = ({ val, label }: { val: number; label: string }) => (
    <label style={checkLabel}>
      <input
        type="checkbox"
        checked={beds.includes(val)}
        onChange={() => setBeds((b) => toggleArr(b, val))}
        style={{ width: 16, height: 16, accentColor: GREEN }}
      />
      {label}
    </label>
  );
  const BathCheck = ({ val, label }: { val: number; label: string }) => (
    <label style={checkLabel}>
      <input
        type="checkbox"
        checked={baths.includes(val)}
        onChange={() => setBaths((b) => toggleArr(b, val))}
        style={{ width: 16, height: 16, accentColor: GREEN }}
      />
      {label}
    </label>
  );
  const TypeCheck = ({ val }: { val: string }) => (
    <label style={checkLabel}>
      <input
        type="checkbox"
        checked={types.includes(val)}
        onChange={() => setTypes((t) => toggleArr(t, val))}
        style={{ width: 16, height: 16, accentColor: GREEN }}
      />
      {val.charAt(0).toUpperCase() + val.slice(1)}
    </label>
  );

  return (
    <main
      style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        color: INK,
        background: "#fff",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      {/* ── HERO ─────────────────────────────────── */}
      <section
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #f0f8f4 0%, #f7fbf8 60%, #eaf4ed 100%)",
          borderBottom: `1px solid ${LINE}`,
          padding: "56px 0 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background ambient glows */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -120,
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(circle, rgba(23,97,215,0.06) 0%, rgba(255,255,255,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: -90,
            width: 480,
            height: 260,
            border: "1px solid #cfe3d6",
            borderRadius: "55% 20% 0 0",
            transform: "rotate(-7deg)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            ...wrap,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: 9999,
              background: "rgba(7, 93, 81, 0.08)",
              border: "1px solid rgba(7, 93, 81, 0.16)",
              color: GREEN,
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Find your next home
          </div>
          <h1
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px, 4.5vw, 54px)",
              lineHeight: 1.15,
              margin: "0 0 14px",
              letterSpacing: "-0.04em",
              color: "#0f172a",
              maxWidth: 820,
            }}
          >
            Rentals matched to what matters
          </h1>
          <p
            style={{
              color: MUTED,
              fontSize: "clamp(16px, 1.8vw, 18px)",
              margin: "0 0 32px",
              maxWidth: 620,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            Search available rentals and see how well each property fits your preferences.
          </p>

          {/* Redesigned Centered Search bar */}
          <form
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 720,
              background: "#ffffff",
              border: "2px solid #cbd5e1",
              borderRadius: 9999,
              padding: "8px 8px 8px 24px",
              boxShadow: "0 20px 40px -12px rgba(7, 93, 81, 0.14), 0 4px 16px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: GREEN,
                marginRight: 12,
                flexShrink: 0,
              }}
            >
              <Search className="w-5 h-5 text-emerald-700" />
            </div>
            <input
              type="search"
              placeholder="Suburb, postcode or region"
              aria-label="Search suburb, postcode or region"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1,
                border: 0,
                outline: 0,
                minWidth: 100,
                padding: "8px 4px",
                color: "#0f172a",
                background: "transparent",
                fontFamily: "inherit",
                fontSize: 16,
                fontWeight: 500,
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                }}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontSize: 16,
                  lineHeight: 1,
                  marginRight: 6,
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              style={{
                minWidth: 120,
                height: 46,
                border: 0,
                borderRadius: 9999,
                background: "linear-gradient(135deg, #1761d7 0%, #0d4bb3 100%)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 15,
                letterSpacing: "0.02em",
                boxShadow: "0 4px 14px rgba(23, 97, 215, 0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────── */}
      <section style={{ padding: "30px 0 80px" }}>
        <div
          style={{
            ...wrap,
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 30,
            alignItems: "start",
          }}
          className="fp-layout"
        >
          {/* ── SIDEBAR ── */}
          <aside>
            {/* Mobile toggle */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              style={{
                display: "none",
                width: "100%",
                border: `1px solid ${LINE}`,
                background: "white",
                borderRadius: 10,
                padding: 11,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                marginBottom: 16,
                fontSize: 14,
              }}
              className="fp-filter-mobile-btn"
              aria-expanded={filtersOpen}
            >
              {filtersOpen ? "× Hide filters" : "☷ Show filters"}
            </button>

            <div
              style={{
                position: "sticky",
                top: 96,
                border: `1px solid ${LINE}`,
                borderRadius: 18,
                padding: 20,
                background: "#fff",
                boxShadow: "0 8px 28px rgba(16,42,42,.04)",
              }}
              className={`fp-filters${filtersOpen ? " open" : ""}`}
            >
              {/* Title row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <h2
                  style={{
                    fontFamily: "Manrope,sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    margin: 0,
                  }}
                >
                  Filters
                </h2>
                <button
                  onClick={clearAll}
                  style={{
                    border: 0,
                    background: "none",
                    color: BLUE,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Clear all
                </button>
              </div>

              {/* Rent range */}
              <FilterGroup title="Maximum weekly rent">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: MUTED,
                    fontSize: 12,
                    marginBottom: 8,
                  }}
                >
                  <span>$500</span>
                  <strong style={{ color: INK }}>
                    {maxRent >= 1500 ? "$1,500+" : `$${maxRent}`}
                  </strong>
                </div>
                <input
                  type="range"
                  min={500}
                  max={1500}
                  step={50}
                  value={maxRent}
                  onChange={(e) => setMaxRent(+e.target.value)}
                  style={{ width: "100%", accentColor: GREEN }}
                />
              </FilterGroup>

              {/* Bedrooms */}
              <FilterGroup title="Bedrooms">
                <div style={checksWrap}>
                  <BedCheck val={1} label="1" />
                  <BedCheck val={2} label="2" />
                  <BedCheck val={3} label="3" />
                  <BedCheck val={4} label="4+" />
                </div>
              </FilterGroup>

              {/* Bathrooms */}
              <FilterGroup title="Bathrooms">
                <div style={checksWrap}>
                  <BathCheck val={1} label="1" />
                  <BathCheck val={2} label="2" />
                  <BathCheck val={3} label="3+" />
                </div>
              </FilterGroup>

              {/* Property type */}
              <FilterGroup title="Property type">
                <div style={checksWrap}>
                  <TypeCheck val="house" />
                  <TypeCheck val="townhouse" />
                  <TypeCheck val="apartment" />
                  <TypeCheck val="unit" />
                </div>
              </FilterGroup>

              {/* Available from */}
              <FilterGroup title="Available from">
                <input
                  type="date"
                  style={{
                    width: "100%",
                    border: `1px solid ${LINE}`,
                    borderRadius: 9,
                    background: "white",
                    padding: 10,
                    color: "#425250",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                />
              </FilterGroup>

              {/* Pets */}
              <FilterGroup title="Pets" last>
                <label style={checkLabel}>
                  <input
                    type="checkbox"
                    checked={petsOnly}
                    onChange={(e) => setPetsOnly(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: GREEN }}
                  />
                  Pet friendly only
                </label>
              </FilterGroup>
            </div>
          </aside>

          {/* ── RESULTS ── */}
          <div>
            {/* Results top bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                alignItems: "flex-end",
                margin: "4px 0 18px",
              }}
              className="fp-results-top"
            >
              <div>
                <h2
                  style={{
                    fontFamily: "Manrope,sans-serif",
                    fontWeight: 800,
                    fontSize: 29,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  Rental properties
                </h2>
                <p style={{ margin: "2px 0 0", color: MUTED, fontSize: 14 }}>
                  {loading ? (
                    "Loading properties…"
                  ) : (
                    <>
                      <span style={{ fontWeight: 700, color: INK }}>
                        {total}
                      </span>{" "}
                      {total === 1 ? "home" : "homes"} found
                    </>
                  )}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {/* List / Map toggle */}
                <div
                  style={{
                    display: "flex",
                    border: `1px solid ${LINE}`,
                    padding: 3,
                    borderRadius: 10,
                  }}
                >
                  {(["list", "map"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      style={{
                        border: 0,
                        background:
                          view === v ? "#edf5f1" : "transparent",
                        color: view === v ? GREEN : MUTED,
                        borderRadius: 7,
                        padding: "8px 13px",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background .15s",
                      }}
                    >
                      {v === "list" ? "☷ List" : "⌖ Map"}
                    </button>
                  ))}
                </div>
                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  style={{
                    border: `1px solid ${LINE}`,
                    background: "white",
                    borderRadius: 10,
                    padding: "9px 12px",
                    color: "#43524f",
                    fontFamily: "inherit",
                    fontSize: 13,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="match">Best match</option>
                  <option value="low">Rent: low to high</option>
                  <option value="high">Rent: high to low</option>
                </select>
              </div>
            </div>

            {/* Cards grid */}
            {view === "list" && (
              <>
                {/* Error banner */}
                {error && (
                  <div
                    style={{
                      background: "#fff4f4",
                      border: "1px solid #f5c6c6",
                      borderRadius: 12,
                      padding: "18px 22px",
                      color: "#8b2020",
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>⚠</span>
                    <div>
                      <strong>Could not load properties</strong>
                      <p style={{ margin: "2px 0 0", fontSize: 13 }}>{error}</p>
                    </div>
                    <button
                      onClick={() => fetchProperties(page)}
                      style={{
                        marginLeft: "auto",
                        border: "1px solid #c9a0a0",
                        borderRadius: 8,
                        background: "white",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 13,
                        color: "#8b2020",
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {loading ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                      gap: 18,
                    }}
                    className="fp-cards"
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : visible.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                      gap: 18,
                    }}
                    className="fp-cards"
                  >
                    {visible.map((p) => (
                      <PropertyCard key={p.id} p={p} />
                    ))}
                  </div>
                ) : !error ? (
                  /* Empty state */
                  <div
                    style={{
                      textAlign: "center",
                      border: `1px dashed #cbdad5`,
                      borderRadius: 18,
                      padding: "70px 20px",
                      color: MUTED,
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
                    <h3
                      style={{
                        fontFamily: "Manrope,sans-serif",
                        margin: "0 0 8px",
                        color: INK,
                      }}
                    >
                      No rentals match those filters
                    </h3>
                    <p style={{ margin: 0 }}>
                      Try broadening your search or clearing some filters.
                    </p>
                    <button
                      onClick={clearAll}
                      style={{
                        marginTop: 16,
                        border: `1px solid ${BLUE}`,
                        borderRadius: 9,
                        background: "white",
                        color: BLUE,
                        padding: "10px 22px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : null}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 32,
                    }}
                  >
                    {page > 1 && (
                      <button
                        onClick={() => fetchProperties(page - 1)}
                        style={paginBtn}
                      >
                        ← Prev
                      </button>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => Math.abs(p - page) <= 2)
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => fetchProperties(p)}
                          style={{
                            ...paginBtn,
                            background: p === page ? BLUE : "white",
                            color: p === page ? "white" : INK,
                            borderColor: p === page ? BLUE : LINE,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    {page < totalPages && (
                      <button
                        onClick={() => fetchProperties(page + 1)}
                        style={paginBtn}
                      >
                        Next →
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Map view */}
            {view === "map" && <MapView properties={visible} />}

            {/* Profile CTA strip */}
            <div
              style={{
                marginTop: 22,
                border: "1px solid #bedbbd",
                borderRadius: 17,
                background: "linear-gradient(105deg,#f2faef,#fbfdfb)",
                padding: "22px 28px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
              className="fp-profile-cta"
            >
              <div
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: GREEN,
                  color: "white",
                  fontSize: 25,
                  flexShrink: 0,
                }}
              >
                ♙
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3
                  style={{
                    fontFamily: "Manrope,sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    margin: 0,
                  }}
                >
                  Get better matches with a renter profile
                </h3>
                <p style={{ margin: "2px 0 0", color: MUTED, fontSize: 14 }}>
                  Tell us what you need once and we'll highlight the rentals
                  that suit you best.
                </p>
              </div>
              <a
                href="/email-verification"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 46,
                  padding: "0 22px",
                  borderRadius: 10,
                  background: BLUE,
                  color: "white",
                  fontWeight: 700,
                  border: `1px solid ${BLUE}`,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  fontSize: 15,
                  fontFamily: "inherit",
                }}
              >
                Create free profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
        .fp-layout { grid-template-columns: 280px 1fr !important; }
        .fp-cards   { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        @media (max-width: 1120px) {
          .fp-cards { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 850px) {
          .fp-layout { grid-template-columns: 1fr !important; }
          .fp-filter-mobile-btn { display: block !important; }
          .fp-filters { display: none; position: static !important; }
          .fp-filters.open { display: block !important; }
          .fp-results-top { align-items: flex-start; }
          .fp-cards { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 620px) {
          .fp-results-top { display: block !important; }
          .fp-cards { grid-template-columns: 1fr !important; }
          .fp-profile-cta { align-items: flex-start !important; }
        }
      `}</style>
    </main>
  );
};

/* ─────────────────────────────────────────────
   FILTER GROUP HELPER
───────────────────────────────────────────── */
const FilterGroup = ({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) => (
  <div
    style={{
      padding: "17px 0",
      borderBottom: last ? "none" : `1px solid ${LINE}`,
      paddingBottom: last ? 0 : undefined,
    }}
  >
    <h3
      style={{
        fontFamily: "Manrope,sans-serif",
        fontWeight: 700,
        fontSize: 14,
        margin: "0 0 11px",
        color: INK,
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

const checksWrap: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px 14px",
};

const checkLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  color: "#4f5d5c",
  fontSize: 13,
  cursor: "pointer",
  userSelect: "none",
};

const paginBtn: React.CSSProperties = {
  border: `1px solid ${LINE}`,
  borderRadius: 8,
  background: "white",
  color: INK,
  padding: "8px 14px",
  cursor: "pointer",
  fontFamily: '"DM Sans", system-ui, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  transition: "background .15s, color .15s",
};

export default FindProperty;
