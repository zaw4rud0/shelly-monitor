function getCssVariableValue(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName);
}

const chartGridColor = getCssVariableValue('--chart-grid-color');
const chartTextColor = getCssVariableValue('--chart-text-color');

fetch('api/measurements')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('shellyBatteryChart').getContext('2d');
        const timestamps = data.map(item => new Date(parseInt(item.timestamp, 10)));
        const battery = data.map(item => item.charge);

        const color = 'rgb(255, 0, 0)';

        const now = new Date();
        const offset = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Battery charge (%)',
                    data: battery,
                    borderColor: color,
                    backgroundColor: color,
                    yAxisID: 'y'
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        type: 'time',
                        time: {
                            tooltipFormat: 'd. MMM yyyy HH:mm',
                            unit: 'hour',
                            displayFormats: {
                                hour: 'd. MMM HH:mm',
                            }
                        },
                        ticks: {
                            color: chartTextColor,
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 45,
                            source: 'auto',
                            stepSize: 1
                        },
                        title: {
                            color: chartTextColor,
                            display: true,
                            text: 'Timestamp'
                        },
                        grid: {
                            color: chartGridColor
                        },
                        min: offset,
                        max: now
                    },
                    y: {
                        ticks: {
                            color: chartTextColor
                        },
                        grid: {
                            color: chartGridColor
                        },
                        type: 'linear',
                        display: true,
                        beginAtZero: true,
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: chartTextColor
                        }
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                        },
                        zoom: {
                            wheel: {
                                enabled: false,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'x',
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error loading the data:', error));