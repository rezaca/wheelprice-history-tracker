/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from 'react';
import { PriceHistory } from '@/lib/mock-data';
import { format, parseISO } from 'date-fns';

// Using window.Chart to avoid SSR issues
declare global {
  interface Window {
    Chart: any;
  }
}

// Chart.js types for our callbacks
interface TooltipContext {
  parsed: {
    y: number;
  };
}

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface ChartComponentProps {
  priceHistory: PriceHistory;
}

export default function ChartComponent({ priceHistory }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  
  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Sort data by date
    const sortedData = [...priceHistory.pricePoints].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Prepare data for the chart - include both month, day and year for clarity
    const labels = sortedData.map(point => format(parseISO(point.date), 'MMM d, yyyy'));
    const prices = sortedData.map(point => point.price);

    // Define gradient for area under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');  // More transparent emerald at the top
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)'); // Nearly transparent at the bottom

    // Create chart
    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Price',
            data: prices,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: gradient,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(16, 185, 129)',
            pointBorderColor: '#ffffff', // White for light theme
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgb(16, 185, 129)',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2,
            tension: 0.3, // Smoother curve
            fill: 'start',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 10
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(209, 213, 219, 0.5)', // Lighter grid lines for light theme
              drawBorder: false,
            },
            ticks: {
              color: 'rgb(107, 114, 128)', // Darker text for light theme
              font: {
                size: 10
              },
              maxRotation: 0, // No rotation for cleaner look
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 12, // Limit the number of ticks to avoid crowding
            },
            border: {
              display: false
            }
          },
          y: {
            position: 'right', // Move y-axis to the right side as in the image
            grid: {
              color: 'rgba(209, 213, 219, 0.5)', // Lighter grid lines for light theme
              drawBorder: false,
            },
            border: {
              display: false
            },
            ticks: {
              color: 'rgb(107, 114, 128)', // Darker text for light theme
              callback: function(value: any) {
                return formatCurrency(value as number);
              },
              font: {
                size: 10
              },
              padding: 10
            },
            min: 0, // Start from 0 to show full price context
          },
        },
        plugins: {
          title: {
            display: false, // Ensure no title is displayed
          },
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgb(255, 255, 255)',
            titleColor: 'rgb(17, 24, 39)',
            bodyColor: 'rgb(75, 85, 99)',
            borderColor: 'rgb(229, 231, 235)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              title: function() {
                return 'Price'; // Changed from 'Sale Price' to just 'Price'
              },
              label: function(context: TooltipContext) {
                const value = context.parsed.y;
                return `${formatCurrency(value)}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory]);

  return (
    <div className="h-full w-full relative">
      <canvas ref={chartRef} />
    </div>
  );
} 