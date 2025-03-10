"use client";

import { PriceHistory } from "@/lib/mock-data";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  priceHistory: PriceHistory;
}

export default function ChartComponent({ priceHistory }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInitialized, setChartInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    const initChart = async () => {
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

        // Create options
        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index' as const,
              intersect: false,
              backgroundColor: '#1f2937',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#374151',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                title: (context: TooltipItem<'line'>[]) => {
                  const date = new Date(context[0].label);
                  const timeRange = priceHistory.pricePoints.length > 90 ? 'MMM yyyy' : 'MMM d, yyyy';
                  return format(date, timeRange);
                },
                label: (context: TooltipItem<'line'>) => `$${Math.round(context.parsed.y)}`,
              },
            },
          },
          scales: {
            x: {
              type: 'category' as const,
              grid: {
                display: false,
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 11,
                },
                maxRotation: 0,
                callback: (_value: unknown, index: number) => {
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
              type: 'linear' as const,
              position: 'left' as const,
              grid: {
                color: '#374151',
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 11,
                },
                callback: (value: number) => `$${value}`,
              },
              border: {
                display: false,
              },
              min: 0,
            },
          },
          interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
          },
        };

        // Create new chart
        chartInstance.current = new ChartJS(ctx, {
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

    initChart();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
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