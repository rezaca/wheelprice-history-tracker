"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TimeRange = "1m" | "3m" | "6m" | "ytd" | "1y" | "all";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  return (
    <Tabs value={selectedRange} onValueChange={(value) => onRangeChange(value as TimeRange)} className="w-full">
      <TabsList className="w-full bg-gray-800 p-0.5 gap-1">
        <TabsTrigger 
          value="1m" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 text-sm rounded"
        >
          1M
        </TabsTrigger>
        <TabsTrigger 
          value="3m" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 text-sm rounded"
        >
          3M
        </TabsTrigger>
        <TabsTrigger 
          value="6m" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 text-sm rounded"
        >
          6M
        </TabsTrigger>
        <TabsTrigger 
          value="ytd" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 text-sm rounded"
        >
          YTD
        </TabsTrigger>
        <TabsTrigger 
          value="1y" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 text-sm rounded"
        >
          1Y
        </TabsTrigger>
        <TabsTrigger 
          value="all" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-400 text-sm rounded"
        >
          All
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 