// ======================================
// FlowFinance - AI Financial Insights
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    loadInsights();
});


// ======================================
// Load AI Insights
// ======================================

async function loadInsights() {

    const userId = localStorage.getItem("userId");

    // -------------------------------
    // Check Login
    // -------------------------------

    if (!userId) {

        alert("Please Login First.");

        window.location.href = "login.html";

        return;
    }


    // -------------------------------
    // Get HTML Elements
    // -------------------------------

    const insightElement = document.getElementById("insight");

    const balanceElement = document.getElementById("balance");


    // -------------------------------
    // Loading State
    // -------------------------------

    if (insightElement) {
        insightElement.innerText = "Loading AI Recommendation...";
    }

    if (balanceElement) {
        balanceElement.innerText = "Loading...";
    }


    try {

        // -------------------------------
        // API Request
        // -------------------------------

        const response = await fetch(
            `http://localhost:5000/api/insight/${userId}`
        );


        // Check HTTP status

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // -------------------------------
        // Convert Response to JSON
        // -------------------------------

        const data = await response.json();


        console.log("AI Insight Response:", data);


        // -------------------------------
        // Check API Response
        // -------------------------------

        if (!data.success) {

            if (insightElement) {
                insightElement.innerText =
                    "Unable to generate AI insight.";
            }

            if (balanceElement) {
                balanceElement.innerText = "₹0";
            }

            return;
        }


        // -------------------------------
        // Get Data
        // -------------------------------

        const result = data.data || data;


        const income = Number(
            result.Income ||
            result.income ||
            0
        );


        const expense = Number(
            result.Expense ||
            result.expense ||
            0
        );


        const balance = income - expense;


        // -------------------------------
        // AI Suggestion
        // -------------------------------

        let suggestion = "";


        if (income === 0 && expense === 0) {

            suggestion =
                "💡 No financial transactions found. Add some income and expense transactions to receive financial insights.";

        }

        else if (expense > income) {

            suggestion =
                "⚠️ Warning! Your expenses are higher than your income. Try reducing unnecessary expenses and review your spending.";

        }

        else if (expense === income) {

            suggestion =
                "⚠️ Your income and expenses are equal. You are not saving money. Try to keep some amount aside as savings.";

        }

        else {

            const saving = income - expense;

            const savingPercentage =
                (saving / income) * 100;


            if (savingPercentage >= 30) {

                suggestion =
                    "🎉 Excellent! You are maintaining a healthy balance between income and expenses. Keep maintaining this financial discipline.";

            }

            else if (savingPercentage >= 20) {

                suggestion =
                    "👍 Good financial management. You are saving a reasonable portion of your income. Try to increase your savings gradually.";

            }

            else {

                suggestion =
                    "💡 Your balance is positive, but your savings are relatively low. Consider reducing unnecessary expenses.";

            }

        }


        // -------------------------------
        // Display Insight
        // -------------------------------

        if (insightElement) {

            insightElement.innerText = suggestion;

        }


        // -------------------------------
        // Display Balance
        // -------------------------------

        if (balanceElement) {

            balanceElement.innerText =
                "₹" + balance.toFixed(2);

        }

    }


    catch (error) {

        console.error(
            "AI Insight Error:",
            error
        );


        // -------------------------------
        // Error Message
        // -------------------------------

        if (insightElement) {

            insightElement.innerText =
                "Unable to connect to the FlowFinance server.";

        }


        if (balanceElement) {

            balanceElement.innerText =
                "₹0";

        }

    }

};


// ======================================
// Logout
// ======================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href =
            "login.html";

    });

}