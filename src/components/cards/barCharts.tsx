// import { TrendingUp } from "lucide-react"
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import Icon from "../icons/icon"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";

export const description = "A multiple bar chart"

const chartData = [
  { month: "January", basic: 186, standard: 80, pro: 67 },
]

const quaterlyChartData = [
  { month: "January", basic: 186, standard: 80, pro: 67 },
  { month: "February", basic: 305, standard: 200, pro: 102 },
  { month: "March", basic: 237, standard: 120, pro: 81 },
]

const yearlyChartData = [
  { month: "January", basic: 186, standard: 80, pro: 67 },
  { month: "February", basic: 305, standard: 200, pro: 102 },
  { month: "March", basic: 237, standard: 120, pro: 81 },
  { month: "April", basic: 186, standard: 80, pro: 67 },
  { month: "May", basic: 305, standard: 200, pro: 102 },
  { month: "June", basic: 237, standard: 120, pro: 81 },
  { month: "July", basic: 186, standard: 80, pro: 67 },
  { month: "August", basic: 305, standard: 200, pro: 102 },
  { month: "September", basic: 237, standard: 120, pro: 81 },
  { month: "October", basic: 186, standard: 80, pro: 67 },
  { month: "November", basic: 305, standard: 200, pro: 102 },
  { month: "December", basic: 237, standard: 120, pro: 81 },
]

const chartConfig = {
  basic: {
    label: "Basic",
    color: "var(--chart-1)",
  },
  standard: {
    label: "Standard",
    color: "var(--chart-2)",
  },
  pro: {
    label: "Pro",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartBarMultiple() {
  const [tanure, setTanure] = useState("quarterly")

  return (
    <Card className="bg-white rounded-xl w-full p-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">Revenue Analytics</h3>
          <Select onValueChange={(value) => { setTanure(value) }} value={tanure}>
            <SelectTrigger className="w-1/3 h-12 py-0 rounded-md bg-white border-border-input bg-background shadow-none ">
              {tanure.charAt(0).toLocaleUpperCase() + tanure?.slice(1, tanure?.length)}
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={0} value={"monthly"}>Monthly</SelectItem>
              <SelectItem key={1} value={"quarterly"}>Quarterly</SelectItem>
              <SelectItem key={2} value={"Yearly"}>Yearly</SelectItem>
              {/* {
                memberRoles?.map(role =>
                  <SelectItem key={role?.id} value={role?.value}>{role?.title}</SelectItem>
                )
              } */}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-2">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={tanure==="monthly" ? chartData : tanure === "quarterly" ? quaterlyChartData : yearlyChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="basic" fill="var(--color-basic)" radius={4} />
            <Bar dataKey="standard" fill="var(--color-standard)" radius={4} />
            <Bar dataKey="pro" fill="var(--color-pro)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <Icon name="TrendingUp" className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
