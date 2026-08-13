// =====================================
// FlowFinance - Dashboard
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // =====================================
    // Logout
    // =====================================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }

    // =====================================
    // Load Dashboard
    // =====================================

    loadDashboard(userId);

});


// =====================================
// LOAD DASHBOARD
// =====================================

async function loadDashboard(userId) {

    try {

        console.log("Dashboard User ID:", userId);

        // ---------------------------------
        // SUMMARY
        // ---------------------------------

        const summaryResponse = await fetch(
            `/api/report/${userId}?filter=month`
        );

        if (!summaryResponse.ok) {
            throw new Error(
                `Summary HTTP Error: ${summaryResponse.status}`
            );
        }

        const summaryData = await summaryResponse.json();

        console.log("Dashboard Summary:", summaryData);

        if (!summaryData.success) {
            throw new Error("Summary API failed");
        }

        const summary = summaryData.data || {};

        // IMPORTANT:
        // report API uses totalIncome / totalExpense

        const income = Number(
            summary.totalIncome || 0
        );

        const expense = Number(
            summary.totalExpense || 0
        );

        const balance = Number(
            summary.balance ?? (income - expense)
        );

        const cashflow = income - expense;


        // ---------------------------------
        // DISPLAY SUMMARY
        // ---------------------------------

        const incomeElement =
            document.getElementById("income");

        const expenseElement =
            document.getElementById("expense");

        const balanceElement =
            document.getElementById("balance");

        const cashflowElement =
            document.getElementById("cashflow");


        if (incomeElement) {
            incomeElement.innerText =
                formatCurrency(income);
        }

        if (expenseElement) {
            expenseElement.innerText =
                formatCurrency(expense);
        }

        if (balanceElement) {
            balanceElement.innerText =
                formatCurrency(balance);
        }

        if (cashflowElement) {
            cashflowElement.innerText =
                formatCurrency(cashflow);
        }


        // ---------------------------------
        // BAR CHART
        // ---------------------------------

        createFinanceChart(
            income,
            expense
        );


        // ---------------------------------
        // CATEGORY
        // ---------------------------------

        await loadCategoryChart(userId);


        // ---------------------------------
        // TRANSACTIONS
        // ---------------------------------

        await loadTransactions(userId);


        // ---------------------------------
        // DASHBOARD INSIGHT
        // ---------------------------------

        await loadInsight(userId);


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// =====================================
// FORMAT CURRENCY
// =====================================

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =====================================
// FINANCIAL BAR CHART
// =====================================

function createFinanceChart(
    income,
    expense
) {

    const canvas =
        document.getElementById("financeChart");

    if (!canvas) {
        console.warn(
            "financeChart canvas not found"
        );
        return;
    }

    // Destroy old chart if exists

    if (window.financeChartInstance) {
        window.financeChartInstance.destroy();
    }

    window.financeChartInstance =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: [
                    "Income",
                    "Expense"
                ],

                datasets: [{

                    label:
                        "Financial Overview",

                    data: [
                        income,
                        expense
                    ],

                    backgroundColor: [
                        "#22c55e",
                        "#ef4444"
                    ],

                    borderRadius: 10

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        });

}


// =====================================
// CATEGORY PIE CHART
// =====================================

async function loadCategoryChart(userId) {

    try {

        const response = await fetch(
            `/api/report/category/${userId}?filter=month`
        );

        if (!response.ok) {
            throw new Error(
                `Category HTTP Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        console.log(
            "Dashboard Categories:",
            data
        );

        if (!data.success) {
            return;
        }

        const labels = [];
        const amounts = [];

        (data.data || []).forEach(item => {

            labels.push(
                item.Category || "-"
            );

            amounts.push(
                Number(item.Total || 0)
            );

        });


        const canvas =
            document.getElementById("expenseChart");

        if (!canvas) {
            return;
        }


        if (window.expenseChartInstance) {
            window.expenseChartInstance.destroy();
        }


        window.expenseChartInstance =
            new Chart(canvas, {

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
                            "#e11d48",
                            "#14b8a6",
                            "#f97316"

                        ]

                    }]

                },

                options: {

                    responsive: true

                }

            });


    } catch (error) {

        console.error(
            "Category Chart Error:",
            error
        );

    }

}


// =====================================
// RECENT TRANSACTIONS
// =====================================

async function loadTransactions(userId) {

    try {

        // IMPORTANT:
        // Correct endpoint is report/transactions

        const response = await fetch(
            `/api/report/transactions/${userId}?filter=month`
        );

        if (!response.ok) {

            throw new Error(
                `Transaction HTTP Error: ${response.status}`
            );

        }

        const data =
            await response.json();

        console.log(
            "Dashboard Transactions:",
            data
        );

        if (!data.success) {
            return;
        }


        const table =
            document.getElementById(
                "transactionTable"
            );

        if (!table) {
            return;
        }


        table.innerHTML = "";


        const transactions =
            data.data || [];


        if (transactions.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        No transactions found.
                    </td>
                </tr>
            `;

            return;
        }


        transactions
            .slice(0, 10)
            .forEach(item => {

                const date =
                    item.Transaction_Date
                        ? String(
                            item.Transaction_Date
                        ).split("T")[0]
                        : "-";


                table.innerHTML += `

                    <tr>

                        <td>
                            ${item.Type || "-"}
                        </td>

                        <td>
                            ${item.Category || "-"}
                        </td>

                        <td>
                            ${formatCurrency(
                                Number(item.Amount || 0)
                            )}
                        </td>

                        <td>
                            ${date}
                        </td>

                    </tr>

                `;

            });


    } catch (error) {

        console.error(
            "Transaction Error:",
            error
        );

    }

}


// =====================================
// AI INSIGHT
// =====================================

async function loadInsight(userId) {

    try {

        const response =
            await fetch(
                `/api/insight/${userId}`
            );

        if (!response.ok) {

            throw new Error(
                `Insight HTTP Error: ${response.status}`
            );

        }

        const data =
            await response.json();

        console.log(
            "Dashboard Insight:",
            data
        );


        const element =
            document.getElementById(
                "insight"
            );

        if (!element) {
            return;
        }


        if (data.success) {

            element.innerText =
                data.insight ||
                data.data?.insight ||
                "No AI insight available.";

        } else {

            element.innerText =
                "No AI insight available.";

        }


    } catch (error) {

        console.error(
            "Insight Error:",
            error
        );

        const element =
            document.getElementById(
                "insight"
            );

        if (element) {

            element.innerText =
                "No AI insight available.";

        }

    }

}