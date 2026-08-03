

"use strict";

checkAuth();


const paymentForm = document.querySelector("#paymentForm");

const orderSelect = document.querySelector("#orderSelect");

const amountPaid = document.querySelector("#amountPaid");

const paymentMethod = document.querySelector("#paymentMethod");

const paymentDate = document.querySelector("#paymentDate");


const totalPrice = document.querySelector("#totalPrice");

const remainingAmount = document.querySelector("#remainingAmount");
let paymentStatus = "";
const searchPayment = document.querySelector("#searchPayment");

const paymentsTableBody = document.querySelector("#paymentsTableBody");

const emptyPaymentRow = document.querySelector("#emptyPaymentRow");

const submitPaymentBtn = document.querySelector("#submitPaymentBtn");




let payments = getPayments();

function getPayments() {

    return JSON.parse(

        localStorage.getItem("payments")

    ) || [];

}

function savePayments() {

    localStorage.setItem(

        "payments",

        JSON.stringify(payments)

    );

}
function renderCurrentPayments() {

    const paymentList = isAdmin()

        ? payments

        : payments.filter(function (payment) {

            return payment.createdBy === currentUser.id;

        });

    renderPayments(paymentList);

}


let editingPaymentId = null;




paymentForm.addEventListener("submit", handlePaymentSubmit);

searchPayment.addEventListener("input", searchPayments);
orderSelect.addEventListener("change", updatePaymentInfo);
amountPaid.addEventListener("input", calculateRemaining);


function handlePaymentSubmit(event) {

    event.preventDefault();

    const selectedOrderId = Number(orderSelect.value);

    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const selectedOrder = savedOrders.find(function (order) {

        return order.id === selectedOrderId;

    });

    if (!selectedOrder) {

        alert("Please select an order.");

        return;

    }


    const alreadyPaid = payments.find(function (payment) {

        return (

            payment.orderId === selectedOrder.id &&

            payment.paymentStatus === "Paid" &&

            payment.id !== editingPaymentId

        );

    });

    if (alreadyPaid) {

        alert("This order has already been fully paid.");

        return;

    }
    const payment = {

        id: Date.now(),

        orderId: selectedOrder.id,

        amountPaid: Number(amountPaid.value),

        paymentMethod: paymentMethod.value,

        paymentDate: paymentDate.value,

        paymentStatus: paymentStatus,
        createdBy: currentUser.id

    };

    if (editingPaymentId === null) {

        payments.push(payment);

    } else {

        const paymentIndex = payments.findIndex(function (payment) {

            return payment.id === editingPaymentId;

        });

        payment.id = editingPaymentId;

        payments[paymentIndex] = payment;

        editingPaymentId = null;

        submitPaymentBtn.innerHTML = `
            <i class="fa-solid fa-money-bill-wave"></i>
            Record Payment
        `;

    }

    savePayments();

    renderCurrentPayments();


    const order = savedOrders.find(function (order) {

        return order.id === payment.orderId;

    });

    if (order) {

        if (payment.paymentStatus === "Paid") {

            order.status = "Ready";

        } else {

            order.status = "Processing";

        }

        localStorage.setItem("orders", JSON.stringify(savedOrders));

    }
    paymentForm.reset();

    totalPrice.value = "";

    remainingAmount.value = "";

    paymentStatus = "";
    orderSelect.value = "";

}



