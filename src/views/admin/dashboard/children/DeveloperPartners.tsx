import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';

const DeveloperPartners = () => {
    const [isMounted, setIsMounted] = useState(false);
    interface BarChartData {
        series: {
            name: string;
            data: number[];
        }[];
        options: ApexOptions;
    }

    const [barChartData, setBarChartData] = useState<BarChartData>({
        series: [{
            name: 'Total Reservation',
            data: []
        }],
        options: {
            chart: {
                type: 'bar' as const,
                height: 350
            },
            xaxis: {
                categories: []
            },
            title: {
                text: 'Top Reservation Housing of this Month',
                align: 'left'
            }
        }
    });

    // Define the type for the sales dashboard items
    interface SalesDashboardItem {
        category: string;
        totalReserved: number;
    }

    useEffect(() => {
        setIsMounted(true);

        // Fetch data from the backend with authorization header
        axios.get('sales-encoding', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }
        })
        .then(response => {
            const data: SalesDashboardItem[] = response.data.salesdashboard;
            const categories = data.map((item: SalesDashboardItem) => item.category);
            const reservations = data.map((item: SalesDashboardItem) => item.totalReserved);

            // console.log("Categories:", categories);

            setBarChartData({
                series: [{
                    name: 'Total Reservation',
                    data: reservations
                }],
                options: {
                    ...barChartData.options,
                    xaxis: {
                        categories: categories
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <>
            <Card className="fade-in-right w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
                <CardHeader>
                    <CardTitle className="text-[#172554]">Top Housing Category</CardTitle>
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
    );
}

export default DeveloperPartners;