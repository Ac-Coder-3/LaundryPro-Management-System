"use strict";
checkAuth();

/* == DOM ELEMENTS == */

const navItems = document.querySelectorAll("nav ul li");




const dashboardCards = document.querySelectorAll(".card");

const totalCustomers =
    document.querySelector("#totalCustomers");

const totalOrders =
    document.querySelector("#totalOrders");

const pickedUpOrders =
    document.querySelector("#pickedUpOrders");

const totalRevenue =
    document.querySelector("#totalRevenue");
const recentOrdersBody =
    document.querySelector("#recentOrdersBody");


function setActiveMenu() {

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            navItems.forEach((nav) => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        });

    });

}






function setupDashboardCards() {

    dashboardCards.forEach((card) => {

        card.addEventListener("click", () => {

            card.style.transform = "scale(0.98)";

            setTimeout(() => {

                card.style.transform = "";

            }, 150);

        });

    });

}



function renderRecentOrders() {

     const orders = getOrders();

    const customers = getCustomers();

    const dashboardOrders = isAdmin()

        ? orders

        : orders.filter(function (order) {

            return order.createdBy === currentUser.id;

        });

    const recentOrders = dashboardOrders.slice(-5).reverse();


   let html = "";

recentOrders.forEach(function (order) {

    const customer = customers.find(function (customer) {

        return customer.id === order.customerId;

    });

    html += `

    <tr>

        <td>#${order.id}</td>

        <td>${customer ? customer.fullName : "Unknown Customer"}</td>

        <td>${order.service}</td>

        <td>

            <span class="status ${order.status.toLowerCase()}">

                ${order.status}

            </span>

        </td>

        <td>$${order.price}</td>

    </tr>

    `;

});

recentOrdersBody.innerHTML = html;


}

/* == LOCAL STORAGE HELPERS === */

function getCustomers() {

    return JSON.parse(

        localStorage.getItem("customers")

    ) || [];

}

function getOrders() {

    return JSON.parse(

        localStorage.getItem("orders")

    ) || [];

}

function getPayments() {

    return JSON.parse(

        localStorage.getItem("payments")

    ) || [];

}







function updateDashboard() {

    const customers = getCustomers();

    const orders = getOrders();

    const payments = getPayments();

   const dashboardCustomers = isAdmin()

    ? customers

    : customers.filter(function (customer) {

        return customer.createdBy === currentUser.id;

    });

totalCustomers.textContent = dashboardCustomers.length;

    const dashboardOrders = isAdmin()

        ? orders

        : orders.filter(function (order) {

            return order.createdBy === currentUser.id;

        });

const activeOrders = dashboardOrders.filter(function (order) {

    return (

        order.status === "Received" ||

        order.status === "Processing"

    );

});

totalOrders.textContent = activeOrders.length;

totalOrders.textContent = activeOrders.length;
const pickedUp = dashboardOrders.filter(function (order) {

    return order.status === "Completed";

});

pickedUpOrders.textContent = pickedUp.length;
    const dashboardPayments = isAdmin()

        ? payments

        : payments.filter(function (payment) {

            return payment.createdBy === currentUser.id;

        });

    const revenue = dashboardPayments.reduce(function (total, payment) {

        return total + payment.amountPaid;

    }, 0);

   totalRevenue.textContent = `$${revenue.toFixed(2)}`;

}







function initApp() {
    updateDashboard();


    setActiveMenu();



    setupDashboardCards();
    renderRecentOrders();

}


/* ==  START APPLICATION == */

document.addEventListener("DOMContentLoaded", initApp);