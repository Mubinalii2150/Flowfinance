// ======================================
// FlowFinance - AI Financial Insights
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    loadInsights();
    setupRefresh();
    setupLogout();
});


// ======================================
// LOAD INSIGHTS
// ======================================

async function loadInsights() {

    const userId = localStorage.getItem("userId");

    // ----------------------------------
    // LOGIN CHECK
    // ----------------------------------

    if (!userId) {

        alert("Please Login First.");

        window.location.href = "login.html";

        return;
    }


    // ----------------------------------
    // HTML ELEMENTS
    // ----------------------------------

    const incomeElement =
        document.getElementById("income");

    const expenseElement =
        document.getElementById("expense");

    const balanceElement =
        document.getElementById("balance");

    const insightElement =
        document.getElementById("insight");

    const healthIncomeElement =
        document.getElementById("healthIncome");

    const healthExpenseElement =
        document.getElementById("healthExpense");

    const healthStatusElement =
        document.getElementById("healthStatus");

    const healthTextElement =
        document.getElementById("healthText");

    const progressBar =
        document.getElementById("progressBar");

    const loadingElement =
        document.getElementById("loading");

    const insightContent =
        document.getElementById("insightContent");


    // ----------------------------------
    // LOADING
    // ----------------------------------

    if (loadingElement) {
        loadingElement.classList.remove("hidden");
    }

    if (insightContent) {
        insightContent.classList.add("hidden");
    }


    try {

        // =================================
        // API REQUEST
        // =================================

        const response = await fetch(
            `/api/insight/${userId}`
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data = await response.json();


        console.log(
            "AI Insight Response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message || "Unable to load insights"
            );

        }


        // =================================
        // GET BACKEND DATA
        // =================================

        const result =
            data.data || {};


        // IMPORTANT:
        // Backend sends:
        //
        // income
        // expense
        // balance
        // insights

        const income =
            Number(result.income || 0);

        const expense =
            Number(result.expense || 0);

        const balance =
            Number(result.balance || 0);


        console.log("Income:", income);
        console.log("Expense:", expense);
        console.log("Balance:", balance);


        // =================================
        // DISPLAY SUMMARY
        // =================================

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


        // =================================
        // HEALTH CARD
        // =================================

        if (healthIncomeElement) {

            healthIncomeElement.innerText =
                formatCurrency(income);

        }


        if (healthExpenseElement) {

            healthExpenseElement.innerText =
                formatCurrency(expense);

        }


        // =================================
        // FINANCIAL HEALTH
        // =================================

        let healthPercentage = 0;

        if (income > 0) {

            healthPercentage =
                ((income - expense) / income) * 100;

        }


        // Keep between 0 and 100

        healthPercentage =
            Math.max(
                0,
                Math.min(
                    100,
                    healthPercentage
                )
            );


        if (progressBar) {

            progressBar.style.width =
                `${healthPercentage}%`;

        }


        if (healthStatusElement) {

            if (income === 0 && expense === 0) {

                healthStatusElement.innerText =
                    "No Data";

            }

            else if (expense > income) {

                healthStatusElement.innerText =
                    "Needs Attention";

            }

            else if (expense === income) {

                healthStatusElement.innerText =
                    "Balanced";

            }

            else if (healthPercentage >= 30) {

                healthStatusElement.innerText =
                    "Excellent";

            }

            else if (healthPercentage >= 20) {

                healthStatusElement.innerText =
                    "Good";

            }

            else {

                healthStatusElement.innerText =
                    "Moderate";

            }

        }


        if (healthTextElement) {

            if (income === 0 && expense === 0) {

                healthTextElement.innerText =
                    "Add transactions to calculate your financial health.";

            }

            else if (expense > income) {

                healthTextElement.innerText =
                    "Your expenses are higher than your income. Review your spending.";

            }

            else {

                healthTextElement.innerText =
                    `You currently retain approximately ${healthPercentage.toFixed(1)}% of your income.`;

            }

        }


        // =================================
        // AI INSIGHT
        // =================================

        let suggestion = "";


        if (
            income === 0 &&
            expense === 0
        ) {

            suggestion =
                "💡 No financial transactions found. Add some income and expense transactions to receive financial insights.";

        }

        else if (
            expense > income
        ) {

            suggestion =
                "⚠️ Warning! Your expenses are higher than your income. Try reducing unnecessary expenses and review your spending.";

        }

        else if (
            expense === income
        ) {

            suggestion =
                "⚠️ Your income and expenses are equal. You are not saving money. Try to keep some amount aside as savings.";

        }

        else {

            const saving =
                income - expense;


            const savingPercentage =
                (saving / income) * 100;


            if (
                savingPercentage >= 30
            ) {

                suggestion =
                    "🎉 Excellent! You are maintaining a healthy balance between income and expenses. Keep maintaining this financial discipline.";

            }

            else if (
                savingPercentage >= 20
            ) {

                suggestion =
                    "👍 Good financial management. You are saving a reasonable portion of your income. Try to increase your savings gradually.";

            }

            else {

                suggestion =
                    "💡 Your balance is positive, but your savings are relatively low. Consider reducing unnecessary expenses.";

            }

        }


        // =================================
        // DISPLAY INSIGHT
        // =================================

        if (insightElement) {

            insightElement.innerText =
                suggestion;

        }


        // =================================
        // SHOW CONTENT
        // =================================

        if (loadingElement) {

            loadingElement.classList.add("hidden");

        }


        if (insightContent) {

            insightContent.classList.remove("hidden");

        }


    }

    catch (error) {

        console.error(
            "AI Insight Error:",
            error
        );


        if (loadingElement) {

            loadingElement.classList.add("hidden");

        }


        if (insightContent) {

            insightContent.classList.remove("hidden");

        }


        if (insightElement) {

            insightElement.innerText =
                "Unable to load financial insight.";

        }


        if (balanceElement) {

            balanceElement.innerText =
                "₹0.00";

        }

    }

}


// ======================================
// REFRESH BUTTON
// ======================================

function setupRefresh() {

    const refreshBtn =
        document.getElementById("refreshBtn");


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            () => {

                loadInsights();

            }
        );

    }

}


// ======================================
// LOGOUT
// ======================================

function setupLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.clear();

                window.location.href =
                    "login.html";

            }
        );

    }

}


// ======================================
// CURRENCY
// ======================================

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