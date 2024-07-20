const projectsTable = document.querySelector("#project_table");
const projectsTableBody = projectsTable.querySelector("tbody");

var usdCells = document.querySelectorAll("#table td:nth-child(6)");
var numericCells = document.querySelectorAll(
  "#table td:nth-child(4), #table td:nth-child(5)"
);
var textCells = document.querySelectorAll(
  "#table td:nth-child(3), #table td:nth-child(7), #table td:nth-child(8)"
);

const reqIncomeInputs = document.querySelectorAll("#id_CompanyName_Pay_Incomes, #id_ProjectName_Incomes")
const reqIncomeLabels = document.querySelectorAll("#income_firma_span, #income_proje_span")

const reqExpensesInputs = document.querySelectorAll("#id_CompanyName_Paying_Expenses, #id_ProjectName_Expenses")
const reqExpensesLabels = document.querySelectorAll("#expenses_firma_span, #expenses_proje_span")

const reqJobhistoryInputs = document.querySelectorAll("#id_CompanyName_Job_JobHistory, #id_ProjectName_JobHistory")
const reqJobhistoryLabels = document.querySelectorAll("#jobhistory_firma_span, #jobhistory_proje_span")

const reqProjectInputs = document.querySelectorAll("#id_CompanyName, #id_ProjectName, #id_ProjectCode")
const reqProjectLabels = document.querySelectorAll("#proje_firma_span, #proje_span, #proje_kodu_span")

const incomeDateInput = document.querySelector("#id_ChekDate_Incomes");
const incomeLastDateInput = document.querySelector("#id_LastChekDate_Incomes");
const incomeAmountInput = document.querySelector("#id_Amount_Incomes");
const incomePaymentTypeInput = document.getElementById("id_PaymentType_Incomes");

const expensesDateInput = document.querySelector("#id_Date_Expenses");
const expensesAmountInput = document.querySelector("#id_Amount_Expenses");

const jobhistoryDateInput = document.querySelector("#id_Date_JobHistory");
const jobhistoryAmountInput = document.querySelector("#id_Amount_JobHistory");

let currentProjectName;

document.addEventListener("DOMContentLoaded", async () => {
  await getProjects();
  setInterval(async function () {
    await getProjects();
  }, 5000);
});

async function getProjects(isEdit) {
  try {
    let currentRows = projectsTable.querySelectorAll("tbody tr");

    const data = await apiFunctions("project", "GET");
    console.log(data);
    let formattedDate;
    let rows = "";
    for (const project of data) {
      if (project.StartDate) {
        let date = new Date(project.StartDate);
        formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
      } else { formattedDate = "-" }

      const projectDetailsUrl = `http://127.0.0.1:8000/project_details/${project.id}/`;

      const row = `
        <tr>
          <td>
            <button id="${project.id}" type="button" class="edit-project-btn" style="background: none; border:none;">
              <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
          <td><a href="${projectDetailsUrl}">${project.ProjectName}</a></td>
          <td>${project.Location}</td>
          <td>${project.AC_Power}</td>
          <td>${project.DC_Power}</td>
          <td>${project.Cost_NotIncludingKDV}</td>
          <td>${project.Terrain_Roof}</td>
          <td>${formattedDate}</td>
          <td>${project.Situation}</td>
        </tr>`;

      rows += row;
    }
    if (data.length > currentRows.length || isEdit) {
      projectsTableBody.innerHTML = "";
      projectsTableBody.insertAdjacentHTML("beforeend", rows);
      sortingTable(projectsTable);
      allTableFormat();
      editButtonsEvents();
    }
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}


//                  TABLO FORMATLAMA

function allTableFormat() {
  var usdCells = projectsTable.querySelectorAll("td:nth-child(6)");
  var numericCells = projectsTable.querySelectorAll(
    "td:nth-child(4), td:nth-child(5)"
  );
  var textCells = projectsTable.querySelectorAll(
    "td:nth-child(2), td:nth-child(3), td:nth-child(7), td:nth-child(8), td:nth-child(9)"
  );
  tableFormat(usdCells, "usd");
  tableFormat(numericCells, "numeric");
  tableFormat(textCells, "text");
}

//                  FİRMA EKLEME

const clientAddWindow = document.querySelector(".client-add-window");
const companyAddBtns = document.querySelectorAll(".paying-company-add-btn");

const companyX = clientAddWindow.querySelector(".close-window");
companyAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(() => {
      clientAddWindow.style.display = "flex";
    }, 20);
  });
  document.addEventListener("click", (event) => {
    const clientAddContainer = clientAddWindow.querySelector(".container");
    if (!clientAddContainer.contains(event.target)) {
      setTimeout(() => {
        clientAddWindow.style.display = "none";
      }, 15);
    }
  });
});

