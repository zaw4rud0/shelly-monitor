fetch('/api/measurements')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('sensorDataChart').getContext('2d');

        const timestamps = data.map(item => new Date(parseInt(item.timestamp, 10)));
        const temperatures = data.map(item => item.temperature);
        const humidity = data.map(item => item.humidity);

        const color1 = 'rgb(255, 0, 0)';
        const color2 = 'rgb(0, 0, 255)';

        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: color1,
                    backgroundColor: color1,
                    yAxisID: 'y',
                }, {
                    label: 'Relative humidity (%)',
                    data: humidity,
                    borderColor: color2,
                    backgroundColor: color2,
                    yAxisID: 'y1',
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
                        min: last24Hours,
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
                        position: 'left',
                        beginAtZero: true,
                        min: 0,
                        max: 30
                    },
                    y1: {
                        ticks: {
                            color: chartTextColor
                        },
                        grid: {
                            color: chartGridColor,
                            drawOnChartArea: true,
                        },
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        min: 0,
                        max: 50
                    },
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