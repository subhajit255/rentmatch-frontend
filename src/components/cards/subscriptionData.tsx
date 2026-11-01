import React from "react";
import { Card, CardContent } from "../ui/card"
import Icon from "../icons/icon"
import { IconName } from "../icons/icon";
import { cn } from "../lib/utils";

const SubscriptionDataCard = ({ analytic, className, internalBorder } : any) => {
    return <Card className={cn("w-full ", className)}>
        <CardContent className={cn("py-6 px-4 ",
            internalBorder ? "pr-0" : ""
        )}>
        <div className={`flex gap-4 ${internalBorder ? "border-r border-black/10" : "border-none"} `}>
            <div className="w-15 h-15 rounded-lg flex items-center justify-center bg-secondary/10">
                <Icon name={analytic?.icon as IconName} className="text-primary" />
            </div>
            <div className="flex flex-col gap-2">
                <ul>
                    <li><h4 className="text-black text-md font-medium tracking-wide">{analytic?.title}</h4></li>
                    <li><span className="text-3xl font-bold text-primary">{analytic?.numeric}</span></li>
                    <li><small className="text-sm font-semibold text-card-foreground">Last {analytic?.tanure}</small></li>
                    <li className="flex items-center gap-2">
                        <span className="text-sm text-active">Growth +{analytic?.growth}</span>
                        <span className="bg-active w-4.5 h-4.5 flex items-center justify-center rounded-full">
                            <Icon name="TrendingUp" className="w-3  h-3 text-white" />
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        </CardContent>

    </Card>
}

export default SubscriptionDataCard;