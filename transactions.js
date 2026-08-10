// ==========================================
// FlowFinance - Transactions
// ==========================================

const API_URL = "/api/transaction";

let allTransactions = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Transactions JS loaded");

    const userId = localStorage.getItem("userId");

    console.log("Logged in User ID:", userId);

    if (!userId) {

        alert("Please Login First.");

        window.location.href = "login.html";

        return;
    }


    // Set today's date
    const dateInput =
        document.getElementById("transactionDate");

    if (dateInput) {

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];
    }


    // Setup everything
    setupAddTransaction();

    setupModal();

    setupSearch();

    setupFilter();

    setupLogout();

    // Load existing transactions
    loadTransactions();

});


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    const userId =
        localStorage.getItem("userId");

    const table =
        document.getElementById("transactionTable");


    if (!userId) {

        alert("Please Login First.");

        window.location.href =
            "login.html";

        return;
    }


    if (!table) {

        console.error(
            "transactionTable not found"
        );

        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="6">
                Loading transactions...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                `${API_URL}/${userId}`
            );


        console.log(
            "GET status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "GET transactions response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load transactions."
            );
        }


        allTransactions =
            Array.isArray(data.data)
                ? data.data
                : [];


        displayTransactions(
            allTransactions
        );


        updateSummary(
            allTransactions
        );

    }

    catch (error) {

        console.error(
            "LOAD TRANSACTIONS ERROR:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="6">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(transactions) {

    const table =
        document.getElementById(
            "transactionTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (
        !Array.isArray(transactions) ||
        transactions.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No transactions found.
                </td>
            </tr>
        `;

        return;
    }


    transactions.forEach(transaction => {

        const id =
            transaction.Transaction_ID;


        const date =
            transaction.Transaction_Date
                ? String(
                    transaction.Transaction_Date
                ).split("T")[0]
                : "-";


        const category =
            transaction.Category || "-";


        const type =
            transaction.Type || "-";


        const description =
            transaction.Description || "-";


        const amount =
            Number(
                transaction.Amount || 0
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(date)}
            </td>

            <td>
                ${escapeHTML(category)}
            </td>

            <td>
                ${escapeHTML(type)}
            </td>

            <td>
                ${escapeHTML(description)}
            </td>

            <td>
                ₹${amount.toFixed(2)}
            </td>

            <td>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${id}">

                    Delete

                </button>

            </td>

        `;


        table.appendChild(row);

    });


    setupDeleteButtons();
}


// ==========================================
// ADD TRANSACTION
// ==========================================

function setupAddTransaction() {

    const form =
        document.getElementById(
            "transactionForm"
        );


    if (!form) {

        console.error(
            "transactionForm NOT FOUND"
        );

        return;
    }


    console.log(
        "Transaction form found"
    );


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "Transaction form submitted"
            );


            const userId =
                localStorage.getItem(
                    "userId"
                );


            if (!userId) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const typeElement =
                document.getElementById(
                    "transactionType"
                );


            const categoryElement =
                document.getElementById(
                    "category"
                );


            const amountElement =
                document.getElementById(
                    "amount"
                );


            const dateElement =
                document.getElementById(
                    "transactionDate"
                );


            const descriptionElement =
                document.getElementById(
                    "description"
                );


            if (
                !typeElement ||
                !categoryElement ||
                !amountElement ||
                !dateElement ||
                !descriptionElement
            ) {

                console.error(
                    "One or more transaction form fields are missing."
                );

                alert(
                    "Transaction form is incomplete."
                );

                return;
            }


            const type =
                typeElement.value;


            const category =
                categoryElement.value.trim();


            const amount =
                amountElement.value;


            const date =
                dateElement.value;


            const description =
                descriptionElement.value.trim();


            // ==================================
            // VALIDATION
            // ==================================

            if (!type) {

                alert(
                    "Please select transaction type."
                );

                return;
            }


            if (!category) {

                alert(
                    "Please enter category."
                );

                return;
            }


            if (
                !amount ||
                Number(amount) <= 0
            ) {

                alert(
                    "Please enter a valid amount."
                );

                return;
            }


            if (!date) {

                alert(
                    "Please select date."
                );

                return;
            }


            // ==================================
            // DATA
            // ==================================

            const transactionData = {

                User_ID:
                    Number(userId),

                Type:
                    type,

                Category:
                    category,

                Amount:
                    Number(amount),

                Description:
                    description,

                Transaction_Date:
                    date

            };


            console.log(
                "POST transaction:",
                transactionData
            );


            const saveButton =
                document.getElementById(
                    "saveTransactionBtn"
                );


            if (saveButton) {

                saveButton.disabled = true;

                saveButton.innerText =
                    "Saving...";
            }


            try {

                // ==================================
                // POST REQUEST
                // ==================================

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    transactionData
                                )
                        }
                    );


                console.log(
                    "POST status:",
                    response.status
                );


                const data =
                    await response.json();


                console.log(
                    "POST response:",
                    data
                );


                // ==================================
                // CHECK RESPONSE
                // ==================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Transaction could not be added."
                    );
                }


                // ==================================
                // SUCCESS
                // ==================================

                alert(
                    "Transaction added successfully!"
                );


                // Reset form
                form.reset();


                // Set today's date again
                if (dateElement) {

                    dateElement.value =
                        new Date()
                            .toISOString()
                            .split("T")[0];
                }


                // Close modal
                closeModal();


                // Reload transactions
                await loadTransactions();

            }

            catch (error) {

                console.error(
                    "ADD TRANSACTION ERROR:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to add transaction."
                );

            }

            finally {

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.innerText =
                        "Save Transaction";
                }
            }

        }
    );
}


