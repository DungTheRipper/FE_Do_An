import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";

const DaysOfWeekChart = ({darkMode, report}) => {
    const [weeklyData, setWeekData] = useState({
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Tasks Completed of Days",
                data: [],
                borderColor: darkMode ? "rgb(134, 239, 172)" : "rgb(75, 192, 192)",
                fill: false,
                tension: 0.1
            },
        ]
    });

    useEffect(() => {
        if (!report) return;
        const weekDaysReport = report.weekly_analysis.week_days_report;
        const orderedWeekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        const tasksCompleted = orderedWeekDays.map(day => {
            const dayReport = weekDaysReport.find(item => item[0] === day);
            return dayReport ? dayReport[1] : 0; // Nếu không tìm thấy, trả về 0
        });

        setWeekData(prevState => {
            const prevData = prevState.datasets[0].data;
            if (JSON.stringify(prevData) !== JSON.stringify(tasksCompleted)) {
                return {
                    labels: orderedWeekDays,
                    datasets: [
                        {
                            label: "Tasks Completed of Days",
                            data: tasksCompleted,
                            borderColor: darkMode ? "rgb(134, 239, 172)" : "rgb(75, 192, 192)",
                            tension: 0.1
                        },
                    ]
                };
            }
            return prevState;
        });
    }, [report]);

    return (
        <Line
            data={{
                labels: weeklyData.labels,
                datasets: weeklyData.datasets,
            }}
            options={{
                plugins: {
                    legend: {
                        labels: {
                            color: darkMode ? "#fff" : "#000"
                        }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        ticks: {
                            color: darkMode ? "#fff" : "#000",
                            stepSize: 1
                        },
                        grid: {
                            color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                        }
                    },
                    x: {
                        ticks: {
                            color: darkMode ? "#fff" : "#000"
                        },
                        grid: {
                            color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                        }
                    }
                }
            }}
        />
    );
}

export default DaysOfWeekChart;
