import Chart from 'react-apexcharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';

function DashboardContainer() {
  const chartOptions = {
    series: [{
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 55, 65, 75, 85, 95] // Updated to include 12 data points
    }],
    chart: {
      type: 'line' as const,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] 
    }
  };

  return (
    <div className="py-5 md:pt-20">
      <div className="flex justify-between md:flex-row">
        <h1 className="text-4xl font-bold ml-72 md:ml-0 md:grid-cols-1 md:text-2xl md:gap-2 md:p-5 md:mt-0">Dashboard</h1>

        <div className="mr-3 md:mr-8 flex items-center md:justify-start">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="This Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last Week">Last Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="ml-72 md:ml-0 grid grid-cols-2 md:grid-cols-1 md:gap-2 md:p-5 md:mt-0 gap-2 items-start justify-center mt-5 md:px-5 mr-2">
        <div>
          <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p>₱ 2,000,000.00</p>
              <div className="w-full md:w-full mt-5">
                <Chart
                  options={chartOptions}
                  series={chartOptions.series}
                  type="line"
                  width="100%"
                />
              </div>
            </CardContent>
            <hr className="border-primary mb-5"/>
            <div className='flex flex-col items-start justify-start p-5 gap-4'>
              <p>Monthly Sales</p>
              <div className=''>
                <p>₱ 2,000,000.00</p>
              </div>
              <div className='w-full md:w-full'>
                <Progress value={33} />
                <p>33% Achieved</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
            <CardHeader>
              <CardTitle>Top Agent Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="ml-72 md:ml-0 grid grid-cols-1 md:grid-cols-1 md:gap-2 md:p-0 md:mt-0 gap-2 items-start justify-center mt-5 md:px-5 mr-2">
        <div>
          <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;