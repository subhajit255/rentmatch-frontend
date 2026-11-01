import { RefObject, useEffect } from "react";
import { boolean } from "zod";

/**
 * Detects click outside of an element and triggers a callback.
 * @param {object} ref - React ref object pointing to the element.
 * @param {function} callback - Function to run when clicked outside.
 */
export function useClickOutside(ref : RefObject<HTMLElement | Record<string, HTMLElement | null> | null>, callback :() => void, 
isList : boolean = true, 
openRowId : string | number | null = null )  {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // console.log("ref?.current ::: ", ref?.current);
      // console.log("event.target ::: ", event.target);
      if (isList) {
        if (ref?.current && !('contains' in ref.current)) {
          for (const key in ref.current) {
            // console.log("key ::: ", key, openRowId);
            if (Object.hasOwnProperty.call(ref.current, key)) {
              const element = ref.current[key];
              if (element && element.contains(event.target as Node)) {
                return;
              }
            }
          }
          callback();
        }
      } else {
        const current = ref?.current;
        if (current) {
          // If current is an HTMLElement, use its contains method
          if (current instanceof HTMLElement) {
            if (!current.contains(event.target as Node)) {
              callback();
            }
          } else {
            // Fallback for record-like refs: check each element inside the record
            const anyCurrent = current as Record<string, HTMLElement | null>;
            const clickedInsideAny = Object.values(anyCurrent).some(
              (el) => el && el.contains(event.target as Node)
            );
            if (!clickedInsideAny) {
              callback();
            }
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
  return ref;
}
