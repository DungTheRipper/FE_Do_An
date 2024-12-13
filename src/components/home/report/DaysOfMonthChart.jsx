import {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";

const DaysOfMonthChart = ({darkMode, report}) => {
    const [monthlyData, setMonthlyData] = useState({
        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
            "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24",
            "25", "26", "27", "28", "29", "30", "31"],
        datasets: [
            {
                label: "Tasks Completed",
                data: [],
                borderColor: darkMode ? "rgb(134, 239, 172)" : "rgb(75, 192, 192)",
                tension: 0.1
            },
        ]
    });

    useEffect(() => {
        if (report) {
            const monthlyReport = report.monthly_analysis.monthly_report;
            const daysData = Object.keys(monthlyReport).map(day => monthlyReport[day]);
            setMonthlyData(prevState => ({
                ...prevState,
                datasets: [
                    {
                        ...prevState.datasets[0],
                        data: daysData
                    }
                ]
            }));
        }
    }, [report]);

    return (
        <Line
            data={monthlyData}
            options={{
                plugins: {
                    legend: {
                        labels: {
                            color: darkMode ? "#fff" : "#000",
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        ticks: {color: darkMode ? "#fff" : "#000", stepSize: 1},
                        grid: {color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"},
                    },
                    x: {
                        ticks: {color: darkMode ? "#fff" : "#000"},
                        grid: {color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                    }
                }
            }}
        />
    )
}

export default DaysOfMonthChart;