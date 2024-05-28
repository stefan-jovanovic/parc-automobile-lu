// Function to count fuel types
function countFuelTypes(data) {
    const counts = {};
    data.forEach(item => {
        const fuelType = item['Autre'];
        counts[fuelType] = (counts[fuelType] || 0) + 1;
    });
    return counts;
}

// Function to sort the fuel types by count
function sortFuelTypes(fuelCounts) {
    return Object.entries(fuelCounts)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
}

// Fetch the JSON data and generate the chart
fetch('CARBURANT.json')
    .then(response => response.json())
    .then(jsonData => {
        const fuelCounts = countFuelTypes(jsonData);
        const sortedFuelCounts = sortFuelTypes(fuelCounts);
        const fuelTypes = Object.keys(sortedFuelCounts);
        const fuelNumbers = Object.values(sortedFuelCounts);

        const data = {
            labels: fuelTypes,
            datasets: [{
                label: 'Automobiles par carburant Mai 2024',
                data: fuelNumbers,
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Changed to white for contrast
                borderColor: 'rgba(255, 255, 255, 1)', // Changed to white for contrast
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'x',
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // Grid lines color
                        },
                        ticks: {
                            color: 'white' // Ticks color for visibility
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)' // Grid lines color
                        },
                        ticks: {
                            color: 'white' // Ticks color for visibility
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' // Legend labels color for visibility
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                },
                backgroundColor: 'black' // Set the background color to black
            }
        };

        // Get the canvas context to apply the background color
        const ctx = document.getElementById('myChart').getContext('2d');
        const originalDraw = Chart.controllers.bar.prototype.draw;
        Chart.controllers.bar.prototype.draw = function() {
            originalDraw.apply(this, arguments);
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, this.chart.width, this.chart.height);
            ctx.restore();
        };

        new Chart(ctx, config);
    })
    .catch(error => {
        console.error('Error loading the JSON file:', error);
    });
