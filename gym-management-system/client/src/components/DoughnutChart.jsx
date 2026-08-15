import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default function DoughnutChart({ composition }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    chartRef.current?.destroy();
    Chart.getChart(canvasRef.current)?.destroy();

    const labels = ["Active", "Expiring Soon", "Expired", "Inactive"];
    const values = [
      composition?.activeMembership || 0,
      composition?.expiringSoon || 0,
      composition?.expired || 0,
      composition?.inactive || 0,
    ];
    const hasData = values.some((value) => value > 0);

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: hasData ? labels : ["No members"],
        datasets: [
          {
            data: hasData ? values : [1],
            backgroundColor: hasData ? ["#2dd4bf", "#fbbf24", "#fb7185", "#94a3b8"] : ["#334155"],
            borderColor: "#020617",
            borderWidth: 5,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#cbd5e1",
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              font: {
                family: "Inter, sans-serif",
              },
            },
          },
          tooltip: {
            backgroundColor: "#0f172a",
            borderColor: "rgba(255,255,255,0.15)",
            borderWidth: 1,
            titleColor: "#ffffff",
            bodyColor: "#cbd5e1",
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [composition]);

  return (
    <div className="h-72 min-h-72 w-full">
      <canvas ref={canvasRef} aria-label="Member composition chart" />
    </div>
  );
}
