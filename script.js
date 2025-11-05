const checklistContainer = document.querySelector("#checklist");
const resultContainer = document.querySelector("#result");
const showBtn = document.querySelector("#showResultBtn");
const uncheck = document.querySelector("#uncheck")

let uncheckIsChecked = false; // Negeer die variable naam
let selectedProducts = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("products.json")
        .then(response => response.json())
        .then(data => { loadOptions(data); productsData = data; })
        .catch(err => console.error("Failed to fetch products:", err));
});

function loadOptions(options) {
    options.forEach(option => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("option");

        productDiv.innerHTML = `
    <img src="${option.image}" draggable="false" alt="${option.name}">
    <input type="checkbox" name="product" value="${option.name}">
    `;

        checklistContainer.appendChild(productDiv);
    });

    attachCheckboxListeners();
    attachOptionClick();
}

function attachCheckboxListeners() {
    const checkboxes = document.querySelectorAll('input[name="product"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateSelectedProducts);
    });
}

function attachOptionClick() {
    const optionDivs = document.querySelectorAll('.option');

    optionDivs.forEach(option => {
        option.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                updateSelectedProducts();
            }
        });
    });
}

function updateSelectedProducts() {
    const checkedBoxes = document.querySelectorAll('input[name="product"]:checked');

    selectedProducts = Array.from(checkedBoxes).map(cb => {
        const optionDiv = cb.closest('.option');
        const name = cb.value;
        const imgSrc = optionDiv.querySelector('img').src;

        const product = productsData.find(p => p.name === name);

        return {
            ...product,
            image: imgSrc
        };
    });

    if (selectedProducts.length > 0) {
        uncheck.innerHTML = "Uncheck All";
        uncheckIsChecked = true;
    } else {
        uncheck.innerHTML = "Check All";
        uncheckIsChecked = false;
    }
}

function showResult() {
    if (selectedProducts.length === 0) return alert("No product selected!");

    let randomIndex = Math.floor(Math.random() * selectedProducts.length);
    const selected = selectedProducts[randomIndex];

    resultContainer.style.transform = "translateX(0)";

    resultContainer.innerHTML = `
        <div id="resultContent">
        <img src="img/icons/cross.svg" id="close">
            <h2>Your Monster of today:</h2>
            <img src="${selected.image}" draggable="false" alt="${selected.name}" style="max-height:40vh;">
            <div id="text">
                <h3>${selected.name}</h3>
                <p>${selected.description}</p>
            </div>
        </div>
    `;
    document.body.style.overflow = "hidden";
    document.querySelector("#close").addEventListener("click", function () {
        document.body.style.overflow = "visible";
        resultContainer.style.transform = "translateX(100vw)";
    })
}

function checkChecked(){
    if (uncheckIsChecked) {
        uncheck.innerHTML = "Check All";
        document.querySelectorAll('input[name="product"]').forEach(input => {
            input.checked = false;
        });
        uncheckIsChecked = false;
    } else {
        uncheck.innerHTML = "Uncheck All";
        document.querySelectorAll('input[name="product"]').forEach(input => {
            input.checked = true;
        });
        uncheckIsChecked = true;
    }
    updateSelectedProducts()
}



uncheck.addEventListener("click", () => checkChecked())

showBtn.addEventListener("click", showResult);


/*resultContainer.textContent = selectedProducts.length
    ? `Selected: ${selectedProducts.join(", ")}`
    : "No products selected."*/;

