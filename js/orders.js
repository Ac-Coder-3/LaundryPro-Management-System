

"use strict";

checkAuth();


const orderForm = document.querySelector("#orderForm");

const customerSelect = document.querySelector("#customerName");

const serviceSelect = document.querySelector("#serviceType");

const clothesType = document.querySelector("#clothesType");

const quantity = document.querySelector("#quantity");

const price = document.querySelector("#price");

const pickupDate = document.querySelector("#pickupDate");


const searchOrder = document.querySelector("#searchOrder");

const ordersTableBody = document.querySelector("#ordersTableBody");

const emptyOrderRow = document.querySelector("#emptyOrderRow");



let orders = getOrders();
function getOrders() {

    return JSON.parse(

        localStorage.getItem("orders")

    ) || [];

}
function getCustomers() {

    return JSON.parse(

        localStorage.getItem("customers")

    ) || [];

}

function renderCurrentOrders() {

    const orderList = isAdmin()

        ? orders

        : orders.filter(function (order) {

            return order.createdBy === currentUser.id;

        });

    renderOrders(orderList);

}
function saveOrders() {

    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );

}


let editingOrderId = null;
const submitOrderBtn = document.querySelector("#submitOrderBtn");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        handleOrderSubmit
    );

}

if (searchOrder) {

    searchOrder.addEventListener(
        "input",
        searchOrders
    );

}



function handleOrderSubmit(event) {



    event.preventDefault();




    const customerId = Number(customerSelect.value);

    const service = serviceSelect.value;

    const clothes = clothesType.value.trim();

    const quantityValue = quantity.value;

    const priceValue = price.value;

    const pickup = pickupDate.value;





    if (!customerId) {

        alert("Please select a customer.");

        return;

    }

    if (!service) {

        alert("Please select a service.");

        return;

    }

    if (!clothes) {

        alert("Please enter clothes type.");

        return;

    }

if (!quantityValue) {

    alert("Enter quantity.");

    return;

}
if (!priceValue) {

    alert("Enter price.");

    return;

}
if (!pickup) {

    alert("Select pickup date.");

    return;

}


    const order = {

        id: Date.now(),

        customerId,

        service,

        clothes,

        quantity: Number(quantityValue),

        price: Number(priceValue),

        pickupDate: pickup,

        status: "Received",
        createdBy: currentUser.id

    };



    if (editingOrderId === null) {

        orders.push(order);

    } else {

        const orderIndex = orders.findIndex(function (order) {

            return order.id === editingOrderId;

        });

        order.id = editingOrderId;

        orders[orderIndex] = order;

        editingOrderId = null;
        submitOrderBtn.innerHTML = `

    <i class="fa-solid fa-plus"></i>

    Create Order

`;

    }




   renderCurrentOrders();

   saveOrders();




    orderForm.reset();





    console.log(customerId);
    console.log(service);
    console.log(clothes);
    console.log(quantity);
    console.log(price);
    console.log(pickup);
}




function renderOrders(orderList = orders) {



   const customers = getCustomers();

    ordersTableBody.innerHTML = "";

    if (orderList.length === 0) {

        emptyOrderRow.style.display = "";

        return;

    }

    emptyOrderRow.style.display = "none";

    orderList.forEach(function (order) {

        const customer = customers.find(function (customer) {

            return customer.id === order.customerId;

        });

        ordersTableBody.innerHTML += `

            <tr>

                <td>${order.id}</td>

                <td>${customer ? customer.fullName : "Unknown Customer"}</td>

                <td>${order.service}</td>

                <td>${order.clothes}</td>

                <td>${order.quantity}</td>

                <td>$${order.price}</td>

                <td>${order.pickupDate}</td>

                <td>${order.status}</td>
<td>

    ${order.status === "Completed"
                ? `

            <button class="view-btn">

                View

            </button>

        `
                : order.status === "Ready"
                    ? `

            <button
                class="pickup-btn"
                onclick="completeOrder(${order.id})"
            >

                Pickup

            </button>

        `
                    : `

           <button
    class="edit-btn"
    onclick="editOrder(${order.id})"
>
    Edit
</button>

${isAdmin() ? `

<button
    class="delete-btn"
    onclick="deleteOrder(${order.id})"
>
    Delete
</button>

` : ""}

        `
            }

</td>

            </tr>

        `;

    });

}


function editOrder(orderId) {

    const order = orders.find(function (order) {

        return order.id === orderId;

    });
if (!order) {

    return;

}
    editingOrderId = order.id;


    submitOrderBtn.innerHTML = `

    <i class="fa-solid fa-pen"></i>

    Update Order

`;

    customerSelect.value = order.customerId;

    serviceSelect.value = order.service;

    clothesType.value = order.clothes;

    quantity.value = order.quantity;

    price.value = order.price;

    pickupDate.value = order.pickupDate;


}




function deleteOrder(orderId) {
    if (!isAdmin()) {

        alert("Access Denied!");

        return;

    }

    const updatedOrders = orders.filter(function (order) {

        return order.id !== orderId;

    });

    orders.length = 0;

    orders.push(...updatedOrders);

    saveOrders();
  renderCurrentOrders();
}




function completeOrder(orderId) {

    const order = orders.find(function (order) {

        return order.id === orderId;

    });

    if (!order) return;

    order.status = "Completed";

saveOrders();

  renderCurrentOrders();

}


function loadCustomers() {

    const customers = getCustomers();

    const customerList = isAdmin()

        ? customers

        : customers.filter(function (customer) {

            return customer.createdBy === currentUser.id;

        });

    customerSelect.innerHTML = `
        <option value="">
            Select Customer
        </option>
    `;

    customerList.forEach(function (customer) {

        customerSelect.innerHTML += `
            <option value="${customer.id}">
                ${customer.fullName}
            </option>
        `;

    });

}


function searchOrders() {

    const keyword = searchOrder.value.trim().toLowerCase();

    const customers = getCustomers();

    const orderList = isAdmin()

        ? orders

        : orders.filter(function (order) {

            return order.createdBy === currentUser.id;

        });

    const filteredOrders = orderList.filter(function (order) {

        const customer = customers.find(function (customer) {

            return customer.id === order.customerId;

        });

        return (

            (customer && customer.fullName.toLowerCase().includes(keyword)) ||

            order.service.toLowerCase().includes(keyword) ||

            order.clothes.toLowerCase().includes(keyword)

        );

    });

    renderOrders(filteredOrders);

}



loadCustomers();

renderCurrentOrders();