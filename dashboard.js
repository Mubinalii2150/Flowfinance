// =====================================
// Check Login
// =====================================

const userId = localStorage.getItem("userId");

if (!userId) {
    alert("Please login first.");
    window.location.href = "login.html";
}

// =====================================
// Logout
// =====================================

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.clear();

    window.location.href = "login.html";

});

// =====================================
// Dashboard Summary
// =====================================

fetch(`http://localhost:5000/api/report/${userId}`)

.then(res => res.json())

.then(data => {

    if (!data.success) return;

    const income = Number(data.data.Income || 0);
    const expense = Number(data.data.Expense || 0);
    const balance = income - expense;
    const cashflow = income - expense;

    document.getElementById("income").innerText = "₹" + income;
    document.getElementById("expense").innerText = "₹" + expense;
    document.getElementById("balance").innerText = "₹" + balance;
    document.getElementById("cashflow").innerText = "₹" + cashflow;

    createFinanceChart(income, expense);

});

// =====================================
// Financial Overview Chart
// =====================================

function createFinanceChart(income, expense){

    const ctx = document.getElementById("financeChart");

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:["Income","Expense"],

            datasets:[{

                label:"Financial Overview",

                data:[income,expense],

                backgroundColor:[
                    "#22c55e",
                    "#ef4444"
                ],

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            plugins:{
                legend:{
                    display:false
                }
            }

        }

    });

}

// =====================================
// Expense Pie Chart
// =====================================

fetch(`http://localhost:5000/api/report/category/${userId}`)

.then(res=>res.json())

.then(data=>{

    if(!data.success) return;

    const labels=[];
    const amounts=[];

    data.data.forEach(item=>{

        labels.push(item.Category);
        amounts.push(item.Total);

    });

    const ctx=document.getElementById("expenseChart");

    new Chart(ctx,{

        type:"pie",

        data:{

            labels:labels,

            datasets:[{

                data:amounts,

                backgroundColor:[
                    "#2563eb",
                    "#22c55e",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#06b6d4",
                    "#e11d48"
                ]

            }]

        },

        options:{

            responsive:true

        }

    });

});

// =====================================
// Recent Transactions
// =====================================

fetch(`http://localhost:5000/api/transaction/${userId}`)

.then(res=>res.json())

.then(data=>{

    if(!data.success) return;

    const table=document.getElementById("transactionTable");

    table.innerHTML="";

    data.data.slice(0,10).forEach(item=>{

        table.innerHTML+=`

        <tr>

            <td>${item.Type}</td>

            <td>${item.Category}</td>

            <td>₹${item.Amount}</td>

            <td>${item.Transaction_Date.split("T")[0]}</td>

        </tr>

        `;

    });

});

// =====================================
// AI Insights
// =====================================

fetch(`http://localhost:5000/api/insight/${userId}`)

.then(res=>res.json())

.then(data=>{

    if(data.success){

        document.getElementById("insight").innerText=data.insight;

    }

})

.catch(()=>{

    document.getElementById("insight").innerText="No AI insight available.";

});

// =====================================
// Auto Refresh Every 30 Seconds
// =====================================

setInterval(()=>{

    location.reload();

},30000);