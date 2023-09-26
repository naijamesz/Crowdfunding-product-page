//localStorage.removeItem("totalAmount");
//localStorage.removeItem("backers");
//localStorage.removeItem("bamboo");
//localStorage.removeItem("black");

/* ----------------------- [on load] ------------------------------*/

//Retrieve info from local storage 
if (typeof (Storage) !== "undefined") {
    // Retrieve total amount
    if (localStorage.totalAmount) {
        let webAmount = parseInt(localStorage.getItem("totalAmount"));
        // check if NaN value 
        if (webAmount == "NaN") {
            webAmount = 20;
        }
        document.getElementById("total-amount").innerHTML = webAmount;
    } else {
        document.getElementById("total-amount").innerHTML = 10;

    }
    // Retrieve backers
    if (localStorage.backers) {
        document.getElementById("backers").innerHTML = localStorage.getItem("backers");
    } else {
        document.getElementById("backers").innerHTML = 5;
    }
    //Retrieve stock left
    let col0 = document.querySelectorAll('[data-attr=bamboo]');
    let col1 = document.querySelectorAll('[data-attr=black]');
    for (let i0 = 0; i0 < col0.length; i0++) {
        col0[i0].innerHTML = (localStorage.bamboo) ? localStorage.getItem("bamboo") : 101;
        if (localStorage.bamboo == '0') {
            let btn = document.querySelector('[data-btn=bamboo]');
            document.querySelector('[data-pledge=bamboo]').classList.add('unavailable');
            btn.disabled = true;
            btn.innerHTML = "Out of Stock";
        }
    }
    for (let i1 = 0; i1 < col1.length; i1++) {
        col1[i1].innerHTML = (localStorage.black) ? localStorage.getItem("black") : 64;
        if (localStorage.black == '0') {
            let btn1 = document.querySelector('[data-btn=black]');
            btn1.disabled = true;
            //document.querySelector('')
            document.querySelector('[data-pledge=black]').classList.add('unavailable');
            btn1.innerHTML = "Out of Stock";
        }
    }


} else {
    document.getElementById("total-amount").innerHTML = 0;
    document.getElementById("backers").innerHTML = 0;
}

// Progress bar style on load
let root = document.documentElement;
let currentAmount0 = parseInt(document.getElementById("total-amount").innerHTML.replace(",", ""));
let widthCalc = (currentAmount0 / 100000) * 100
root.style.setProperty('--Width', widthCalc + "%");

/*--------------- [click toggle button ] ------------------- */
document.getElementsByClassName("navbar-toggler")[0].addEventListener("click", function () {
    (this.classList.contains("toggled")) ? this.classList.remove("toggled"): this.classList.add("toggled");
})

/*--------------- [increment total amounts & backer] -------------- */

let pledge = document.getElementsByClassName("continue");
let quantity = document.getElementsByClassName("q-value");


for (let i = 0; i < pledge.length; i++) {
    document.getElementsByClassName("continue")[i].addEventListener("click", function () {

        //Fetch amount from imput 
        let amount = parseInt(document.getElementsByClassName("input-bid")[i].value);

        //Recalculate index
        istock = (i < 3) ? i : i - 1
        let amountLeft = parseInt(quantity[istock].innerText);

        //Fetch minium amount 
        let nodeEl = document.getElementsByClassName("input-bid")[i];
        let minAmount = parseInt(nodeEl.getAttributeNode("min").value);

        //Fetch default value if no amount is entered
        if (Number.isNaN(amount)) {
            openNotificationModal("Please enter a pledge");
            closeNotificationModal();
        }

        // Check if value is above min & increment
        else if (amount >= minAmount) {
            incrementTotal(amount);
            incrementBackers();
            decreaseAmountLeft(amountLeft, istock);
            openSuccessModal();
        } else {
            openNotificationModal("Please enter a higher pledge");
            closeNotificationModal();
        }
    })
}

function decreaseAmountLeft(amountLeft, index) {
    // Get data attribute for stock level
    let stockItem = quantity[index].getAttribute('data-attr');
    let col = document.querySelectorAll('[data-attr=' + stockItem + ']');
    // Update stock info if stock is above 0
    if (amountLeft > 0) {
        amountLeft -= 1;
        //Update all relevant stock items
        for (let i = 0; i < col.length; i++) {
            col[i].innerHTML = amountLeft;
        }
        //update value in webAPI 
        localStorage.setItem(stockItem, amountLeft);
    } else if (amountLeft = 0) {
        //Update all relevant stock items
        for (let j = 0; j < col.length; j++) {
            col[j].innerHTML = "0";
        }
        //update value in webAPI 
        localStorage.setItem(stockItem, "0");
        //==> page refresh and out of stock items dealt with in webAPI
    } else {
        openNotificationModal("Item no longer available");
        closeNotificationModal();
    }
}

/*----------------- [update total money raised] ------------------*/

function incrementTotal(amount) {
    let target = 100000;
    let amountPledged = parseInt(amount);
    let currentAmount = parseInt(document.getElementById("total-amount").innerHTML.replace(",", ""));
    let newAmount = currentAmount + amountPledged;
    document.getElementById("total-amount").innerHTML = newAmount.toLocaleString();
    /*progress bar*/
    let newWidth = (newAmount / target) * 100;
    root.style.setProperty('--Width', newWidth + "%");
    // Update local storage
    localStorage.setItem("totalAmount", newAmount);
}

