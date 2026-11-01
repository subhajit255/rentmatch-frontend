import React from "react";
import { cn } from "./lib/utils";

export const FormError = ( { message, className } : { message : string, className?: string }) => {
    return <p className={cn("mt-2 text-xs text-destructive-foreground font-medium pl-2", className)}>{message}</p>
}