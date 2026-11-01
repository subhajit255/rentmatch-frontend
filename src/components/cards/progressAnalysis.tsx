import React from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import PlanProgress from "../ui/planProgress"

const ProgressAnalysis = () => {
    return <Card className="w-full rounded-lg py-6 px-4">
        <CardHeader>
            <h3 className="text-lg font-semibold text-black">Plan Performance</h3>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-6  py-5">
            <PlanProgress progressWidth="45%" color="var(--chart-1)" title="Basic" growth={+12.5} value="27,144" total={45} />
            <PlanProgress progressWidth="20%" color="var(--chart-2)" title="Standard" growth={+12.5} value="7,014" total={20} />
            <PlanProgress progressWidth="35%" color="var(--chart-3)" title="Pro" growth={+12.5} value="15,987" total={35} />
        </CardContent>
    </Card>
}

export default ProgressAnalysis;