const supplierAddWindow = document.querySelector(".supplier-add-window");
const supplierAddBtns = document.querySelectorAll(".paying-supplier-add-btn");

const supplierX = supplierAddWindow.querySelector(".close-window");
supplierAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(() => {
      supplierAddWindow.style.display = "flex";
    }, 20);
  });
  document.addEventListener("click", (event) => {
    const supplierAddContainer = supplierAddWindow.querySelector(".container");
    if (!supplierAddContainer.contains(event.target)) {
      setTimeout(() => {
        supplierAddWindow.style.display = "none";
      }, 15);
    }
  });
});


//                  EKLEME BUTTONLARI

var projectAddWindow = document.querySelector(".project-add-window");
const projectAddWindowButton = document.querySelector(".project-add-btn");
var incomeAddWindow = document.querySelector(".income-add-window");
var incomeAddWindowButton = document.querySelector(".income-add-btn");
var expensesAddWindow = document.querySelector(".expenses-add-window");
var expensesAddWindowButton = document.querySelector(".expenses-add-btn");
var jobhistoryAddWindow = document.querySelector(".jobhistory-add-window");
var jobhistoryAddWindowButton = document.querySelector(".jobhistory-add-btn");
let editMode = false;
let projectId;

//----- PROJECT
projectAddWindowButton.addEventListener("click", () => {
  setTimeout(() => {
    if (editMode == true) { clearInputAfterSave(projectAddForm) }
    editMode = false;
    currentProjectName = "0";
    projectAddWindow.style.display = "flex";
    getClients();
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const projectAddContainer = projectAddWindow.querySelector(".container");
  if (!projectAddContainer.contains(event.target) && clientAddWindow.style.display == "none") {
    projectAddWindow.style.display = "none";
  }
});
//----- KDV % EKLEME
const kdvRateInput = document.getElementById("id_KDV_Rate");
addPercentageSymbol(kdvRateInput);
kdvRateInput.addEventListener("input", function () {
  addPercentageSymbol(kdvRateInput);
});
function addPercentageSymbol(input) {
  let enteredValue = input.value;
  let numericValue = enteredValue.replace(/[^0-9,.]/g, "");
  if (enteredValue == "") {
    let formattedValue = "%" + 20;
    input.value = formattedValue;
  }else{
    let formattedValue = "%" + numericValue;
    input.value = formattedValue;
  }
  
}
//----- İNCOME
incomeAddWindowButton.addEventListener("click", () => {
  setTimeout(() => {
    incomeAddWindow.style.display = "flex";
    getClients();
    getprojectName()
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const incomeAddContainer = incomeAddWindow.querySelector(".container");
  if (!incomeAddContainer.contains(event.target) && clientAddWindow.style.display == "none") {
    incomeAddWindow.style.display = "none";
  }
});
//----- EXPENSES
expensesAddWindowButton.addEventListener("click", () => {
  setTimeout(() => {
    expensesAddWindow.style.display = "flex";
    getSuppliers()
    getprojectName()
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const expensesAddContainer = expensesAddWindow.querySelector(".container");
  if (!expensesAddContainer.contains(event.target) && supplierAddWindow.style.display == "none") {
    expensesAddWindow.style.display = "none";
  }
});
//----- JOBHİSTORY
jobhistoryAddWindowButton.addEventListener("click", () => {
  setTimeout(() => {
    jobhistoryAddWindow.style.display = "flex";
    getSuppliers()
    getprojectName()
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const jobhistoryAddContainer =
    jobhistoryAddWindow.querySelector(".container");
  if (!jobhistoryAddContainer.contains(event.target) && supplierAddWindow.style.display == "none") {
    jobhistoryAddWindow.style.display = "none";
  }
});
// KAPATMA
let xBtn = document.querySelectorAll(".close-window");
xBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const btnParentDiv = btn.parentElement;
    if (btnParentDiv && btnParentDiv.parentElement) {
      setTimeout(() => {
        btnParentDiv.parentElement.style.display = "none";
        clearInputAfterSave(btn.nextElementSibling.nextElementSibling);
      }, 10);
    }
  });
});


// TARİH İNPUTLARI FORMATLAMA
const dateInputs = document.querySelectorAll(".date-inputs");
formatDateInputs(dateInputs);

// INPUT FORMATLAMA
const formatedInputs = document.querySelectorAll(".formatInputs");
inputsForFormat(formatedInputs);

//                  PROJECT EDİT FUNCTİON

let btnID = -1;
function editButtonsEvents() {
  let editButtons = document.querySelectorAll(".edit-project-btn");
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(async () => {
        editMode = true;
        btnID = button.id;
        const data = await apiFunctions("project", "GETID", "x", btnID)
        currentProjectName = data.ProjectName;
        for (var key in data) {
          if (data.hasOwnProperty(key)) {            
            var element = document.querySelector('input[name="' + key + '"]');
            var selectElement = document.querySelector('select[name="' + key + '"]');
            if (element) {
              //console.log(key)
              //console.log(data[key])
              //let projectNameForEdit = document.querySelector("#id_ProjectName");
              //projectNameForEdit.setAttribute('data-id', btnID);
              if (key == "Company_id") {
                element.value = data["client"].CompanyName_Clients;
                element.setAttribute('data-id', data[key]);
              } else {
                element.value = data[key];
              }
            } else if (selectElement) {
              selectElement.value = data[key];
            }
          }
        }
        getClients();
        onPageLoads(formatedInputs)
        formatDateInputsForLoad(dateInputs)
        projectAddWindow.style.display = "flex";
      }, 10);
    })
  });
}

