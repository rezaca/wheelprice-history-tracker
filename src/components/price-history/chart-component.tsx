"use client";

import { PriceHistory } from "@/lib/mock-data";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  priceHistory: PriceHistory;
}

export default function ChartComponent({ priceHistory }: ChartComponentProps) {
  const options: ChartOptions<"line"> = {
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
          title: (context) => {
            const date = new Date(context[0].label);
            const timeRange = priceHistory.pricePoints.length > 90 ? 'MMM yyyy' : 'MMM d, yyyy';
            return format(date, timeRange);
          },
          label: (context) => `$${Math.round(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          maxRotation: 0,
          callback: (value, index) => {
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
        position: 'left',
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          callback: (value) => `$${value}`,
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

  return <Line options={options} data={data} />;
} 