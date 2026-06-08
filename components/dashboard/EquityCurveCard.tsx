"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { EquityPoint } from "@/types/trade";
import { formatCurrency } from "@/lib/utils/formatPnl";

interface EquityCurveCardProps {
  data: EquityPoint[];
  deltaPct: number;
}

/** Equity curve as a green area chart, wrapped in a titled Card. */
export function EquityCurveCard({ data, deltaPct }: EquityCurveCardProps) {
  return (
    <Card>
      <CardHeader
        title="Equity Curve"
        action={
          <Badge tone={deltaPct >= 0 ? "profit" : "loss"}>
            {deltaPct >= 0 ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </Badge>
        }
      />
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              width={48}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Equity"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #ececef",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#equityFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