/***********************************************************
#                       İNCOME ADD 
***********************************************************/

const incomeAddForm = document.getElementById("income_add_form");
const incomeFormAddBtn = document.querySelector("#income-create-btn");
incomeFormAddBtn.addEventListener("click", async function (event) {

  event.preventDefault();

  if (requiredInputs(reqIncomeInputs, reqIncomeLabels)) {

    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = incomeAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })

    const formData = new FormData(incomeAddForm);
    const inputs = document.querySelectorAll(".income-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });

    await apiFunctions("income", "POST", formData);
    incomeAddWindow.style.display = "none";
    getClients();
    clearInputAfterSave(incomeAddForm);
  }
});

// ÇEK SON KULLANIM İNPUT
if (incomePaymentTypeInput.value == "cek") {
  incomeLastDateInput.disabled = false;
  incomeLastDateInput.value = "";
} else {
  incomeLastDateInput.disabled = true;
}
incomePaymentTypeInput.addEventListener("change", () => {
  const selectedOption =
    incomePaymentTypeInput.options[incomePaymentTypeInput.selectedIndex].text;
  if (selectedOption.startsWith("Çek")) {
    incomeLastDateInput.disabled = false;
  } else {
    incomeLastDateInput.disabled = true;
    incomeLastDateInput.value = "";
  }
});

// KUR HESAPLAMA
var incomeKurInput = document.querySelector("#id_Dollar_Rate_Incomes");
var incomeTimeForKur = document.querySelector("#income-kur-time");

incomeTimeForKur.addEventListener("change", async function () {
  const secilenDeger = incomeTimeForKur.value;
  if (secilenDeger === "secenek1") {
  } else if (secilenDeger === "secenek2") {
    tarih = birGunOncekiTarih(incomeDateInput.value);
    incomeKurInput.value = await getUSDKur(tarih);
  } else if (secilenDeger === "secenek3") {
    tarih = tarihFormatiniDegistir(incomeDateInput.value);
    incomeKurInput.value = await getUSDKur(tarih);
  }
});



