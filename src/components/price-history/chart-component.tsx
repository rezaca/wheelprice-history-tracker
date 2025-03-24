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

// Add more types to handle tooltips and Chart.js specifics
interface ChartContext {
  index: number;
  dataIndex: number;
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

// Format dates in a more condensed way for mobile
const formatDateForAxis = (dateStr: string, isMobile: boolean) => {
  const date = parseISO(dateStr);
  return isMobile 
    ? format(date, 'MMM yy') // Shorter format for mobile: "May 23"
    : format(date, 'MMM d, yyyy'); // Full format for desktop: "May 31, 2023"
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

    // Detect if we're on a mobile device
    const isMobile = window.innerWidth < 768;

    // Sort data by date
    const sortedData = [...priceHistory.pricePoints].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Prepare data for the chart with appropriate date formatting
    const labels = sortedData.map(point => formatDateForAxis(point.date, isMobile));
    const prices = sortedData.map(point => point.price);
    const rawDates = sortedData.map(point => point.date); // Store original dates for tooltips

    // Define gradient for area under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');  // More transparent emerald at the top
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)'); // Nearly transparent at the bottom

    // Configure maxTicksLimit based on screen size
    const maxTicksLimit = isMobile ? 5 : 12;
    const fontSize = isMobile ? 9 : 10;
    const pointRadius = isMobile ? 2 : 3;
    
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
            pointRadius: pointRadius,
            pointBackgroundColor: 'rgb(16, 185, 129)',
            pointBorderColor: '#ffffff', // White for light theme
            pointBorderWidth: 2,
            pointHoverRadius: pointRadius + 2,
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
            left: isMobile ? 5 : 10,
            right: isMobile ? 5 : 10,
            top: 20,
            bottom: isMobile ? 5 : 10
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(209, 213, 219, 0.5)', // Lighter grid lines for light theme
              drawBorder: false,
              // Display fewer grid lines on mobile
              display: function(context: { index: number }) {
                return isMobile ? context.index % 2 === 0 : true;
              }
            },
            ticks: {
              color: 'rgb(107, 114, 128)', // Darker text for light theme
              font: {
                size: fontSize
              },
              maxRotation: 0, // No rotation for cleaner look
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: maxTicksLimit, // Fewer ticks on mobile
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
              // Display fewer grid lines on mobile
              display: function(context: { index: number }) {
                return isMobile ? context.index % 2 === 0 : true;
              }
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
                size: fontSize
              },
              padding: isMobile ? 5 : 10,
              // Show fewer y-axis ticks on mobile
              maxTicksLimit: isMobile ? 6 : 8,
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
            padding: isMobile ? 8 : 12,
            displayColors: false,
            callbacks: {
              title: function(context: ChartContext[]) {
                // Get the original date from our stored array
                const dataIndex = context[0].dataIndex;
                const originalDate = rawDates[dataIndex];
                // Format the full date for the tooltip
                return format(parseISO(originalDate), 'MMM d, yyyy');
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

    // Handle window resize to update chart for responsive display
    const handleResize = () => {
      if (chartInstance.current) {
        const newIsMobile = window.innerWidth < 768;
        // Only update if mobile status changed
        if (newIsMobile !== isMobile) {
          chartInstance.current.destroy();
          // Force re-render by triggering the useEffect again
          const event = new Event('resize');
          window.dispatchEvent(event);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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