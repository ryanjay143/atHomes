import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const DeveloperPartners = () => {
    const [isMounted, setIsMounted] = useState(false);

    const barChartData = {
        series: [{
          name: 'Developers',
          data: [120, 90, 80, 70, 60, 50, 40, 30, 20]
        }],
        options: {
          chart: {
            type: 'bar' as const,
            height: 350
          },
          xaxis: {
            categories: [
              'Camella Homes', 'Pueblo de Oro', 'Filinvest Land', 'Avida Land', 
              'Lumina Homes', 'Vista Residences', 'BellaVita Land', 
              'Primavera Residences', 'Johndorf Ventures'
            ]
          },
          title: {
            text: 'Top Residential Housing Developers',
            align: 'left'
          }
        } as ApexOptions
      };

       useEffect(() => {
            setIsMounted(true);
        }, []);

  return (
   <>
   <Card className="fade-in-right w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
          <CardHeader>
            <CardTitle className="text-[#172554]">Top developers partners</CardTitle>
          </CardHeader>
          <CardContent>
            {isMounted && (
              <Chart 
                options={barChartData.options} 
                series={barChartData.series} 
                type="bar"
                height={350}
              />
            )}
          </CardContent>
        </Card>
   </>
  )
}

export default DeveloperPartners
