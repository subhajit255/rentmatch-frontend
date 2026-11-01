import React from "react";
const PlanProgress = ( { title, growth, total, subscribers, value, color, progressWidth} : any ) => {
    return <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between font-semibold px-2">
            <span className="flex items-center gap-1">
                <span className=" text-gray/500 tracking-tight">{title}</span>
                <span className={`${growth > 0 ? "text-active" : "text-destructive"} text-sm`}>{growth >= 0 ? ("+" + growth) : ("-" + growth)}%</span>
            </span>
            <span className="leading-[1.5] text-black">${value}</span>
        </div>
        <div className="h-3 rounded-full bg-ring">
            <div className={`h-full rounded-full`} style={{width: progressWidth, backgroundColor: color}}></div>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-sm font-medium tracking-wide px-2">
            <span className="">{subscribers} subscribers</span>
            <span>{total}% of total</span>
        </div>
    </div>
}

export default PlanProgress;