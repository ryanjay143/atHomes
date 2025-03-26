import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Sales = () => {
    const [isMounted, setIsMounted] = useState(false);

    const data = {
        series: [{
          name: 'Sales',
          data: [4000, 3000, 2000, 2780, 1890, 2390, 3490, 2000, 2780, 1890, 2390, 3490]
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
          }
        } as ApexOptions
      };

      useEffect(() => {
        setIsMounted(true);
      }, []);

  return (
   <>
   <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
          <CardHeader>
            <CardTitle className="text-[#172554]">Overall Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {isMounted && (
              <Chart 
                options={data.options} 
                series={data.series} 
                type="line"
                height={350}
              />
            )}
          </CardContent>
        </Card>
   </>
  )
}

export default Sales
