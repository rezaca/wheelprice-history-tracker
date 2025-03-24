"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction } from "react";

export type TimeRange = "1m" | "3m" | "6m" | "ytd" | "1y" | "all";

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  setTimeRange: Dispatch<SetStateAction<TimeRange>>;
}

export function TimeRangeSelector({ timeRange, setTimeRange }: TimeRangeSelectorProps) {
  return (
    <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)} className="w-full">
      <TabsList className="w-full bg-gray-200 p-0.5 gap-1">
        <TabsTrigger 
          value="1m" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 text-xs sm:text-sm rounded"
        >
          1M
        </TabsTrigger>
        <TabsTrigger 
          value="3m" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 text-xs sm:text-sm rounded"
        >
          3M
        </TabsTrigger>
        <TabsTrigger 
          value="6m" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 text-xs sm:text-sm rounded"
        >
          6M
        </TabsTrigger>
        <TabsTrigger 
          value="ytd" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 text-xs sm:text-sm rounded"
        >
          YTD
        </TabsTrigger>
        <TabsTrigger 
          value="1y" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 text-xs sm:text-sm rounded"
        >
          1Y
        </TabsTrigger>
        <TabsTrigger 
          value="all" 
          className="flex-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 text-xs sm:text-sm rounded"
        >
          All
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 