// ==========================================
// MODAL
// ==========================================

function setupModal() {

    const modal =
        document.querySelector(
            ".modal-overlay"
        );


    const openButton =
        document.getElementById(
            "openModalBtn"
        );


    const closeButton =
        document.getElementById(
            "closeModalBtn"
        );


    const cancelButton =
        document.getElementById(
            "cancelBtn"
        );


    console.log(
        "Modal elements:",
        {
            modal,
            openButton,
            closeButton,
            cancelButton
        }
    );


    if (!modal) {

        console.error(
            "modal-overlay not found"
        );

        return;
    }


    // OPEN MODAL
    if (openButton) {

        openButton.addEventListener(
            "click",
            () => {

                modal.classList.add(
                    "show"
                );

            }
        );
    }


    // CLOSE BUTTON
    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );
    }


    // CANCEL BUTTON
    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );
    }


    // CLICK OUTSIDE
    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();
            }

        }
    );
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    const modal =
        document.querySelector(
            ".modal-overlay"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}


// ==========================================
// DELETE BUTTONS
// ==========================================

function setupDeleteButtons() {

    const buttons =
        document.querySelectorAll(
            ".delete-btn"
        );


    buttons.forEach(button => {

        button.onclick =
            async () => {

                const id =
                    button.dataset.id;

                await deleteTransaction(id);

            };

    });
}


// ==========================================
// DELETE TRANSACTION
// ==========================================

async function deleteTransaction(id) {

    if (!id) {

        alert(
            "Transaction ID not found."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        console.log(
            "DELETE response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Delete failed."
            );
        }


        alert(
            "Transaction deleted successfully."
        );


        await loadTransactions();

    }

    catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            error.message ||
            "Unable to delete transaction."
        );
    }
}


// ==========================================
// SUMMARY
// ==========================================

function updateSummary(transactions) {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.Amount || 0
                );


            const type =
                String(
                    transaction.Type || ""
                ).toLowerCase();


            if (type === "income") {

                income += amount;
            }


            if (type === "expense") {

                expense += amount;
            }

        }
    );


    const balance =
        income - expense;


    const incomeElement =
        document.getElementById(
            "totalIncome"
        );


    const expenseElement =
        document.getElementById(
            "totalExpense"
        );


    const balanceElement =
        document.getElementById(
            "totalBalance"
        );


    if (incomeElement) {

        incomeElement.innerText =
            "₹" +
            income.toFixed(2);
    }


    if (expenseElement) {

        expenseElement.innerText =
            "₹" +
            expense.toFixed(2);
    }


    if (balanceElement) {

        balanceElement.innerText =
            "₹" +
            balance.toFixed(2);
    }
}


// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        applyFilters
    );
}


// ==========================================
// FILTER
// ==========================================

function setupFilter() {

    const typeFilter =
        document.getElementById(
            "typeFilter"
        );


    if (!typeFilter) return;


    typeFilter.addEventListener(
        "change",
        applyFilters
    );
}


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const typeFilter =
        document.getElementById(
            "typeFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    const filtered =
        allTransactions.filter(
            transaction => {

                const category =
                    String(
                        transaction.Category || ""
                    ).toLowerCase();


                const description =
                    String(
                        transaction.Description || ""
                    ).toLowerCase();


                const transactionType =
                    String(
                        transaction.Type || ""
                    );


                const matchesSearch =
                    category.includes(search) ||
                    description.includes(search);


                const matchesType =
                    selectedType === "all" ||
                    transactionType === selectedType;


                return (
                    matchesSearch &&
                    matchesType
                );

            }
        );


    displayTransactions(
        filtered
    );
}


// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) return;


    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "login.html";

        }
    );
}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}