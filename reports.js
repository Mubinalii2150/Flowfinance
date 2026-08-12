// ======================================================
// FlowFinance - Reports
// Text + Charts PDF Report
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------
    // User
    // --------------------------------------------------

    const userId = localStorage.getItem("userId");
    const API_URL = "/api/report";
    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // --------------------------------------------------
    // Global variables
    // --------------------------------------------------

    let currentFilter = "month";

    let reportChart = null;
    let pieChart = null;

    let reportData = {
        income: 0,
        expense: 0,
        balance: 0,
        saving: 0
    };

    let categoryData = [];
    let transactionData = [];

    // ==================================================
    // Initialize
    // ==================================================

    setupFilters();
    setupButtons();

    loadAllReports(currentFilter);


    // ==================================================
    // FILTERS
    // ==================================================

    function setupFilters() {

        const buttons = document.querySelectorAll(".filter-btn");

        buttons.forEach(button => {

            button.addEventListener("click", function () {

                buttons.forEach(btn => {
                    btn.classList.remove("active");
                });

                this.classList.add("active");

                currentFilter = this.dataset.filter;

                console.log("Selected filter:", currentFilter);

                loadAllReports(currentFilter);

            });

        });

    }


    // ==================================================
    // LOAD ALL REPORT DATA
    // ==================================================

    async function loadAllReports(filter) {

        try {

            await Promise.all([
                loadSummary(filter),
                loadCategories(filter),
                loadTransactions(filter)
            ]);

        } catch (error) {

            console.error("Report loading error:", error);

        }

    }


    // ==================================================
    // SUMMARY
    // ==================================================

    async function loadSummary(filter) {

        try {

            const url =
                        `${API_URL}/${userId}?filter=${encodeURIComponent(filter)}`;

            console.log("Summary URL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            console.log("Summary:", data);

            if (!data.success) {
                throw new Error("Unable to load summary");
            }

            const income = Number(data.data.Income || 0);
            const expense = Number(data.data.Expense || 0);

            const balance = income - expense;

            reportData.income = income;
            reportData.expense = expense;
            reportData.balance = balance;
            reportData.saving = balance;

            updateSummaryCards();

            drawBarChart(income, expense);

        } catch (error) {

            console.error("Summary error:", error);

        }

    }


    // ==================================================
    // UPDATE SUMMARY CARDS
    // ==================================================

    function updateSummaryCards() {

        const incomeElement = document.getElementById("income");
        const expenseElement = document.getElementById("expense");
        const balanceElement = document.getElementById("balance");
        const savingElement = document.getElementById("saving");

        if (incomeElement) {
            incomeElement.textContent =
                formatCurrency(reportData.income);
        }

        if (expenseElement) {
            expenseElement.textContent =
                formatCurrency(reportData.expense);
        }

        if (balanceElement) {
            balanceElement.textContent =
                formatCurrency(reportData.balance);
        }

        if (savingElement) {
            savingElement.textContent =
                formatCurrency(reportData.saving);
        }

    }


    // ==================================================
    // BAR CHART
    // ==================================================

    function drawBarChart(income, expense) {

        const canvas = document.getElementById("reportChart");

        if (!canvas) {
            console.warn("reportChart canvas not found");
            return;
        }

        if (reportChart) {
            reportChart.destroy();
        }

        reportChart = new Chart(canvas, {

            type: "bar",

            data: {

                labels: [
                    "Income",
                    "Expense"
                ],

                datasets: [{

                    label: "Amount",

                    data: [
                        income,
                        expense
                    ],

                    backgroundColor: [
                        "#22c55e",
                        "#ef4444"
                    ],

                    borderRadius: 8,

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {
                                return "₹" + value;
                            }

                        }

                    }

                }

            }

        });

    }


    // ==================================================
    // CATEGORY REPORT
    // ==================================================

    async function loadCategories(filter) {

        try {
             const url =
                       `${API_URL}/category/${userId}?filter=${encodeURIComponent(filter)}`;
            
            console.log("Category URL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            console.log("Categories:", data);

            if (!data.success) {
                throw new Error("Unable to load categories");
            }

            categoryData = data.data || [];

            const labels = [];
            const amounts = [];

            categoryData.forEach(item => {

                labels.push(item.Category);

                amounts.push(Number(item.Total || 0));

            });

            drawPieChart(labels, amounts);

        } catch (error) {

            console.error("Category error:", error);

        }

    }


    // ==================================================
    // PIE CHART
    // ==================================================

    function drawPieChart(labels, amounts) {

        const canvas = document.getElementById("pieChart");

        if (!canvas) {
            console.warn("pieChart canvas not found");
            return;
        }

        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(canvas, {

            type: "pie",

            data: {

                labels: labels,

                datasets: [{

                    data: amounts,

                    backgroundColor: [

                        "#2563eb",
                        "#22c55e",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6",
                        "#06b6d4",
                        "#ec4899",
                        "#14b8a6",
                        "#f97316",
                        "#64748b"

                    ],

                    borderWidth: 2,

                    borderColor: "#ffffff"

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }


    // ==================================================
    // TRANSACTIONS
    // ==================================================

    async function loadTransactions(filter) {

        try {

            const url =
                      `${API_URL}/transactions/${userId}?filter=${encodeURIComponent(filter)}`;
            console.log("Transactions URL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            console.log("Transactions:", data);

            if (!data.success) {
                throw new Error("Unable to load transactions");
            }

            transactionData = data.data || [];

            displayTransactions();

        } catch (error) {

            console.error("Transaction error:", error);

        }

    }


    // ==================================================
    // DISPLAY TRANSACTIONS
    // ==================================================

    function displayTransactions() {

        const table = document.getElementById("reportTable");

        if (!table) {
            return;
        }

        table.innerHTML = "";

        if (transactionData.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        No transactions found.
                    </td>
                </tr>
            `;

            return;
        }

        transactionData.forEach(item => {

            const date =
                formatDate(item.Transaction_Date);

            const category =
                item.Category || "-";

            const type =
                item.Type || "-";

            const amount =
                Number(item.Amount || 0);

            table.innerHTML += `

                <tr>

                    <td>
                        ${date}
                    </td>

                    <td>
                        ${category}
                    </td>

                    <td>
                        ${type}
                    </td>

                    <td>
                        ${formatCurrency(amount)}
                    </td>

                </tr>

            `;

        });

    }


    // ==================================================
    // BUTTONS
    // ==================================================

    function setupButtons() {

        // ----------------------------------------------
        // PDF
        // ----------------------------------------------

        const downloadButton =
            document.getElementById("downloadPdf");

        if (downloadButton) {

            downloadButton.addEventListener("click", generatePDF);

        }


        // ----------------------------------------------
        // Logout
        // ----------------------------------------------

        const logoutButton =
            document.getElementById("logoutBtn");

        if (logoutButton) {

            logoutButton.addEventListener("click", () => {

                const confirmLogout =
                    confirm("Are you sure you want to logout?");

                if (!confirmLogout) {
                    return;
                }

                localStorage.clear();

                window.location.href = "login.html";

            });

        }

    }


    // ==================================================
    // GENERATE PDF
    // ==================================================

    function generatePDF() {

        // Check jsPDF

        if (!window.jspdf || !window.jspdf.jsPDF) {

            alert(
                "jsPDF is not loaded. Add the jsPDF CDN to reports.html."
            );

            return;

        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });


        // ------------------------------------------------
        // PAGE SETTINGS
        // ------------------------------------------------

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        const margin = 18;

        let y = 20;


        // ------------------------------------------------
        // HEADER
        // ------------------------------------------------

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(22);

        pdf.text(
            "FlowFinance",
            margin,
            y
        );

        y += 8;

        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(11);

        pdf.text(
            "AI Powered Business Finance Report",
            margin,
            y
        );

        y += 7;

        pdf.setFontSize(10);

        pdf.text(
            "Report Period: " + getFilterName(currentFilter),
            margin,
            y
        );

        y += 5;

        pdf.text(
            "Generated On: " + formatDate(new Date()),
            margin,
            y
        );

        y += 10;


        // ------------------------------------------------
        // LINE
        // ------------------------------------------------

        pdf.line(
            margin,
            y,
            pageWidth - margin,
            y
        );

        y += 10;


        // ------------------------------------------------
        // FINANCIAL SUMMARY
        // ------------------------------------------------

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(15);

        pdf.text(
            "Financial Summary",
            margin,
            y
        );

        y += 9;

        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(11);

        pdf.text(
            "Total Income",
            margin,
            y
        );

        pdf.text(
            formatCurrency(reportData.income),
            100,
            y
        );

        y += 7;

        pdf.text(
            "Total Expense",
            margin,
            y
        );

        pdf.text(
            formatCurrency(reportData.expense),
            100,
            y
        );

        y += 7;

        pdf.text(
            "Balance",
            margin,
            y
        );

        pdf.text(
            formatCurrency(reportData.balance),
            100,
            y
        );

        y += 7;

        pdf.text(
            "Savings",
            margin,
            y
        );

        pdf.text(
            formatCurrency(reportData.saving),
            100,
            y
        );

        y += 12;


        // ------------------------------------------------
        // BAR CHART
        // ------------------------------------------------

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(15);

        pdf.text(
            "Income vs Expense",
            margin,
            y
        );

        y += 6;

        const barCanvas =
            document.getElementById("reportChart");

        if (barCanvas) {

            const barImage =
                barCanvas.toDataURL(
                    "image/png",
                    1.0
                );

            pdf.addImage(
                barImage,
                "PNG",
                margin,
                y,
                175,
                70
            );

            y += 78;

        }


        // ------------------------------------------------
        // PIE CHART
        // ------------------------------------------------

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(15);

        pdf.text(
            "Expense Analysis",
            margin,
            y
        );

        y += 6;

        const pieCanvas =
            document.getElementById("pieChart");

        if (pieCanvas) {

            const pieImage =
                pieCanvas.toDataURL(
                    "image/png",
                    1.0
                );

            pdf.addImage(
                pieImage,
                "PNG",
                margin,
                y,
                175,
                75
            );

            y += 83;

        }


        // ------------------------------------------------
        // PAGE BREAK
        // ------------------------------------------------

        if (y > 250) {

            pdf.addPage();

            y = 20;

        }


        // ------------------------------------------------
        // TRANSACTIONS
        // ------------------------------------------------

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(15);

        pdf.text(
            "Recent Transactions",
            margin,
            y
        );

        y += 10;

        pdf.setFontSize(9);

        pdf.setFont("helvetica", "bold");

        pdf.text("Date", margin, y);

        pdf.text("Category", 55, y);

        pdf.text("Type", 110, y);

        pdf.text("Amount", 150, y);

        y += 5;

        pdf.line(
            margin,
            y,
            pageWidth - margin,
            y
        );

        y += 7;

        pdf.setFont("helvetica", "normal");

        if (transactionData.length === 0) {

            pdf.text(
                "No transactions found.",
                margin,
                y
            );

        } else {

            transactionData.forEach(item => {

                // Create new page if necessary

                if (y > 275) {

                    pdf.addPage();

                    y = 20;

                    pdf.setFont("helvetica", "bold");

                    pdf.setFontSize(15);

                    pdf.text(
                        "Recent Transactions",
                        margin,
                        y
                    );

                    y += 10;

                    pdf.setFontSize(9);

                    pdf.text("Date", margin, y);

                    pdf.text("Category", 55, y);

                    pdf.text("Type", 110, y);

                    pdf.text("Amount", 150, y);

                    y += 8;

                    pdf.setFont("helvetica", "normal");

                }


                const date =
                    formatDate(item.Transaction_Date);

                const category =
                    String(item.Category || "-");

                const type =
                    String(item.Type || "-");

                const amount =
                    formatCurrency(
                        Number(item.Amount || 0)
                    );


                pdf.text(
                    date,
                    margin,
                    y
                );

                pdf.text(
                    category.substring(0, 25),
                    55,
                    y
                );

                pdf.text(
                    type,
                    110,
                    y
                );

                pdf.text(
                    amount,
                    150,
                    y
                );

                y += 7;

            });

        }


        // ------------------------------------------------
        // FINANCIAL INSIGHT
        // ------------------------------------------------

        if (y > 250) {

            pdf.addPage();

            y = 20;

        }

        y += 10;

        pdf.setFont("helvetica", "bold");

        pdf.setFontSize(15);

        pdf.text(
            "Financial Insight",
            margin,
            y
        );

        y += 8;

        pdf.setFont("helvetica", "normal");

        pdf.setFontSize(10);

        const insightText =
            createFinancialInsight();

        const lines =
            pdf.splitTextToSize(
                insightText,
                pageWidth - margin * 2
            );

        pdf.text(
            lines,
            margin,
            y
        );


        // ------------------------------------------------
        // FOOTER ON ALL PAGES
        // ------------------------------------------------

        const totalPages =
            pdf.internal.getNumberOfPages();

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            pdf.setPage(page);

            pdf.setFont("helvetica", "normal");

            pdf.setFontSize(8);

            pdf.text(
                "FlowFinance | AI Powered Business Finance Platform",
                margin,
                pageHeight - 10
            );

            pdf.text(
                `Page ${page} of ${totalPages}`,
                pageWidth - margin - 25,
                pageHeight - 10
            );

        }


        // ------------------------------------------------
        // SAVE PDF
        // ------------------------------------------------

        const filename =
            `FlowFinance_${currentFilter}_Report.pdf`;

        pdf.save(filename);

    }


    // ==================================================
    // FINANCIAL INSIGHT TEXT
    // ==================================================

    function createFinancialInsight() {

        const income =
            reportData.income;

        const expense =
            reportData.expense;

        const balance =
            reportData.balance;


        if (income === 0 && expense === 0) {

            return (
                "No financial transactions were recorded " +
                "for the selected period."
            );

        }


        const expensePercentage =
            income > 0
                ? (expense / income) * 100
                : 0;


        if (expense > income) {

            return (
                `Your total income is ${formatCurrency(income)} ` +
                `and your total expense is ${formatCurrency(expense)}. ` +
                `Your expenses are higher than your income, resulting ` +
                `in a negative balance of ${formatCurrency(balance)}. ` +
                `Review your major expense categories and consider ` +
                `reducing unnecessary spending.`
            );

        }


        if (expensePercentage > 80) {

            return (
                `Your total income is ${formatCurrency(income)} ` +
                `and your total expense is ${formatCurrency(expense)}. ` +
                `Your current balance is ${formatCurrency(balance)}. ` +
                `Your expenses represent approximately ` +
                `${expensePercentage.toFixed(1)}% of your income. ` +
                `Keeping expenses under control could improve your ` +
                `available savings.`
            );

        }


        return (
            `Your total income is ${formatCurrency(income)} ` +
            `and your total expense is ${formatCurrency(expense)}. ` +
            `Your current balance is ${formatCurrency(balance)}. ` +
            `Based on the selected period, your income is currently ` +
            `higher than your expenses.`
        );

    }


    // ==================================================
    // CURRENCY
    // ==================================================

    function formatCurrency(amount) {

        return (
            "₹" +
            Number(amount || 0).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        );

    }


    // ==================================================
    // DATE
    // ==================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue);

        if (isNaN(date.getTime())) {
            return String(dateValue);
        }

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const year =
            date.getFullYear();

        return `${day}-${month}-${year}`;

    }


    // ==================================================
    // FILTER NAME
    // ==================================================

    function getFilterName(filter) {

        switch (filter) {

            case "today":
                return "Today";

            case "week":
                return "This Week";

            case "month":
                return "This Month";

            case "year":
                return "This Year";

            default:
                return "This Month";

        }

    }

});