async function fetchData() {
    const response = await fetch('https://fundreq.azurewebsites.net/categories');
    const data = await response.json();
    console.log("Data fetched successfully:", data);
    return data;
}

function filterData(data, fundingNames) {
    return data.filter(item => fundingNames.includes(item.fundingName));
}

function aggregateData(filteredData) {
    const aggregatedData = {};

    filteredData.forEach(item => {
        const [category, amountStr] = item.category.split(": ");
        const amount = parseInt(amountStr.replace("R", ""));
        
        if (!aggregatedData[category]) {
            aggregatedData[category] = 0;
        }

        aggregatedData[category] += amount;
    });

    return aggregatedData;
}

function prepareChartData(aggregatedData, allLabels) {
    const data = allLabels.map(label => aggregatedData[label] || 0);
    console.log("Chart data prepared successfully:", { labels: allLabels, data });
    return { labels: allLabels, data };
}

async function drawCharts() {
    const data = await fetchData();

    // Get funding names from session storage
    const fundingData = JSON.parse(sessionStorage.getItem('FundingData')) || {};
    console.log("Funding names from session storage:", fundingData);

    for (const fundingType in fundingData) {
        const fundingNames = fundingData[fundingType];

        const filteredData = filterData(data, fundingNames);
        const allCategories = [...new Set(filteredData.map(item => item.category.split(": ")[0]))];

        fundingNames.forEach(fundingName => {
            const filteredFundingData = filterData(filteredData, [fundingName]);

            // Draw line chart for each funding name
            drawLineChart(filteredFundingData, fundingName, allCategories);

            // Draw pie chart for each funding name
            drawPieChart(filteredFundingData, fundingName);

            // Draw bar chart for each funding name
            drawBarChart(filteredFundingData, fundingName);
        });
    }
}

function drawLineChart(filteredData, fundingName, allCategories) {
    const filteredFundingData = filterData(filteredData, [fundingName]);
    const aggregatedData = aggregateData(filteredFundingData);
    const chartData = prepareChartData(aggregatedData, allCategories);

    const container = document.getElementById('lineChartContainer');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allCategories,
            datasets: [{
                label: fundingName,
                data: chartData.data,
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: ` ${fundingName}`
                }
            }
        }
    });
}

function drawPieChart(filteredData, fundingName) {
    const aggregatedData = aggregateData(filteredData);
    const labels = Object.keys(aggregatedData);
    const totalFundingAmounts = Object.values(aggregatedData);

    const container = document.getElementById('pieChartContainer');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: totalFundingAmounts,
                backgroundColor: labels.map(() => getRandomColor()),
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: `${fundingName}`
                }
            },
            tooltips: {
                callbacks: {
                    label: function(context) {
                        const fundingName = context.label;
                        const totalAmount = totalFundingAmounts[context.dataIndex];
                        return `${fundingName}: R${totalAmount}`;
                    }
                }
            }
        }
    });
}

function drawBarChart(filteredData, fundingName) {
    const aggregatedData = aggregateData(filteredData);
    const labels = Object.keys(aggregatedData);
    const totalFundingAmounts = Object.values(aggregatedData);

    const container = document.getElementById('barChartContainer');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Funds (in R)',
                data: totalFundingAmounts,
                backgroundColor: labels.map(() => getRandomColor()),
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: `${fundingName}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Funds (in R)'
                    }
                }
            }
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener('DOMContentLoaded', drawCharts);
