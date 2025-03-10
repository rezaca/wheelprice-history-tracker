/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PriceHistory } from "@/lib/mock-data";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

// Define a type for the global Chart object
declare global {
  interface Window {
    Chart: any;
  }
}

interface ChartComponentProps {
  priceHistory: PriceHistory;
}

export default function ChartComponent({ priceHistory }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInitialized, setChartInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Check if Chart.js is loaded
    if (!window.Chart) {
      console.error("Chart.js not loaded");
      setError("Chart.js not loaded");
      return;
    }

    const initChart = () => {
      try {
        if (!chartRef.current) {
          console.error("Canvas element not found");
          setError("Canvas element not found");
          return;
        }

        // Validate price history data
        if (!priceHistory || !priceHistory.pricePoints || priceHistory.pricePoints.length === 0) {
          console.error("Invalid price history data:", priceHistory);
          setError("No chart data available");
          return;
        }

        // Get canvas context first to ensure it's available
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) {
          console.error("Failed to get canvas context");
          setError("Failed to get canvas context");
          return;
        }

        // Destroy existing chart if any
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Prepare the data
        const data = {
          labels: priceHistory.pricePoints.map(point => point.date),
          datasets: [
            {
              data: priceHistory.pricePoints.map(point => point.price),
              borderColor: '#10b981',
              backgroundColor: '#10b981',
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#10b981',
              pointHoverBorderWidth: 2,
              tension: 0.4,
            },
          ],
        };

        // Create options with type assertion to fix TypeScript errors
        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1f2937',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                title: (context: any[]) => {
                  const date = new Date(context[0].label);
                  const timeRange = priceHistory.pricePoints.length > 90 ? 'MMM yyyy' : 'MMM d, yyyy';
                  return format(date, timeRange);
                },
                label: (context: any) => `$${Math.round(context.parsed.y)}`,
              },
            },
          },
          scales: {
            x: {
              type: 'category',
              grid: {
                display: false,
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 11,
                },
                maxRotation: 0,
                callback: (_value: any, index: number) => {
                  const date = new Date(priceHistory.pricePoints[index].date);
                  const timeRange = priceHistory.pricePoints.length > 90 ? 'MMM yyyy' : 'MMM d';
                  return format(date, timeRange);
                },
              },
              border: {
                display: false,
              },
            },
            y: {
              type: 'linear',
              position: 'left',
              grid: {
                color: '#374151',
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 11,
                },
                callback: (value: any) => `$${value}`,
              },
              border: {
                display: false,
              },
              min: 0,
            },
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
          },
        };

        // Create new chart using the global Chart object
        chartInstance.current = new window.Chart(ctx, {
          type: 'line',
          data,
          options,
        });

        setChartInitialized(true);
        setError(null);

      } catch (error) {
        console.error("Error initializing chart:", error);
        setError("Failed to initialize chart");
      }
    };

    // Wait a bit to ensure Chart.js is fully loaded
    const timer = setTimeout(() => {
      initChart();
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        try {
          chartInstance.current.destroy();
        } catch (e) {
          console.warn("Error destroying chart:", e);
        }
      }
    };
  }, [priceHistory]);

  return (
    <div className="relative h-[300px] w-full">
      <canvas ref={chartRef} />
      {!chartInitialized && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded">
          <p className="text-gray-400">Loading chart...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded">
          <p className="text-gray-400">{error}</p>
        </div>
      )}
    </div>
  );
} 