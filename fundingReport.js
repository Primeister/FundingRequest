async function fetchData() {
    const response = await fetch('https://fundreq.azurewebsites.net/categories');
    const data = await response.json();
    console.log("Data fetched successfully:", data);
    return data;
}

function filterData(data, fundingName) {
    return data.filter(item => item.fundingName === fundingName);
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

function getAllUniqueLabels(datasets) {
    const allLabelsSet = new Set();
    datasets.forEach(data => {
        Object.keys(data).forEach(label => allLabelsSet.add(label));
    });
    return Array.from(allLabelsSet);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawChart(datasets) {
    const ctx = document.getElementById('myChart');
    const labels = datasets.length > 0 ? datasets[0].labels : []; // Assuming all datasets have the same labels

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Funding Distribution by Category'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Category'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Amount (R)'
                    }
                }
            }
        }
    });
}

async function init() {
    const data = await fetchData();
    const fundingNames = JSON.parse(sessionStorage.getItem('FundingNames')) || []; // Retrieve funding names from sessionStorage
    const rawDatasets = [];

    for (const fundingName of fundingNames) {
        const filteredData = filterData(data, fundingName);
        console.log(`Data filtered for ${fundingName}:`, filteredData);
        const aggregatedData = aggregateData(filteredData);
        console.log(`Data aggregated for ${fundingName}:`, aggregatedData);
        rawDatasets.push(aggregatedData);
    }

    const allLabels = getAllUniqueLabels(rawDatasets);

    const datasets = fundingNames.map((fundingName, index) => {
        const aggregatedData = rawDatasets[index];
        const chartData = prepareChartData(aggregatedData, allLabels);
        console.log(`Chart data prepared for ${fundingName}:`, chartData);

        return {
            label: fundingName,
            data: chartData.data,
            borderColor: getRandomColor(),
            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
            fill: false
        };
    });

    drawChart(datasets);
    console.log("datasets: ", datasets);
}

document.addEventListener('DOMContentLoaded', init);



