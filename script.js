```javascript
// ========================================
// POCKETSMART AI
// ========================================

// Get saved data
let transactions = JSON.parse(
    localStorage.getItem("pocketTransactions")
) || [];

let budget = Number(
    localStorage.getItem("pocketBudget")
) || 0;


// ========================================
// HOME
// ========================================

function goHome() {
    window.location.href = "index.html";
}


// ========================================
// ADD INCOME
// ========================================

function addIncome() {

    let amount = prompt("Enter income amount:");

    if (amount === null) {
        return;
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let source = prompt(
        "Enter income source:"
    );

    if (source === null || source.trim() === "") {
        source = "Income";
    }

    transactions.push({
        type: "income",
        amount: amount,
        description: source,
        date: new Date().toLocaleDateString()
    });

    saveData();
    updateDashboard();

    alert("Income added successfully!");
}


// ========================================
// ADD EXPENSE
// ========================================

function addExpense() {

    let amount = prompt("Enter expense amount:");

    if (amount === null) {
        return;
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let description = prompt(
        "What did you spend on?"
    );

    if (description === null || description.trim() === "") {
        description = "Expense";
    }

    transactions.push({
        type: "expense",
        amount: amount,
        description: description,
        date: new Date().toLocaleDateString()
    });

    saveData();
    updateDashboard();

    alert("Expense added successfully!");
}


// ========================================
// SET BUDGET
// ========================================

function setBudget() {

    let amount = prompt(
        "Enter your monthly budget:"
    );

    if (amount === null) {
        return;
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    budget = amount;

    localStorage.setItem(
        "pocketBudget",
        budget
    );

    updateDashboard();

    alert("Budget saved successfully!");
}


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "pocketTransactions",
        JSON.stringify(transactions)
    );
}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    let totalIncome = 0;
    let totalExpenses = 0;

    for (let i = 0; i < transactions.length; i++) {

        if (transactions[i].type === "income") {

            totalIncome += transactions[i].amount;

        } else {

            totalExpenses += transactions[i].amount;

        }
    }

    let balance =
        totalIncome - totalExpenses;


    // Update income

    document.getElementById("income").innerText =
        "₹" + totalIncome.toLocaleString("en-IN");


    // Update expenses

    document.getElementById("expenses").innerText =
        "₹" + totalExpenses.toLocaleString("en-IN");


    // Update balance

    document.getElementById("balance").innerText =
        "₹" + balance.toLocaleString("en-IN");


    // Update budget

    document.getElementById("budgetText").innerText =
        "Budget: ₹" + budget.toLocaleString("en-IN");


    if (budget === 0) {

        document.getElementById("budgetStatus").innerText =
            "Set your monthly budget.";

    } else if (totalExpenses > budget) {

        document.getElementById("budgetStatus").innerText =
            "⚠️ You have exceeded your budget.";

    } else {

        let remaining =
            budget - totalExpenses;

        document.getElementById("budgetStatus").innerText =
            "₹" + remaining.toLocaleString("en-IN") +
            " remaining.";

    }


    showTransactions();

    showRecommendation(
        totalIncome,
        totalExpenses
    );
}


// ========================================
// SHOW TRANSACTIONS
// ========================================

function showTransactions() {

    let list =
        document.getElementById("transactionList");


    if (transactions.length === 0) {

        list.innerHTML =
            '<p class="empty">No transactions yet.</p>';

        return;
    }


    list.innerHTML = "";


    for (
        let i = transactions.length - 1;
        i >= 0;
        i--
    ) {

        let item =
            transactions[i];

        let transaction =
            document.createElement("div");

        transaction.className =
            "transaction";


        let sign =
            item.type === "income"
            ? "+"
            : "-";


        transaction.innerHTML =

            "<div>" +

                "<strong>" +
                item.description +
                "</strong>" +

                "<small>" +
                item.date +
                "</small>" +

            "</div>" +

            "<span class='" +
            item.type +
            "'>" +

            sign +
            " ₹" +
            item.amount.toLocaleString("en-IN") +

            "</span>";


        list.appendChild(transaction);
    }
}


// ========================================
// RECOMMENDATION
// ========================================

function showRecommendation(
    income,
    expenses
) {

    let recommendation =
        document.getElementById(
            "recommendation"
        );


    if (income === 0 && expenses === 0) {

        recommendation.innerText =
            "Start by adding your income and expenses.";

        return;
    }


    if (expenses > income) {

        recommendation.innerText =
            "⚠️ Your expenses are higher than your income. Try reducing unnecessary spending.";

        return;
    }


    let savings =
        income - expenses;


    let percentage =
        (savings / income) * 100;


    if (percentage >= 30) {

        recommendation.innerText =
            "🎉 Great! You are saving a healthy portion of your income.";

    } else if (percentage >= 10) {

        recommendation.innerText =
            "👍 Good start! Try increasing your savings gradually.";

    } else {

        recommendation.innerText =
            "💡 Your savings are low. Consider reducing unnecessary expenses.";

    }
}


// ========================================
// LOAD DASHBOARD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById("balance")
        ) {

            updateDashboard();

        }

    }
);
```
