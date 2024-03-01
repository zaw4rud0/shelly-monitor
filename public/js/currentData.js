fetch('/api/measurements/current')
    .then(response => response.json())
    .then(data => {
        document.getElementById('currentTemperature').textContent = data.temperature.toFixed(1);
        document.getElementById('currentHumidity').textContent = data.humidity.toFixed(1);
        document.getElementById('currentCharge').textContent = data.charge;
    })
    .catch(error => {
        console.error('Error fetching current data:', error);
        document.getElementById('currentTemperature').textContent = 'N/A';
        document.getElementById('currentHumidity').textContent = 'N/A';
    });