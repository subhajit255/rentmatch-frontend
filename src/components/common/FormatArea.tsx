import React from "react";

interface FormatAreaProps {
  value: any;
  className?: string;
}

export const FormatArea: React.FC<FormatAreaProps> = ({ value, className = "" }) => {
  if (value === undefined || value === null || value === "") {
    return (
      <span className={className}>
        0 m<sup>2</sup>
      </span>
    );
  }

  const rawStr = String(value).trim();
  const cleanArea = rawStr.replace(/m2|sqm|sqft|m²/gi, "").trim();
  const num = Number(cleanArea);
  const displayVal =
    !isNaN(num) && cleanArea !== "" ? num.toLocaleString() : cleanArea || rawStr;

  return (
    <span className={className}>
      {displayVal} m<sup>2</sup>
    </span>
  );
};

export default FormatArea;