/*------------------ [incrementation backers by 1] -----------------*/

function incrementBackers() {
    let currentBackers = parseInt(document.getElementById("backers").innerHTML.replace(",", ""))
    let newBackers = ++currentBackers;
    document.getElementById("backers").innerHTML = newBackers.toLocaleString();
    //Update local storage
    localStorage.setItem("backers", newBackers);
}

/*------------------- [toggle whether product is bookmarked] ------------------*/

document.getElementsByClassName("btn-bookmark")[0].addEventListener("click", function () {
    /*https://redstapler.co/toggle-active-button-state-javascript/*/
    (this.classList.contains("active-bookmark")) ? this.classList.remove("active-bookmark"): this.classList.add("active-bookmark");
});

/*------------------- [success modal open/close] ------------------*/

let successModal = document.getElementById("success-container");
let notificationModal = document.getElementById("notification-container");
let innerNotification = document.getElementById("notification-modal");
let exitSuccess = document.getElementById("final-success");

function openSuccessModal() {
    successModal.classList.add("active");
}

function closeSuccessModal() {
    if (successModal.classList.contains("active")) {
        successModal.classList.remove("active");
    }
}

function openNotificationModal(notification) {
    notificationModal.classList.add("active");
    innerNotification.innerText = notification;
}

function closeNotificationModal() {
    setTimeout(function() {
        if (notificationModal.classList.contains("active")) {
            notificationModal.classList.remove("active");
        }
    }, 2000);
}

exitSuccess.addEventListener("click", function () {
    closeSuccessModal();
    closeModal();
    location.reload();
})

/*------------------------- [countdown] -----------------------------*/

let countDownDate = new Date("Aug 11, 2021 00:00:00").getTime();
var x = setInterval(function () {
    let currentDate = new Date().getTime();
    let distance = countDownDate - currentDate;
    //Calculate days
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let contDown = days + "d";
    //Calculate hours and seconds
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //Fetch the right value according to distance left
    if (days == "0") {
        contDown = hours + "h";
    }
    if ((days == "0") && (hours == "0")) {
        contDown = minutes + "m";
    }
    if ((days == "0") && (hours == "0") && (minutes == "0")) {
        contDown = seconds + "s";
    }
    //Upadate HTML    
    document.getElementById("countdown").innerHTML = contDown;
    //Once finished
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "THANKS!!!";
    }
}, 1000);

/*----------------------- [ modals ] ---------------------------*/

const modalBtn = document.getElementById("modal-btn");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-modal");
const pledgeCards = document.getElementsByClassName("pledge-card");

modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

function pledgeCardsData() {
    let pledgeData = [];
    for (pledgeCard of pledgeCards) {
        pledgeCardData = {};
        pledgeCardData.isOpen = false;
        pledgeCardData.element = pledgeCard;
        pledgeData.push(pledgeCardData);
    }
    return pledgeData;
}

function openModal() {
    if (!modal.classList.contains("active")) {
        modal.classList.add("active");
    }
    if (!overlay.classList.contains("active")) {
        overlay.classList.add("active");
    }
}

function closeModal() {
    if (modal.classList.contains("active")) {
        modal.classList.remove("active");
    }
    if (overlay.classList.contains("active")) {
        overlay.classList.remove("active");
    }
}

let pledgeCardsInfo = pledgeCardsData();
for (let i = 0; i < pledgeCardsInfo.length; i++) {
    for (let j = 0; j < pledgeCardsInfo[i].element.children.length - 1; j++) {
        pledgeCardsInfo[i].element.children[j].addEventListener("click", function () {
            if (!pledgeCardsInfo[i].isOpen) {
                pledgeCardsInfo[i].element.classList.add("open");
                pledgeCardsInfo[i].isOpen = true;
            } else if (pledgeCardsInfo[i].isOpen) {
                pledgeCardsInfo[i].element.classList.remove("open");
                pledgeCardsInfo[i].isOpen = false;
            }
        })
    }
}

/*-- FAO Mike: Kelv's additional modal scripts - to be checked ---*/
// Get the modal

var modalOne = document.getElementById("sub-pl-bamboo");
var modalTwo = document.getElementById("sub-pl-blackedt");

// Get the button that opens the modal
var btnOne = document.getElementById("btn-open-sub-pl-bamboo");
var btnTwo = document.getElementById("btn-open-sub-pl-blackedt");

// When the user clicks the button, open the modal 
btnOne.onclick = function () {
    modalOne.style.display = "grid";
}

btnTwo.onclick = function () {
    modalTwo.style.display = "grid";
}

// Close modal

// Get the <span> element that closes the modal
var closeOne = document.getElementById("close-sub-pl-bamboo");
var closeTwo = document.getElementById("close-sub-pl-blackedt");

// When the user clicks on <span> (x), close the modal
closeOne.onclick = function () {
    modalOne.style.display = "none";
}

closeTwo.onclick = function () {
    modalTwo.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == closeOne) {
        modalOne.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == closeTwo) {
        modalTwo.style.display = "none";
    }
}



// Success modal

var success = document.getElementById("success-container");
var submit = document.getElementsByClassName("pay");

submit.onclick = function () {
    success.style.display = "grid";
}

var closeSuccess = document.getElementById("final-success");

closeSuccess.onclick = function () {
    success.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == closeSuccess) {
        success.style.display = "none";
    }
}