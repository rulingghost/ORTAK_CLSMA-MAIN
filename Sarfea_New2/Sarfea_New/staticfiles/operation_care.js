var topMenuLi = document.querySelectorAll(".top-menu-ul li");
const faturaTable = document.querySelector("#fatura_table");
const faturaTableBody = faturaTable.querySelector("tbody");
const isletmeBakimTable = document.querySelector("#isletme_bakim_table");
const isletmeBakimTableBody = isletmeBakimTable.querySelector("tbody");
const arizaTakipTable = document.querySelector("#ariza_takip_table");
const arizaTakipTableBody = arizaTakipTable.querySelector("tbody");


const reqIncomeInputs = document.querySelectorAll("#id_Operation_Care_Company")
const reqIncomeLabels = document.querySelectorAll("#firma_adi_span")
const reqFailInputs = document.querySelectorAll("#id_Fail_Operation_Care")
const reqFailLabels = document.querySelectorAll("#Fail_Operation_Span")




document.addEventListener("DOMContentLoaded", function () {
  //                  CARD NONE VERİLERİ DÜZELTME

  topMenuLi[0].classList.add("li-hover");
  document.querySelector(".first_sorting_element").click();
});

getOperationCare(true)
async function getOperationCare(isEdit) {
  try {
    let currentRows = isletmeBakimTable.querySelectorAll("tbody tr");

    const data = await apiFunctions("operation_care", "GET");
    //console.log(data);
    let formattedDate;
    let rows = "";
    for (const operationCare of data) {
      var operationCareDetailUrl = `http://127.0.0.1:8000/operation_care_detail/${operationCare.id}/`;
      var className = dateFormatForColor1(formatDateForTable(operationCare.Operation_Care_Finish_Date))
      const row = `
        <tr>
          <td>
            <button id="${operationCare.id}" type="button" class="edit-project-btn" style="background: none; border:none;">
              <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
          <td><a href="${operationCareDetailUrl}">${operationCare.client.CompanyName_Clients}</a></td>
          <td>${formatNumber(operationCare.Operation_Care_Inventor_Power)}</td>
          <td>${operationCare.Operation_Care_Location}</td>
          <td>${formatNumber(operationCare.Operation_Care_Cost) + "₺" || 0 + "₺"}</td>
          <td>${operationCare.Operation_Care_Fail_Number}</td>
          <td> <span class="status ${className}">${formatDateForTable(operationCare.Operation_Care_Finish_Date)}</span></td>
        </tr>`;

      rows += row;
    }
    if (data.length > currentRows.length || isEdit) {

      isletmeBakimTableBody.innerHTML = "";
      isletmeBakimTableBody.insertAdjacentHTML("beforeend", rows);
      //sortingTable(projectsTable);
      // allTableFormat();
      //editButtonsEvents();
    }
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}
getOperationFail(true)
async function getOperationFail(isEdit) {
  try {
    let currentRows = arizaTakipTable.querySelectorAll("tbody tr");

    const data = await apiFunctions("fail", "GET");
    //console.log(data);
    let rows = "";
    for (const operationCareFail of data) {
      const row = `
        <tr>
          <td>
            <button id="${operationCareFail.id}" type="button" class="edit-project-btn" style="background: none; border:none;">
              <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
          <td>${operationCareFail.Fail_Central_Name}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Detection_Date)}</td>
          <td>${operationCareFail.Fail_Detail}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Team_Info_Date)}</td>
          <td>${operationCareFail.Fail_Information_Person}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Repair_Date)}</td>
          <td>${operationCareFail.Fail_Guaranteed}</td>
          <td>${operationCareFail.Fail_Situation}</td>
        </tr>`;

      rows += row;
    }
    if (data.length > currentRows.length || isEdit) {

      arizaTakipTableBody.innerHTML = "";
      arizaTakipTableBody.insertAdjacentHTML("beforeend", rows);
      //sortingTable(projectsTable);
      // allTableFormat();
      //editButtonsEvents();
    }
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}



// TARİH İNPUTLARI FORMATLAMA
const dateInputs = document.querySelectorAll(".date-inputs");
formatDateInputs(dateInputs);

// INPUT FORMATLAMA
const formatedInputs = document.querySelectorAll(".formatInputs");
inputsForFormat(formatedInputs);

//                  TABLO FORMATLAMA
isletmeTableFormat();
function isletmeTableFormat() {
  var numericCells = document.querySelectorAll('#isletme_bakim_table td:nth-child(3)');
  var tlCells = document.querySelectorAll('#isletme_bakim_table td:nth-child(5)');
  var textCells = document.querySelectorAll('#isletme_bakim_table td:nth-child(2), #isletme_bakim_table td:nth-child(4), #isletme_bakim_table td:nth-child(6), #isletme_bakim_table td:nth-child(7)');

  tableFormat(tlCells, "tl")
  tableFormat(numericCells, "numeric")
  tableFormat(textCells, "text")
}
arizaTableFormat();
function arizaTableFormat() {
  var textCells = document.querySelectorAll('#ariza_takip_table tr td:not(:first-child)');
  tableFormat(textCells, "text")
}
faturaTableFormat();
function faturaTableFormat() {
  var textCells = document.querySelectorAll('#ariza_takip_table tr td');
  tableFormat(textCells, "text")
}

//                  TOP MENÜ TIKLAMA

topMenuLi.forEach(function (item) {
  item.addEventListener("click", function () {
    topMenuLi.forEach(function (item) {
      item.classList.remove("li-hover");
    });
    this.classList.add("li-hover");
  });
});

//                  TOP MENU FONKSİYONLARI

topMenuLi.forEach(function (item) {
  item.addEventListener("click", function () {
    var clickedItemId = this.id;
    console.log(clickedItemId)
    handleMenuItemClick(clickedItemId);
  });
});
function handleMenuItemClick(clickedItemId) {
  switch (clickedItemId) {
    case "fatura":
      faturaTable.style.display = "table";
      isletmeBakimTable.style.display = "none";
      arizaTakipTable.style.display = "none";
      break;
    case "isletme_bakim":
      faturaTable.style.display = "none";
      isletmeBakimTable.style.display = "table";
      arizaTakipTable.style.display = "none";
      break;
    case "ariza_takip":
      faturaTable.style.display = "none";
      isletmeBakimTable.style.display = "none";
      arizaTakipTable.style.display = "table";
      break;
    default:
      break;
  }
}



var tarihRow = isletmeBakimTable.querySelectorAll("tbody tr")
dateFormatForColor(tarihRow, 7);

//----------------------------------------------



sortingTable(document.querySelector("#isletme_bakim_table"))
sortingTable(document.querySelector("#fatura_table"))
sortingTable(document.querySelector("#ariza_takip_table"))


console.log(apiFunctions("sales_offer", "GET"))




//-----               EKLEME SAYFALARI
const operationCareAddWindowButton = document.querySelector("#operation_care_add_btn")
const operationCareAddWindow = document.querySelector(".operation-care-add-window")

const arizaAddWindowButton = document.querySelector("#ariza_add_btn")
const arizaAddWindow = document.querySelector(".ariza-add-window")

const arizaFaturaAddSelect = document.querySelector("#id_Fail_Guaranteed")
const arizaFaturaAddWindow = document.querySelector(".ariza-fatura-add-window")

//        FİRMA EKLEME
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

//        BAKIM EKLEME
operationCareAddWindowButton.addEventListener("click", () => {
  setTimeout(() => {
    operationCareAddWindow.style.display = "flex";
    //getSuppliers()
    //getprojectName()
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const operationCareAddContainer = operationCareAddWindow.querySelector(".container");
  if (!operationCareAddContainer.contains(event.target) && clientAddWindow.style.display == "none") {
    operationCareAddWindow.style.display = "none";
  }
});
//        ARIZA EKLEME
arizaAddWindowButton.addEventListener("click", () => {
  setTimeout(() => {
    arizaAddWindow.style.display = "flex";
    //getSuppliers()
    //getprojectName()
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const arizaAddContainer = arizaAddWindow.querySelector(".container");
  if (!arizaAddContainer.contains(event.target) && arizaFaturaAddWindow.style.display == "none") {
    arizaAddWindow.style.display = "none";
  }
});
//        ARIZA FATURA EKLEME
arizaFaturaAddSelect.addEventListener("change", () => {
  const selectedOption = arizaFaturaAddSelect.options[arizaFaturaAddSelect.selectedIndex].text;
  if (selectedOption.startsWith("Evet")) {
    arizaFaturaAddWindow.style.display = "flex";
  } else {
    arizaFaturaAddWindow.style.display = "none";
  }
});
document.addEventListener("mousedown", (event) => {
  const arizaFaturaAddContainer = arizaFaturaAddWindow.querySelector(".container");
  if (!arizaFaturaAddContainer.contains(event.target)) {
    if (arizaFaturaAddSelect.value == "Evet" && arizaFaturaAddWindow.style.display == "flex") {
      setTimeout(() => {
        arizaFaturaAddSelect.value = "Belirsiz"
      }, 10);
    }
    arizaFaturaAddWindow.style.display = "none";
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




/***********************************************************
#                       ADD SAYFALARI
***********************************************************/

//                  SALES OFFER ADD 
const operationCareAddForm = document.getElementById("operation_care_add_form");
const operationCareFormAddBtn = document.querySelector("#operation-care-create-btn");
operationCareFormAddBtn.addEventListener("click", async function (event) {

  event.preventDefault();

  if (requiredInputs(reqIncomeInputs, reqIncomeLabels)) {

    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = operationCareAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })

    const formData = new FormData(operationCareAddForm);
    const inputs = document.querySelectorAll(".operation-care-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });
    const jsonObject = {};
    for (const [key, value] of formData.entries()) {
      jsonObject[key] = value;
    }
    console.log(JSON.stringify(jsonObject));

    await apiFunctions("operation_care", "POST", formData);
    operationCareAddWindow.style.display = "none";
    getClients();
    clearInputAfterSave(operationCareAddForm);
  }
});

//                  ARIZA ADD 
const arizaAddForm = document.getElementById("ariza-add-form");
const arizaFaturaAddForm = document.getElementById("fatura_form");
const arizaFormAddBtn = document.querySelector("#ariza-create-btn");
const arizaFaturaFormAddBtn = document.querySelector("#fatura-create-btn");
arizaFaturaFormAddBtn.addEventListener("click", async function (event) {
  arizaFaturaAddWindow.style.display = "none";
})

arizaFormAddBtn.addEventListener("click", async function (event) {

  event.preventDefault();

  if (requiredInputs(reqFailInputs, reqFailLabels)) {

    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = arizaAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })

    const formData = new FormData(arizaAddForm);
    const inputs = document.querySelectorAll(".ariza-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });
    const billSelect = document.querySelector("#id_Fail_Guaranteed");
    if(billSelect.value == "Evet"){
      console.log("fsdf")
      const billFormData = new FormData(arizaFaturaAddForm);
      for (const [key, value] of billFormData.entries()) {
        formData.append(key, value); 
      }
    }    
    // const jsonObject = {};
    // for (const [key, value] of formData.entries()) {
    //   jsonObject[key] = value;
    // }
    // console.log(JSON.stringify(jsonObject));
    await apiFunctions("fail", "POST", formData);
    arizaAddWindow.style.display = "none";
    clearInputAfterSave(arizaAddForm);
  }
});

//                  CLİENT ADD 
const clientAddForm = document.getElementById("firma_add_form");
const clientFormAddBtn = document.querySelector("#firma_submit_btn");
clientFormAddBtn.addEventListener("click", async function (event) {
  var reqInputs = document.querySelectorAll("#id_CompanyName_Clients");
  var reqLabels = document.querySelectorAll("#firma_add_label")
  var firmaInput = document.querySelector("#id_CompanyName_Clients");
  var firmaSpan = document.querySelector("#firma_add_label")
  event.preventDefault();

  if (requiredInputs(reqInputs, reqLabels) && await clientNameControl(firmaInput, firmaSpan)) {
    try {
      const formData = new FormData(firma_add_form);
      apiFunctions("client", "POST", formData)
      clientAddWindow.style.display = "none";
      setTimeout(() => {
        getClients();
      }, 10);
      clearInputAfterSave(clientAddForm);
    } catch (error) {
      console.error("There was an error!", error);
    }
  }
});


//                  DROPDOWN MENÜLER
getClients()
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

getOperation()
async function getOperation() {
  try {
    const data = await apiFunctions("operation_care", "GET")
    let rows = "";
    for (const operation of data) {
      const row = `<span value="${operation.id}" class="dropdown-item">${operation.client.CompanyName_Clients}</span>`;
      rows += row;
    }
    const operationDropdowns = document.querySelectorAll(".operation-dropdown");
    operationDropdowns.forEach(async (operationDropdown) => {
      operationDropdown.innerHTML = rows;
    })
    dropdownActive();
  } catch (error) {
    console.error("Error fetching and rendering projects:", error);
  }
}