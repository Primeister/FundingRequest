document.addEventListener("DOMContentLoaded", async function () {
    const fundManager = sessionStorage.getItem("email");
    if (!fundManager) {
        console.error("No fund manager email found in session storage.");
        alert("No fund manager email found in session storage.");
        return;
    }

    console.log(`Fetching report for fund manager: ${fundManager}`);

    try {
        const response = await fetch(`https://fundreq.azurewebsites.net/report/2549192@students.wits.ac.za`);
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

        const fundingNames = data.map(item => item.fundingName);
        const processingCounts = data.map(item => item.counts.processing);
        const approvedCounts = data.map(item => item.counts.Approved);
        const rejectedCounts = data.map(item => item.counts.Rejected);

        renderBarChart(fundingNames, processingCounts, approvedCounts, rejectedCounts);
        renderPieChart(fundingNames, processingCounts, approvedCounts, rejectedCounts);

        console.log("Charts rendered successfully.");
    } catch (error) {
        console.error('Error fetching report:', error);
        alert('Error fetching report.');
    }
});

function renderBarChart(fundingNames, processingCounts, approvedCounts, rejectedCounts) {
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fundingNames,
            datasets: [
                {
                    label: 'Processing',
                    data: processingCounts,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Approved',
                    data: approvedCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Rejected',
                    data: rejectedCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
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