/***********************************************************
#                       EXPENSES ADD
***********************************************************/

const expensesAddForm = document.getElementById("expenses_add_form");
const expensesFormAddBtn = document.querySelector("#expenses-create-btn");
expensesFormAddBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  if (requiredInputs(reqExpensesInputs, reqExpensesLabels)) {

    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = expensesAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })

    const formData = new FormData(expensesAddForm);
    const inputs = document.querySelectorAll(".expenses-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });
    await apiFunctions("expense", "POST", formData);
    expensesAddWindow.style.display = "none";
    getSuppliers();
    clearInputAfterSave(expensesAddForm);
  }
});
// TARİH İNPUT FORMATLAMA
expensesDateInput.addEventListener("input", function (event) {
  var userInput = expensesDateInput.value;
  if (event.inputType !== "deleteContentBackward") {
    expensesDateInput.value = formatDate(userInput);
  }
});

// KUR HESAPLAMA
var expensesKurInput = document.querySelector("#id_Dollar_Rate_Expenses");
var expensesTimeForKur = document.querySelector("#expenses-kur-time");

expensesTimeForKur.addEventListener("change", async function () {
  const secilenDeger = expensesTimeForKur.value;
  if (secilenDeger === "secenek1") {
  } else if (secilenDeger === "secenek2") {
    tarih = birGunOncekiTarih(expensesDateInput.value);
    expensesKurInput.value = await getUSDKur(tarih);
  } else if (secilenDeger === "secenek3") {
    tarih = tarihFormatiniDegistir(expensesDateInput.value);
    expensesKurInput.value = await getUSDKur(tarih);
  }
});

/***********************************************************
#                       JOBHİSTORY ADD
***********************************************************/
const jobhistoryAddForm = document.getElementById("jobhistory_add_form");
const jobhistoryFormAddBtn = document.querySelector("#jobhistory-create-btn");
jobhistoryFormAddBtn.addEventListener("click", async function (event) {
  event.preventDefault();


  if (requiredInputs(reqJobhistoryInputs, reqJobhistoryLabels)) {

    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = jobhistoryAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })

    const formData = new FormData(jobhistoryAddForm);
    const inputs = document.querySelectorAll(".jobhistory-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });
    await apiFunctions("job_history", "POST", formData);
    jobhistoryAddWindow.style.display = "none";
    getSuppliers();
    clearInputAfterSave(jobhistoryAddForm);
  }
});

// TARİH İNPUTLARI FORMATLAMA
jobhistoryDateInput.addEventListener('input', function (event) {
  var userInput = jobhistoryDateInput.value;
  if (event.inputType !== 'deleteContentBackward') {
    jobhistoryDateInput.value = formatDate(userInput);
  }
});

// KUR HESAPLAMA
var jobhistoryKurInput = document.querySelector("#Dollar_Rate_JobHistory");
var jobhistoryTimeForKur = document.querySelector("#jobhistory-kur-time");

jobhistoryTimeForKur.addEventListener("change", async function () {
  const secilenDeger = jobhistoryTimeForKur.value;
  if (secilenDeger === "secenek1") {
  } else if (secilenDeger === "secenek2") {
    tarih = birGunOncekiTarih(jobhistoryDateInput.value);
    jobhistoryKurInput.value = await getUSDKur(tarih);
  } else if (secilenDeger === "secenek3") {
    tarih = tarihFormatiniDegistir(jobhistoryDateInput.value);
    jobhistoryKurInput.value = await getUSDKur(tarih);
  }
});

/***********************************************************
#                       PROJECT ADD - EDİT
***********************************************************/
const projectAddForm = document.getElementById("project_add_form");
const projectFormAddBtn = document.getElementById("project-create-btn");
projectFormAddBtn.addEventListener("click", async function (event) {
  var projecInput = document.querySelector("#id_ProjectName")
  var projectISpan = document.querySelector("#proje_span")
  event.preventDefault();
  //console.log(currentProjectName)
  if (requiredInputs(reqProjectInputs, reqProjectLabels) && await projectNameControl(projecInput, projectISpan, currentProjectName)) {
    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = projectAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })
    const formData = new FormData(projectAddForm);
    const inputs = document.querySelectorAll(".project-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });
    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }

    if (editMode == false) {
      await apiFunctions("project", "POST", formData);
      getProjects()
      projectAddWindow.style.display = "none";
      clearInputAfterSave(projectAddForm);
    } else {
      console.log("dfsdf")
      await apiFunctions("project", "PUT", formData, btnID);
      getProjects("EDİT")
      projectAddWindow.style.display = "none";
      clearInputAfterSave(projectAddForm);
    }
  }
});

