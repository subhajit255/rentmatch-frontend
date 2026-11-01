import React from "react"
import type { ReactNode } from "react"
import { useToast } from "../custom-hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../components/ui/toast"
import Icon from "../components/icons/icon"

type ToastItem = {
  id: string | number
  title?: string
  description?: string
  action?: ReactNode
  variant?: "success" | "error" | "info" | "warning" | string
  [key: string]: any
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }: ToastItem) {
        return (
          <Toast key={id} {...props} className="bg-background border-[1.25px] pb-1 border-border-input shadow-lg text-primary font-sans  " toast-id={id}>
            <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-1 flex items-center justify-center">
                        <div className={"flex items-center justify-center h-10 w-10 rounded-full border-2 " + (variant === "success" ? " border-active" : variant === "error" ? " border-none" : variant === "info" ? " border-none" : " border-none")}>
                            {variant === "success" && <Icon name="Check" className="w-6 h-6 text-active" fill="none" />}
                            {variant === "error" && <Icon name="Eraser" className="w-8 h-8 text-destructive" fill="none" />}
                            {variant === "info" && <Icon name="Info" className="w-8 h-8 text-blue-500" fill="none" />}
                            {variant === "warning" && <Icon name="LucideFileWarning" className="w-8 h-8 text-chart-5 bg-transparent" fill="none" />}            
                        </div>
                    </div>
                    <div className="col-span-4">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && (
                            <ToastDescription>{description}</ToastDescription>
                        )}
                    </div>
                </div>
                <div className="w-full h-[8px] bg-border rounded-xl">
                    <div className={`h-[8px] animate-progress rounded-2xl 
                        ${variant === "success" ? "bg-active" : variant === "error" ? "bg-destructive" : variant === "info" ? "bg-blue-500" : "bg-chart-5"}`} 
                    style={{ animationDuration: "5s" }} />
                </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
