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

async function drawChart() {
    const data = await fetchData();

    // Get funding names from session storage
    const fundingNames = JSON.parse(sessionStorage.getItem('FundingNames')) || [];
    console.log("Funding names from session storage:", fundingNames);

    const filteredData = filterData(data, fundingNames);
    const allCategories = [...new Set(filteredData.map(item => item.category.split(": ")[0]))];

    const datasets = fundingNames.map(fundingName => {
        const filteredFundingData = filterData(filteredData, [fundingName]);
        const aggregatedData = aggregateData(filteredFundingData);
        const chartData = prepareChartData(aggregatedData, allCategories);

        return {
            label: fundingName,
            data: chartData.data,
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.1
        };
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allCategories,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Funding Report'
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

document.addEventListener('DOMContentLoaded', drawChart);
