import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const CircleChart = ({ darkMode, report }) => {
    const [hoverData, setHoverData] = useState(`Total: ${report?.total_tasks || 0} tasks`);
    const [chartData, setChartData] = useState({
        labels: ["Completed", "Pending", "Overdue"],
        datasets: [
            {
                label: "Task Status",
                data: [0, 0, 0],
                backgroundColor: [
                    "rgb(134, 239, 172)",
                    "rgb(224,218,87)",
                    "rgb(248, 113, 113)",
                ],
                hoverBackgroundColor: [
                    "rgb(120, 225, 155)",
                    "rgb(231,222,63)",
                    "rgb(225, 80, 80)",
                ],
            },
        ],
    });

    useEffect(() => {
        if (report) {
            const { completed_tasks, pending_tasks, overdue_tasks, total_tasks } =
                report;

            const tasksCompleted = completed_tasks || 0;
            const tasksPending = pending_tasks || 0;
            const tasksOverdue = overdue_tasks || 0;

            setChartData({
                labels: ["Completed", "Pending", "Overdue"],
                datasets: [
                    {
                        label: "Task Status",
                        data: [tasksCompleted, tasksPending, tasksOverdue],
                        backgroundColor: [
                            darkMode ? "rgb(34, 193, 195)" : "rgb(134, 239, 172)",
                            darkMode ? "rgb(255, 159, 64)" : "rgb(224,218,87)",
                            darkMode ? "rgb(255, 99, 132)" : "rgb(248, 113, 113)",
                        ],
                        hoverBackgroundColor: [
                            darkMode ? "rgb(28, 170, 174)" : "rgb(120, 225, 155)",
                            darkMode ? "rgb(255, 183, 77)" : "rgb(231,222,63)",
                            darkMode ? "rgb(255, 69, 58)" : "rgb(225, 80, 80)",
                        ],
                    },
                ],
            });
        }
    }, [report]);

    const handleHover = (event, elements, chart) => {
        if (elements.length > 0) {
            const elementIndex = elements[0].index;
            const taskStatus = chartData.labels[elementIndex];
            const taskCount = chartData.datasets[0].data[elementIndex];
            setHoverData(`${taskStatus}: ${taskCount} tasks`);
        } else {
            setHoverData(`Total: ${report?.total_tasks || 0} tasks`);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="relative" style={{ width: "100%", height: "300px" }}>
                <Doughnut
                    data={chartData}
                    options={{
                        plugins: {
                            legend: {
                                labels: {
                                    color: darkMode ? "#fff" : "#000",
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        const taskStatus = tooltipItem.label;
                                        const taskCount = tooltipItem.raw;
                                        return `${taskStatus}: ${taskCount} tasks`;
                                    },
                                },
                            },
                            title: {
                                display: true,
                                text: 'Task Completion Overview',
                                font: {
                                    size: 20,
                                },
                                color: darkMode ? "#fff" : "#000",
                            },
                        },
                        onHover: handleHover,
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "70%",
                    }}
                />
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    fontSize: "16px",
                    marginTop: "35px",
                    color: darkMode ? "white" : "black",
                }}
            >
                {hoverData}
            </div>
        </div>
    );
};

export default CircleChart;
