import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";


function TotalSales({chartData, totalSales, currencyFormatter }:any) {
    
    const [isMounted, setIsMounted] = useState(false);
   

    const data = {
      series: [{
        name: 'Sales',
        data: chartData
      }],
      options: {
        chart: {
          type: 'line' as const,
          height: 350
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Sales from January to December',
          align: 'left'
        },
        tooltip: {
          y: {
            formatter: (value: number) => {
              return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
            }
          }
        }
      } as ApexOptions
    };
  
    useEffect(() => {
      setIsMounted(true);
    }, []);

    
  return (
    <div>
    <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
    <CardHeader>
        <CardTitle>Total Sales</CardTitle>
    </CardHeader>
    <CardContent>
        <p className="text-lg font-semibold">{currencyFormatter.format(totalSales)}</p>
        <div className="w-full md:w-full mt-6">
            {isMounted && (
            <Chart 
                options={data.options} 
                series={data.series} 
                type="line"
                height={350}
            />
            )}
        </div>
    </CardContent>
    </Card>
</div>
  )
}

export default TotalSales
