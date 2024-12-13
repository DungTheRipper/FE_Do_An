import {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";

const HoursOfDayChart = ({darkMode, report}) => {
    const [dayHours, setDayHours] = useState({
        labels: [
            "0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00",
            "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
            "19:00", "20:00", "21:00", "22:00", "23:00"
        ],
        datasets: [
            {
                label: "Tasks Completed of Hours",
                data: [],
                borderColor: darkMode ? "rgb(134, 239, 172)" : "rgb(75, 192, 192)",
                tension: 0.1
            },
        ]
    });

    useEffect(() => {
        if (!report) return;
        const hoursReport = report.weekly_analysis.hours_report;
        const hoursData = Object.keys(hoursReport).map(hour => hoursReport[hour]);
        setDayHours(prevState => ({
            ...prevState,
            datasets: [
                {
                    ...prevState.datasets[0],
                    data: hoursData
                }
            ]
        }));
    }, [report]);

    return (
        <Line
            data={dayHours}
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
    );
}

export default HoursOfDayChart