import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { faChartLine, faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TotalSales({ chartData, totalSales, currencyFormatter }: any) {
  const [isMounted, setIsMounted] = useState(false);

  const data = {
    series: [
      {
        name: "Sales",
        data: chartData,
      },
    ],
    options: {
      chart: {
        type: "line" as const,
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#64748b",
            fontWeight: 500,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontWeight: 500,
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#2563eb"], // blue-600
      },
      markers: {
        size: 5,
        colors: ["#2563eb"], // blue-600
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: { size: 7 },
      },
      grid: {
        borderColor: "#e0e7ef",
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      title: {
        text: "Sales from January to December",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: 600,
          color: "#172554",
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value: number) => {
            return new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(value);
          },
        },
      },
      colors: ["#2563eb"], // blue-600
    } as ApexOptions,
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-b-4 border-primary w-full md:w-full shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 shadow">
            <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-xl" />
          </span>
          <CardTitle className="text-xl font-bold text-primary">Total Sales</CardTitle>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 shadow">
          <FontAwesomeIcon icon={faPesoSign} className="mr-1" />
          {currencyFormatter.format(totalSales)}
        </span>
      </CardHeader>
      <CardContent>
        <div className="w-full mt-2">
          {isMounted && (
            <Chart
              options={data.options}
              series={data.series}
              type="line"
              height={320}
            />
          )}
        </div>
        <div className="mt-4 flex flex-col items-center">
          <span className="text-green-600 text-2xl font-bold">
            + {currencyFormatter.format(totalSales)}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Total sales for the year
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalSales;