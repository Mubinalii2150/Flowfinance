// ======================================
// FlowFinance - AI Financial Insights
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadInsights();
    setupLogout();

});


// ======================================
// LOAD AI INSIGHTS
// ======================================

async function loadInsights() {

    const userId = localStorage.getItem("userId");


    // ==================================
    // CHECK LOGIN
    // ==================================

    if (!userId) {

        alert("Please Login First.");

        window.location.href = "login.html";

        return;
    }


    // ==================================
    // HTML ELEMENTS
    // ==================================

    const insightElement =
        document.getElementById("insight");

    const balanceElement =
        document.getElementById("balance");


    // ==================================
    // LOADING STATE
    // ==================================

    if (insightElement) {

        insightElement.innerText =
            "Loading AI Recommendation...";

    }


    if (balanceElement) {

        balanceElement.innerText =
            "Loading...";

    }


    try {

        // ==================================
        // API REQUEST
        // ==================================

        const response = await fetch(
            `/api/insight/${userId}`
        );


        console.log(
            "AI Insight HTTP Status:",
            response.status
        );


        // ==================================
        // HTTP ERROR
        // ==================================

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        // ==================================
        // JSON RESPONSE
        // ==================================

        const data =
            await response.json();


        console.log(
            "AI Insight Response:",
            data
        );


        // ==================================
        // API SUCCESS CHECK
        // ==================================

        if (!data.success) {

            if (insightElement) {

                insightElement.innerText =
                    data.message ||
                    "Unable to generate AI insight.";

            }


            if (balanceElement) {

                balanceElement.innerText =
                    "₹0.00";

            }

            return;
        }


        // ==================================
        // GET DATA
        // ==================================

        const result =
            data.data || data;


        const income =
            Number(
                result.Income ??
                result.income ??
                0
            );


        const expense =
            Number(
                result.Expense ??
                result.expense ??
                0
            );


        const balance =
            income - expense;


        // ==================================
        // AI SUGGESTION
        // ==================================

        let suggestion = "";


        // No transactions
        if (
            income === 0 &&
            expense === 0
        ) {

            suggestion =
                "💡 No financial transactions found. Add some income and expense transactions to receive financial insights.";

        }


        // Expense greater than income
        else if (
            expense > income
        ) {

            suggestion =
                "⚠️ Warning! Your expenses are higher than your income. Try reducing unnecessary expenses and review your spending.";

        }


        // Income equals expense
        else if (
            expense === income
        ) {

            suggestion =
                "⚠️ Your income and expenses are equal. You are not saving money. Try to keep some amount aside as savings.";

        }


        // Income greater than expense
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


        // ==================================
        // DISPLAY INSIGHT
        // ==================================

        if (insightElement) {

            insightElement.innerText =
                suggestion;

        }


        // ==================================
        // DISPLAY BALANCE
        // ==================================

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


        // ==================================
        // ERROR MESSAGE
        // ==================================

        if (insightElement) {

            insightElement.innerText =
                "Unable to connect to the FlowFinance server.";

        }


        if (balanceElement) {

            balanceElement.innerText =
                "₹0.00";

        }

    }

}


// ======================================
// LOGOUT
// ======================================

function setupLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "login.html";

        }
    );

}