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
                height: 350,
                toolbar: { show: false },
                animations: {
                    enabled: true,
                    speed: 800,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: false,
                    columnWidth: '45%',
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#fff'], // Set data label text to white
                    fontWeight: 700,
                    fontSize: '14px'
                },
                formatter: function (val: number) {
                    return val.toLocaleString();
                },
                offsetY: -6,
            },
            xaxis: {
                categories: [],
                labels: {
                    style: {
                        colors: '#64748b',
                        fontWeight: 500,
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#64748b',
                        fontWeight: 500,
                    }
                }
            },
            grid: {
                borderColor: '#cbd5e1', // lighter blue-gray for less bold lines
                strokeDashArray: 0, // solid lines
                xaxis: {
                    lines: {
                        show: false // Hide vertical lines for clarity
                    }
                },
                yaxis: {
                    lines: {
                        show: true // Show horizontal lines
                    }
                },
                row: {
                    colors: ['#f1f5f9', 'transparent'], // very subtle row background
                    opacity: 0.5,
                },
                position: 'back'
            },
            colors: ['#2563eb'],
            title: {
                text: 'Top Reservation Housing of this Month',
                align: 'left',
                style: {
                    fontSize: '18px',
                    color: '#172554',
                    fontWeight: 700,
                }
            },
            tooltip: {
                theme: 'light',
            },
            legend: {
                show: false
            }
        }
    });

    interface SalesDashboardItem {
        category: string;
        totalReserved: number;
    }

    useEffect(() => {
        setIsMounted(true);

        axios.get('sales-encoding', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }
        })
        .then(response => {
            const data: SalesDashboardItem[] = response.data.salesdashboard;
            const categories = data.map((item: SalesDashboardItem) => item.category);
            const reservations = data.map((item: SalesDashboardItem) => item.totalReserved);

            setBarChartData(prev => ({
                series: [{
                    name: 'Total Reservation',
                    data: reservations
                }],
                options: {
                    ...prev.options,
                    xaxis: {
                        ...prev.options.xaxis,
                        categories: categories
                    }
                }
            }));
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <Card className="fade-in-left w-full md:w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 border-0 shadow-xl rounded-2xl relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    {/* Badge for context */}
                    <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-xs font-semibold shadow-sm">
                        HOUSING
                    </span>
                    <div>
                        <CardTitle className="text-[#172554] text-xl font-bold">Top Housing Category</CardTitle>
                        <div className="text-xs text-blue-700 font-medium">Monthly Reservations</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {isMounted && (
                    <div className="w-full">
                        <Chart
                            options={barChartData.options}
                            series={barChartData.series}
                            type="bar"
                            height={350}
                        />
                    </div>
                )}
            </CardContent>
            {/* Decorative gradient blob */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-2xl pointer-events-none" />
        </Card>
    );
}

export default DeveloperPartners;