function renderPayments(paymentList = payments) {
    if (isEmployee()) {

        paymentList = paymentList.filter(function (payment) {

            return payment.createdBy === currentUser.id;

        });

    }
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    paymentsTableBody.innerHTML = "";

    if (paymentList.length === 0) {

        emptyPaymentRow.style.display = "";

        return;

    }

    emptyPaymentRow.style.display = "none";

    paymentList.forEach(function (payment) {

        const order = orders.find(function (order) {

            return order.id === payment.orderId;

        });

        if (!order) return;

        const customer = customers.find(function (customer) {

            return customer.id === order.customerId;

        });



        paymentsTableBody.innerHTML += `

        <tr>

            <td>${payment.id}</td>

            <td>${customer ? customer.fullName : "Unknown Customer"}</td>

            <td>

                $${payment.amountPaid} / $${order.price}

            </td>

            <td>${payment.paymentMethod}</td>

            <td>${payment.paymentDate}</td>

            <td>${payment.paymentStatus}</td>

<td>

${order.status === "Completed"

                ? `

    <button class="view-btn">

        View

    </button>

`

                : `

   <button
    class="edit-btn"
    onclick="editPayment(${payment.id})"
>

    Edit

</button>

${isAdmin() ? `

<button
    class="delete-btn"
    onclick="deletePayment(${payment.id})"
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


function searchPayments() {

    const keyword = searchPayment.value.trim().toLowerCase();

    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const filteredPayments = payments.filter(function (payment) {

        const order = orders.find(function (order) {

            return order.id === payment.orderId;

        });

        if (!order) return false;

        const customer = customers.find(function (customer) {

            return customer.id === order.customerId;

        });

        return (

            (customer && customer.fullName.toLowerCase().includes(keyword)) ||

            order.service.toLowerCase().includes(keyword) ||

            payment.paymentMethod.toLowerCase().includes(keyword) ||

            payment.paymentStatus.toLowerCase().includes(keyword)

        );

    });

    renderPayments(filteredPayments);

}


function loadOrders() {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const customers = JSON.parse(localStorage.getItem("customers")) || [];

    orderSelect.innerHTML = `
        <option value="">Select Order</option>
    `;

    orders
        .filter(function (order) {

            if (order.status === "Completed") {

                return false;

            }

            if (isAdmin()) {

                return true;

            }

            return order.createdBy === currentUser.id;

        })
        .forEach(function (order) {

            const customer = customers.find(function (customer) {

                return customer.id === order.customerId;

            });

            orderSelect.innerHTML += `

                <option value="${order.id}">

                    ${customer ? customer.fullName : "Unknown"} - ${order.service}

                </option>

            `;

        });

}



function updatePaymentInfo() {

    const selectedOrderId = Number(orderSelect.value);

    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const selectedOrder = savedOrders.find(function (order) {

        return order.id === selectedOrderId;

    });

    if (!selectedOrder) {

        totalPrice.value = "";

        remainingAmount.value = "";

        return;

    }

    totalPrice.value = selectedOrder.price;
    calculateRemaining();
}



function calculateRemaining() {

    const total = Number(totalPrice.value);

    const paidText = amountPaid.value;

    const paid = Number(paidText);



    if (

        paidText.length > 1 &&

        paidText.startsWith("0")

    ) {

        alert("Please enter a valid amount without leading zeros.");

        amountPaid.value = "";

        remainingAmount.value = "";

        return;

    }



    if (paid > total) {

        alert("Amount paid cannot be greater than the total price.");

        amountPaid.value = "";

        remainingAmount.value = "";

        return;

    }



    const remaining = total - paid;

    remainingAmount.value = remaining;



    if (remaining === 0) {

        paymentStatus = "Paid";

    }

    else if (paid === 0) {

        paymentStatus = "Pending";

    }

    else {

        paymentStatus = "Partially Paid";

    }

    console.log(paymentStatus);

}



function deletePayment(paymentId) {
    const confirmed = confirm(

        "Delete this payment?"

    );

    if (!confirmed) {

        return;

    }
    if (!isAdmin()) {

        alert("Access Denied!");

        return;

    }
    const payment = payments.find(function (payment) {

        return payment.id === paymentId;

    });

    if (!payment) return;

    const updatedPayments = payments.filter(function (item) {

        return item.id !== paymentId;

    });

    payments.length = 0;

    payments.push(...updatedPayments);
savePayments();




    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const order = savedOrders.find(function (order) {

        return order.id === payment.orderId;

    });

    if (order) {

        if (payment.paymentStatus === "Paid") {

            order.status = "Ready";

        } else {

            order.status = "Processing";

        }

        localStorage.setItem("orders", JSON.stringify(savedOrders));

    }

   

    renderCurrentPayments();

}



function editPayment(paymentId) {

    const payment = payments.find(function (payment) {

        return payment.id === paymentId;

    });

    if (!payment) {

        return;

    }
    editingPaymentId = payment.id;
    orderSelect.value = payment.orderId;

    updatePaymentInfo();

    amountPaid.value = payment.amountPaid;

    paymentMethod.value = payment.paymentMethod;

    paymentDate.value = payment.paymentDate;

    calculateRemaining();

    submitPaymentBtn.innerHTML = `

        <i class="fa-solid fa-pen"></i>

        Update Payment

    `;

}




loadOrders();
renderCurrentPayments();