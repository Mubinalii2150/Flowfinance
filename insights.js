// ======================================
// FlowFinance - AI Financial Insights
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    initializeInsights();
});


// ======================================
// Initialize
// ======================================

function initializeInsights() {

    const userId = localStorage.getItem("userId");

    if (!userId) {

        alert("Please Login First.");

        window.location.href = "login.html";

        return;
    }

    loadInsights();

    setupButtons();
}


// ======================================
// Load Financial Data
// ======================================

async function loadInsights() {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        return;
    }


    // Show loading

    const loading = document.getElementById("loading");
    const insightContent = document.getElementById("insightContent");

    if (loading) {
        loading.classList.remove("hidden");
    }

    if (insightContent) {
        insightContent.classList.add("hidden");
    }


    try {

        console.log("Loading financial data for User:", userId);


        // ======================================
        // Get Report Data
        // ======================================

        const response = await fetch(
            `http://localhost:5000/api/report/${userId}?filter=month`
        );


        console.log("Response Status:", response.status);


        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " + response.status
            );

        }


        const data = await response.json();


        console.log("Report API Response:", data);


        if (!data.success) {

            throw new Error(
                "API returned success:false"
            );

        }


        // ======================================
        // Get Income / Expense
        // ======================================

        const result = data.data || {};


        const income = Number(
            result.Income ??
            result.income ??
            0
        );


        const expense = Number(
            result.Expense ??
            result.expense ??
            0
        );


        const balance = income - expense;


        console.log("Income:", income);
        console.log("Expense:", expense);
        console.log("Balance:", balance);


        // ======================================
        // Update Summary Cards
        // ======================================

        updateElement(
            "income",
            "₹" + income.toFixed(2)
        );


        updateElement(
            "expense",
            "₹" + expense.toFixed(2)
        );


        updateElement(
            "balance",
            "₹" + balance.toFixed(2)
        );


        // ======================================
        // Update Health Numbers
        // ======================================

        updateElement(
            "healthIncome",
            "₹" + income.toFixed(2)
        );


        updateElement(
            "healthExpense",
            "₹" + expense.toFixed(2)
        );


        // ======================================
        // Calculate Financial Health
        // ======================================

        calculateFinancialHealth(
            income,
            expense,
            balance
        );


        // ======================================
        // Generate AI Recommendation
        // ======================================

        generateInsight(
            income,
            expense,
            balance
        );


    }

    catch (error) {

        console.error(
            "AI Insights Error:",
            error
        );


        updateElement(
            "income",
            "₹0.00"
        );


        updateElement(
            "expense",
            "₹0.00"
        );


        updateElement(
            "balance",
            "₹0.00"
        );


        updateElement(
            "healthIncome",
            "₹0.00"
        );


        updateElement(
            "healthExpense",
            "₹0.00"
        );


        const insight = document.getElementById("insight");

        if (insight) {

            insight.innerText =
                "Unable to load your financial data. Please make sure the FlowFinance server is running.";
        }


        const insightTitle =
            document.getElementById("insightTitle");

        if (insightTitle) {

            insightTitle.innerText =
                "Connection Error";
        }

    }

    finally {

        // ======================================
        // Hide Loading
        // ======================================

        if (loading) {
            loading.classList.add("hidden");
        }

        if (insightContent) {
            insightContent.classList.remove("hidden");
        }

    }

}


// ======================================
// Update HTML Element
// ======================================

function updateElement(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.innerText = value;

    }

}


// ======================================
// Financial Health
// ======================================