/***********************************************************
#                       CLİENT SUPPLİER ADD 
***********************************************************/
const clientAddForm = document.getElementById("firma_add_form");
const clientFormAddBtn = document.querySelector("#firma_submit_btn");
clientFormAddBtn.addEventListener("click", async function (event) {

  var firmaInput = document.querySelector("#id_CompanyName_Clients")
  var firmaSpan = document.querySelector("#firma_add_label")
  var reqInputs = document.querySelectorAll("#id_CompanyName_Clients")
  var reqLabels = document.querySelectorAll("#firma_add_label")

  event.preventDefault();
  if (requiredInputs(reqInputs, reqLabels) && await clientNameControl(firmaInput, firmaSpan)) {
    const formData = new FormData(clientAddForm);
    await apiFunctions("client", "POST", formData);
    clientAddWindow.style.display = "none";
    getClients();
    clearInputAfterSave(clientAddForm);
  }
});
const supplierAddForm = document.getElementById("supplier_add_form");
const supplerFormAddBtn = document.querySelector("#supplier_add_btn");
supplerFormAddBtn.addEventListener("click", async function (event) {

  var firmaInput = document.querySelector("#id_CompanyName_Supplier")
  var firmaSpan = document.querySelector("#supplier_add_label")
  var reqInputs = document.querySelectorAll("#id_CompanyName_Supplier")
  var reqLabels = document.querySelectorAll("#supplier_add_label")

  event.preventDefault();

  if (requiredInputs(reqInputs, reqLabels) && await supplierNameControl(firmaInput, firmaSpan)) {
    const formData = new FormData(supplierAddForm);
    await apiFunctions("supplier", "POST", formData);
    supplierAddWindow.style.display = "none";
    getSuppliers();
    clearInputAfterSave(supplierAddForm);
  }
});










//                  DROPDOWN MENÜLER

async function getClients() {
  try {
    const data = await apiFunctions("client", "GET")
    let rows = "";
    for (const client of data) {
      const row = `<span value="${client.id}" class="dropdown-item">${client.CompanyName_Clients}</span>`;
      rows += row;
    }
    const clientDropdowns = document.querySelectorAll(".client-dropdown");
    clientDropdowns.forEach(async (clientDropdown) => {
      clientDropdown.innerHTML = rows;
    })
    dropdownActive();
  } catch (error) {
    console.error("Error fetching and rendering projects:", error);
  }
}
async function getSuppliers() {
  try {
    const data = await apiFunctions("supplier", "GET")
    let rows = "";
    for (const supplier of data) {
      const row = `<span value="${supplier.id}" class="dropdown-item">${supplier.CompanyName_Supplier}</span>`;
      rows += row;
    }
    const supplierDropdowns = document.querySelectorAll(".supplier_dropdown");
    supplierDropdowns.forEach(async (supplierDropdown) => {
      supplierDropdown.innerHTML = rows;
    })
    dropdownActive();
  } catch (error) {
    console.error("Error fetching and rendering projects:", error);
  }
}
async function getprojectName() {
  try {
    const data = await apiFunctions("project", "GET")
    let rows = "";
    for (const project of data) {
      const row = `<span value="${project.id}" class="dropdown-item">${project.ProjectName}</span>`;
      rows += row;
    }
    const projectDropdowns = document.querySelectorAll(".projects_dropdown");
    projectDropdowns.forEach(async (projectDropdown) => {
      projectDropdown.innerHTML = rows;
    })
    dropdownActive();
  } catch (error) {
    console.error("Error fetching and rendering projects:", error);
  }
}