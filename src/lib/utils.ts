import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transmissionLowerCase(value: string) {
  return value?.charAt(0) + value?.slice(1, value.length)?.toLocaleLowerCase();
}

export function transmissionUpperCase(value: string) {
  return value?.charAt(0)?.toLocaleUpperCase() + value?.slice(1, value.length);
}

export function dateFormat(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function priceFormat(value: string) {
  // console.log("value ---------------------------> ", value);
  
  // if(!value || value?.trim() === "" ) return "0";
  // if(isNaN(parseFloat(value))) return value;
  // if(value?.includes('.'))
  //   return parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // return parseFloat(value).toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

   const stringValue = String(value ?? ""); 
  
  if (!stringValue || stringValue.trim() === "") return "0";
  
  const numericValue = parseFloat(stringValue);
  if (isNaN(numericValue)) return stringValue;
 const options = stringValue.includes('.') ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 };
  return numericValue.toLocaleString('en-US', options);
}

export function stringLengthFormat(value: string, length: number): string {
  if (!value) return '';
  return value.length > length ? `${value.slice(0, length)}..` : value;
}