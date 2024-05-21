document.addEventListener("DOMContentLoaded", async function () {
    try {
        let email = sessionStorage("email");
        console.log("email: ", email);
        if (!email) {
            console.error("No email found in session storage.");
            alert("No email found in session storage.");
            return;
        }



        const response = await fetch(`https://fundreq.azurewebsites.net/report/` + email);
        if (!response.ok) {
            console.error(`Failed to fetch report: ${response.statusText}`);
            alert("Failed to fetch report.");
            return;
        }

        const data = await response.json();
        if (data.message) {
            console.error(`Error in response data: ${data.message}`);
            alert(data.message);
            return;
        }

        console.log("Report data fetched successfully:", data);

        data.forEach(item => {
            createBarChart(item);
            createPieChart(item);
        });

        renderSummaryCharts(data);

        console.log("Charts rendered successfully.");
    } catch (error) {
        console.error('Error fetching report:', error);
    }
});

function createBarChart(item) {
    const container = document.getElementById('chartsContainer');
    const canvas = document.createElement('canvas');
    canvas.id = `${item.fundingName.replace(/\s+/g, '-')}-bar-chart`;
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Processing', 'Approved', 'Rejected'],
            datasets: [
                {
                    label: item.fundingName,
                    data: [
                        item.counts.processing || 0, 
                        item.counts.Approved || 0, 
                        item.counts.Rejected || 0
                    ],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 159, 64, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPieChart(item) {
    const container = document.getElementById('pieChartsContainer');
    const canvas = document.createElement('canvas');
    canvas.id = `${item.fundingName.replace(/\s+/g, '-')}-pie-chart`;
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Processing', 'Approved', 'Rejected'],
            datasets: [{
                label: item.fundingName,
                data: [
                    item.counts.processing || 0, 
                    item.counts.Approved || 0, 
                    item.counts.Rejected || 0
                ],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function renderSummaryCharts(data) {
    const totalCounts = {
        processing: 0,
        approved: 0,
        rejected: 0
    };

    console.log("initial total counts:", totalCounts);

    data.forEach(item => {
        totalCounts.processing += parseInt(item.counts.processing) || 0;
        totalCounts.approved += parseInt(item.counts.Approved) || 0;
        totalCounts.rejected += parseInt(item.counts.Rejected) || 0;
    });

    console.log("total counts:", totalCounts);

    createSummaryBarChart(totalCounts);
    createSummaryPieChart(totalCounts);
}

function createSummaryBarChart(totalCounts) {
    const container = document.getElementById('summaryBarChartContainer');
    const canvas = document.createElement('canvas');
    canvas.id = 'summaryBarChart';
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Processing', 'Approved', 'Rejected'],
            datasets: [
                {
                    label: 'Summary',
                    data: [totalCounts.processing, totalCounts.approved, totalCounts.rejected],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 159, 64, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createSummaryPieChart(totalCounts) {
    const container = document.getElementById('summaryPieChartContainer');
    const canvas = document.createElement('canvas');
    canvas.id = 'summaryPieChart';
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Processing', 'Approved', 'Rejected'],
            datasets: [{
                label: 'Summary',
                data: [totalCounts.processing, totalCounts.approved, totalCounts.rejected],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