function calculateFinancialHealth(
    income,
    expense,
    balance
) {

    const progressBar =
        document.getElementById("progressBar");

    const healthStatus =
        document.getElementById("healthStatus");

    const healthText =
        document.getElementById("healthText");


    let percentage = 0;

    let status = "";

    let message = "";


    // ======================================
    // No Transactions
    // ======================================

    if (income === 0 && expense === 0) {

        percentage = 0;

        status = "No Data";

        message =
            "Add income and expense transactions to analyze your financial health.";

    }


    // ======================================
    // Expenses Higher
    // ======================================

    else if (expense > income) {

        percentage = 20;

        status = "Needs Attention";

        message =
            "Your expenses are higher than your income. Reduce unnecessary spending.";

    }


    // ======================================
    // Equal
    // ======================================

    else if (expense === income) {

        percentage = 50;

        status = "Break-Even";

        message =
            "Your income and expenses are equal. You currently have no savings.";

    }


    // ======================================
    // Positive Balance
    // ======================================

    else {

        const savingPercentage =
            (balance / income) * 100;


        if (savingPercentage >= 30) {

            percentage = 100;

            status = "Excellent";

            message =
                "Excellent financial position. You are maintaining a strong saving rate.";

        }

        else if (savingPercentage >= 20) {

            percentage = 80;

            status = "Good";

            message =
                "Good financial position. Continue controlling your expenses.";

        }

        else if (savingPercentage >= 10) {

            percentage = 60;

            status = "Fair";

            message =
                "Your balance is positive, but you should try to increase your savings.";

        }

        else {

            percentage = 40;

            status = "Low Savings";

            message =
                "Your savings are low. Review your expenses and reduce unnecessary spending.";

        }

    }


    // ======================================
    // Update Progress Bar
    // ======================================

    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    // ======================================
    // Update Status
    // ======================================

    if (healthStatus) {

        healthStatus.innerText =
            status;

    }


    // ======================================
    // Update Health Text
    // ======================================

    if (healthText) {

        healthText.innerText =
            message;

    }

}


// ======================================
// Generate AI Recommendation
// ======================================

function generateInsight(
    income,
    expense,
    balance
) {

    const insight =
        document.getElementById("insight");

    const insightTitle =
        document.getElementById("insightTitle");

    const statusIcon =
        document.getElementById("statusIcon");


    let title = "";

    let message = "";

    let icon = "";


    // ======================================
    // No Data
    // ======================================

    if (income === 0 && expense === 0) {

        title =
            "Start Tracking Your Finances";

        icon = "💡";

        message =
            "No financial transactions were found for this month. Add your income and expenses to receive useful financial recommendations.";

    }


    // ======================================
    // Expense > Income
    // ======================================

    else if (expense > income) {

        title =
            "Spending Alert";

        icon = "⚠️";

        message =
            "Your expenses are higher than your income. You are currently spending more than you earn. Review unnecessary expenses and reduce spending.";

    }


    // ======================================
    // Expense = Income
    // ======================================

    else if (expense === income) {

        title =
            "Break-Even Position";

        icon = "⚠️";

        message =
            "Your income and expenses are equal. You are not building savings this month. Try to reduce expenses and save a portion of your income.";

    }


    // ======================================
    // Positive Balance
    // ======================================

    else {

        const saving =
            income - expense;

        const savingPercentage =
            (saving / income) * 100;


        if (savingPercentage >= 30) {

            title =
                "Excellent Financial Management";

            icon = "🎉";

            message =
                "You are saving more than 30% of your income. Your current income-to-expense balance is strong. Continue maintaining this discipline.";

        }

        else if (savingPercentage >= 20) {

            title =
                "Good Financial Management";

            icon = "👍";

            message =
                "You are maintaining a positive balance and saving a reasonable portion of your income. Try to increase your savings gradually.";

        }

        else {

            title =
                "Increase Your Savings";

            icon = "💡";

            message =
                "Your balance is positive, but your savings rate is relatively low. Review your spending and look for unnecessary expenses.";

        }

    }


    // ======================================
    // Display AI Insight
    // ======================================

    if (insightTitle) {

        insightTitle.innerText =
            title;

    }


    if (statusIcon) {

        statusIcon.innerText =
            icon;

    }


    if (insight) {

        insight.innerText =
            message;

    }

}


// ======================================
// Buttons
// ======================================

function setupButtons() {

    // ======================================
    // Refresh
    // ======================================

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


    // ======================================
    // Logout
    // ======================================

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