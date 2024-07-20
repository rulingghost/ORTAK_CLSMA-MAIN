const supplierTable = document.querySelector("#tedarikci_table");
const supplierTableBody = supplierTable.querySelector("tbody");
const supplierAddBtn = document.querySelector(".supplier-add-btn");
var reqInputs = document.querySelectorAll("#id_CompanyName_Supplier");
var reqLabels = document.querySelectorAll("#firma_adi_span");
var textCells = document.querySelectorAll(
  "#table td:nth-child(3), #table td:nth-child(4), #table td:nth-child(5), #table td:nth-child(6)"
);
var phoneInput = document.querySelector("#id_PhoneNumber");
const supplierAddForm = document.getElementById("supplier_add_form");
let editMode = false;
let currentSupplierName;


document.addEventListener("DOMContentLoaded", async () => {
  await getSupplier();
  setInterval(async function () {
    await getSupplier();
  }, 5000);
});

async function getSupplier(isEdit) {
  try {
    let currentRows = supplierTableBody.querySelectorAll("tr");
    const data = await apiFunctions("supplier", "GET");
    let rows = "";
    for (const supplier of data) {
      const row = `
                <tr>
                    <td>
                        <button id="${supplier.id}" type="button" class="edit-supplier-btn" style="background: none; border:none;">
                            <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                    <td>${supplier.CompanyName_Supplier}</td>
                    <td>${supplier.ContactPerson}</td>
                    <td>${supplier.PhoneNumber}</td>
                    <td>${supplier.Email}</td>
                    <td>${supplier.Location}</td>
                </tr>
            `;
      rows += row;
    }
    if (data.length > currentRows.length || isEdit) {
      supplierTableBody.innerHTML = "";
      supplierTableBody.insertAdjacentHTML("beforeend", rows);
      editBtns();
      sortTableForStart(supplierTable, 1);
      allTableFormat();
      sortingTable(supplierTable);
    }
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}

//                  OPEN ADD WİNDOW

const supplierAddWindow = document.querySelector(".supplier-add-window");

supplierAddBtn.addEventListener("click", () => {
  setTimeout(() => {
    editMode = false;
    currentSupplierName = "0";
    supplierAddWindow.style.display = "flex";
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const supplierAddContainer = document.querySelector(".supplier-add-window .container");
  if (!supplierAddContainer.contains(event.target)) {
    supplierAddWindow.style.display = "none";
  }
});
// KAPATMA
let xBtn = document.querySelectorAll(".close-window");
xBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    supplierAddWindow.style.display = "none";
    supplierAddForm.reset();
  });
});

//                  TELEFON NUMARASI FORMATLAMA

phoneInput.addEventListener("input", function (event) {
  var contryNumber = "+90";
  var inputValue = phoneInput.value;
  if (event.inputType !== "deleteContentBackward") {
    phoneInput.value = formatPhoneNumberByCountryCode(inputValue, contryNumber);
  }
});

//                  TABLO FORMATLAMA

function allTableFormat() {
  var textCells = supplierTable.querySelectorAll(
    "td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)"
  );
  tableFormat(textCells, "text");
}

//                  SUPPLİER ADD FUNCTİON

let btnID = -1;
const supplierFormAddBtn = document.querySelector("#kaydet_btn");
supplierFormAddBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  var firmaInput = document.querySelector("#id_CompanyName_Supplier")
  var firmaSpan = document.querySelector("#firma_adi_span")


  if (requiredInputs(reqInputs, reqLabels) && await supplierNameControl(firmaInput, firmaSpan, currentSupplierName)) {
    if (editMode == false) {
      const formData = new FormData(supplierAddForm);
      await apiFunctions("supplier", "POST", formData);
      getSupplier();
      supplierAddWindow.style.display = "none";
      clearInputAfterSave(supplierAddForm);
    } else {
      const formData = new FormData(supplierAddForm);
      await apiFunctions("supplier", "PUT", formData, btnID);
      getSupplier("EDİT");
      supplierAddWindow.style.display = "none";
      clearInputAfterSave(supplierAddForm);
    }
  }


});

//                  SUPPLİER EDİT FUNCTİON

function editBtns() {
  let editButtons = document.querySelectorAll(".edit-supplier-btn");
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(async () => {
        editMode = true;
        btnID = button.id;
        const data = await apiFunctions("supplier", "GETID", "x", btnID)
       // console.log(data)
        currentSupplierName = data.CompanyName_Supplier;
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var element = document.querySelector('input[name="' + key + '"]');
            if (element) {
              element.value = data[key];
            }
          }
        }
        supplierAddWindow.style.display = "flex";
      }, 10);
    })
  });
}
