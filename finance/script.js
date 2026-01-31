// Global Chart instance to manage updates
let myChart = null;

// View Navigation Functions
function showCalculator(id) {
    document.getElementById('dashboard-view').classList.add('d-none');
    document.querySelectorAll('.calculator-view').forEach(div => div.classList.add('d-none'));
    const calc = document.getElementById(id);
    if (calc) {
        calc.classList.remove('d-none');
        window.scrollTo(0, 0);
    }
}

function showDashboard() {
    document.querySelectorAll('.calculator-view').forEach(div => div.classList.add('d-none'));
    document.getElementById('dashboard-view').classList.remove('d-none');
    window.scrollTo(0, 0);
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(amount);
}

// SIP Calculator
function calculateSIP() {
    const p = parseFloat(document.getElementById('sip-amount').value);
    const r = parseFloat(document.getElementById('sip-rate').value);
    const t = parseFloat(document.getElementById('sip-years').value);

    if (isNaN(p) || isNaN(r) || isNaN(t)) return;

    // Monthly Rate
    const i = r / 12 / 100;
    const months = t * 12;

    // Formula: P * [ (1+i)^n - 1 ] * (1+i) / i
    const result = p * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    const invested = p * months;
    const gains = result - invested;

    document.getElementById('sip-result').innerText = formatCurrency(result);
    document.getElementById('sip-invested').innerText = formatCurrency(invested);
    document.getElementById('sip-gains').innerText = formatCurrency(gains);

    updateChart(invested, gains);
}

// Update SIP Chart
function updateChart(invested, gains) {
    const ctx = document.getElementById('sipChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Est. Returns'],
            datasets: [{
                data: [invested, gains],
                backgroundColor: ['#6c757d', '#198754'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// FD Calculator
function calculateFD() {
    const p = parseFloat(document.getElementById('fd-amount').value);
    const r = parseFloat(document.getElementById('fd-rate').value);
    const t = parseFloat(document.getElementById('fd-years').value);

    if (isNaN(p) || isNaN(r) || isNaN(t)) return;

    // Simple Interest Compounding annually for standard FD view (A = P(1 + r/n)^(nt))
    // Assuming quarterly compounding as is standard for Indian banks
    const n = 4;
    const amount = p * Math.pow(1 + (r / 100) / n, n * t);
    const gains = amount - p;

    document.getElementById('fd-result').innerText = formatCurrency(amount);
    document.getElementById('fd-gains').innerText = formatCurrency(gains);
}

// Mutual Fund (Lumpsum) Calculator
function calculateMF() {
    const p = parseFloat(document.getElementById('mf-amount').value);
    const r = parseFloat(document.getElementById('mf-rate').value);
    const t = parseFloat(document.getElementById('mf-years').value);

    if (isNaN(p) || isNaN(r) || isNaN(t)) return;

    // A = P(1 + r)^t
    const amount = p * Math.pow(1 + r / 100, t);
    const gains = amount - p;

    document.getElementById('mf-result').innerText = formatCurrency(amount);
    document.getElementById('mf-gains').innerText = formatCurrency(gains);
}

// Inflation Calculator
function calculateInflation() {
    const currentCost = parseFloat(document.getElementById('inf-current').value);
    const rate = parseFloat(document.getElementById('inf-rate').value);
    const years = parseFloat(document.getElementById('inf-years').value);

    if (isNaN(currentCost) || isNaN(rate) || isNaN(years)) return;

    // Future Value = Present Value * (1 + r)^n
    const futureCost = currentCost * Math.pow(1 + rate / 100, years);

    document.getElementById('inf-result').innerText = formatCurrency(futureCost);
    
    // Update display text
    document.getElementById('inf-current-display').innerText = formatCurrency(currentCost);
    document.getElementById('inf-years-display').innerText = years;
    document.getElementById('inf-rate-display').innerText = rate;
}

// Compound Interest Calculator
function calculateCI() {
    const p = parseFloat(document.getElementById('ci-principal').value);
    const r = parseFloat(document.getElementById('ci-rate').value);
    const t = parseFloat(document.getElementById('ci-years').value);
    const n = parseFloat(document.getElementById('ci-frequency').value);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) return;

    // A = P(1 + r/n)^(nt)
    const amount = p * Math.pow(1 + (r / 100) / n, n * t);
    const interest = amount - p;

    document.getElementById('ci-result').innerText = formatCurrency(amount);
    document.getElementById('ci-interest').innerText = formatCurrency(interest);
}

// Net Worth Calculator
function calculateNetWorth() {
    let inputs = document.querySelectorAll('.asset-input');
    let totalAssets = 0;
    inputs.forEach(input => {
        totalAssets += Number(input.value);
    });

    inputs = document.querySelectorAll('.liability-input');
    let totalLiabilities = 0;
    inputs.forEach(input => {
        totalLiabilities += Number(input.value);
    });

    const netWorth = totalAssets - totalLiabilities;
    document.getElementById('nw-result').innerText = formatCurrency(netWorth);
}

// Emergency Fund Calculator
function calculateEmergencyFund() {
    const expenses = parseFloat(document.getElementById('ef-expenses').value);
    const months = parseFloat(document.getElementById('ef-months').value);

    if (isNaN(expenses) || isNaN(months)) return;

    const total = expenses * months;
    document.getElementById('ef-result').innerText = formatCurrency(total);
}

// Initial Calculation on Load (Optional, helps populate zeros formatted)
window.onload = function() {
    // We can pre-calculate some defaults if needed, or just let placeholders sit.
    // Let's run SIP calc once to show the chart
    calculateSIP();
};
