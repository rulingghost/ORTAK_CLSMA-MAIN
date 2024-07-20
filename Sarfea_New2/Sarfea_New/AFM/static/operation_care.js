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
const arizaFaturaAddForm = document.getElementById("fatura_form");




document.addEventListener("DOMContentLoaded", function () {
  //                  CARD NONE VERİLERİ DÜZELTME

  topMenuLi[0].classList.add("li-hover");
  document.querySelector(".first_sorting_element").click();
});

getOperationCare(true)
async function getOperationCare(isEdit) {
  try {
    let currentRows = isletmeBakimTable.querySelectorAll("tbody tr");

    var data = await apiFunctions("operation_care", "GET");
    console.log(data);
    
    const failData = await apiFunctions("fail", "GET");
    console.log(failData);
    
    let formattedDate;
    let rows = "";
    for (const operationCare of data) {
      let failCount = 0;
      failData.forEach((fail)=>{
        if(fail.Fail_Operation_Care == operationCare.id){
          failCount++;
        }
      })
      var operationCareDetailUrl = `/operation_care_detail/${operationCare.id}/`;
      var className = dateFormatForColor1(formatDateForTable(operationCare.Operation_Care_Finish_Date))
      const row = `
        <tr>
          <td>
            <button id="${operationCare.id}" type="button" class="edit-operation-btn" style="background: none; border:none;">
              <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
          <td><a href="${operationCareDetailUrl}">${operationCare.client.PowerPlantName}</a></td>
          <td>${formatNumber(operationCare.Operation_Care_Capacity)}</td>
          <td>${operationCare.Operation_Care_Location}</td>
          <td>${formatNumber(operationCare.Operation_Care_Cost) + "₺" || 0 + "₺"}</td>
          <td>${failCount}</td>
          <td> <span class="status ${className}">${formatDateForTable(operationCare.Operation_Care_Finish_Date)}</span></td>
        </tr>`;

      rows += row;
    }
    if (data.length > currentRows.length || isEdit) {

      isletmeBakimTableBody.innerHTML = "";
      isletmeBakimTableBody.insertAdjacentHTML("beforeend", rows);
      sortingTable(isletmeBakimTable);
      // allTableFormat();
      operationEditButtonsEvents();
    }
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}
getOperationFail(true)
async function getOperationFail(isEdit) {
  try {
    let currentRows = arizaTakipTable.querySelectorAll("tbody tr");

    var data = await apiFunctions("fail", "GET");
    let rows = "";
    const failPriorities = {
      "Belirlendi": 1,
      "Onarımda": 2,
      "Onarıldı": 3
    };
    data.sort((a, b) => failPriorities[a.Fail_Situation] - failPriorities[b.Fail_Situation]);
    
    for (const operationCareFail of data) {
      let arizaDurumu;
      switch (operationCareFail.Fail_Situation) {
        case "Belirlendi":
          arizaDurumu = "timeIsUp";
          break;
        case "Onarımda":
          arizaDurumu = "twoWeek";
          break;
        case "Onarıldı":
          arizaDurumu = "green";
          break;
        default:
          arizaDurumu = "";
      }
      const row = `
        <tr>
          <td>
            <button id="${operationCareFail.id}" type="button" class="edit-fail-btn" style="background: none; border:none;">
              <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>          
          <td><span class="status ${arizaDurumu}">${operationCareFail.Fail_Situation}</span></td>
          <td>${operationCareFail.Fail_Central_Name}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Detection_Date)}</td>
          <td>${operationCareFail.Fail_Detail}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Team_Info_Date)}</td>
          <td>${operationCareFail.Fail_Information_Person}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Repair_Date)}</td>
          <td>${operationCareFail.Fail_Guaranteed}</td>          
        </tr>`;

      rows += row;
    }
    if (data.length > currentRows.length || isEdit) {
      arizaTakipTableBody.innerHTML = "";
      arizaTakipTableBody.insertAdjacentHTML("beforeend", rows);
      failEditButtonsEvents();
      sortingTable(arizaTakipTable);
      // allTableFormat();
      //editButtonsEvents();
    }
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}


getOperationBill(true)
async function getOperationBill(isEdit) {
  try {
    let currentRows = faturaTable.querySelectorAll("tbody tr");

    var data = await apiFunctions("fail", "GET");
    let rows = "";
    for (const operationCareFail of data) {
      const row = `
        <tr>         
          <td>${operationCareFail.Fail_Bill_Central_Name || "-"}</td>
          <td>${operationCareFail.Fail_Bill_Process || "-"}</td>
          <td>${operationCareFail.Fail_Bill_Detail || "-"}</td>
          <td>${formatDateForTable(operationCareFail.Fail_Bill_Date)}</td>
          <td>${operationCareFail.Fail_Bill_File ? `<button class="mr-3 blue" onclick="openFile('${operationCareFail.Fail_Bill_File}')">Dosyayı Aç</button>` : `-`}</td>             
        </tr>`;
      if(operationCareFail.Fail_Guaranteed == "Hayır"){
        rows += row;
      }
    }
    if (data.length > currentRows.length || isEdit) {
      faturaTableBody.innerHTML = "";
      faturaTableBody.insertAdjacentHTML("beforeend", rows);

      sortingTable(faturaTable);
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
// isletmeTableFormat();
// function isletmeTableFormat() {
//   var numericCells = document.querySelectorAll('#isletme_bakim_table td:nth-child(3)');
//   var tlCells = document.querySelectorAll('#isletme_bakim_table td:nth-child(5)');
//   var textCells = document.querySelectorAll('#isletme_bakim_table td:nth-child(2), #isletme_bakim_table td:nth-child(4), #isletme_bakim_table td:nth-child(6), #isletme_bakim_table td:nth-child(7)');

//   tableFormat(tlCells, "tl")
//   tableFormat(numericCells, "numeric")
//   tableFormat(textCells, "text")
// }
// arizaTableFormat();
// function arizaTableFormat() {
//   var textCells = document.querySelectorAll('#ariza_takip_table tr td:not(:first-child)');
//   tableFormat(textCells, "text")
// }
// faturaTableFormat();
// function faturaTableFormat() {
//   var textCells = document.querySelectorAll('#ariza_takip_table tr td');
//   tableFormat(textCells, "text")
// }

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











//-----               EKLEME SAYFALARI
const operationCareAddWindowButton = document.querySelector("#operation_care_add_btn")
const operationCareAddWindow = document.querySelector(".operation-care-add-window")

const arizaAddWindowButton = document.querySelector("#ariza_add_btn")
const arizaAddWindow = document.querySelector(".ariza-add-window")

const arizaFaturaAddSelect = document.querySelector("#id_Fail_Guaranteed")
const arizaFaturaAddWindow = document.querySelector(".ariza-fatura-add-window")
let operationEditMode = false;
let failEditMode = false;


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
    if (operationEditMode == true) { clearInputAfterSave(operationCareAddForm) }
    operationEditMode = false;
    operationCareAddWindow.style.display = "flex";
    getClients();
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
    if (failEditMode == true) { clearInputAfterSave(arizaAddForm) }
    failEditMode = false;
    arizaAddWindow.style.display = "flex";
    getClients();
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
  if (selectedOption.startsWith("Hayır")) {
    arizaFaturaAddWindow.style.display = "flex";
  } else {
    arizaFaturaAddWindow.style.display = "none";    
    clearInputAfterSave(arizaFaturaAddForm)
  }
});
document.addEventListener("mousedown", (event) => {
  const arizaFaturaAddContainer = arizaFaturaAddWindow.querySelector(".container");
  if (!arizaFaturaAddContainer.contains(event.target)) {
    if (arizaFaturaAddSelect.value == "Hayır" && arizaFaturaAddWindow.style.display == "flex") {
      setTimeout(() => {
        arizaFaturaAddSelect.value = "Belirsiz"
        clearInputAfterSave(arizaFaturaAddForm)
      }, 10);
    }
    arizaFaturaAddWindow.style.display = "none";
  }
});
document.querySelector("#ariza-fatura-X").addEventListener("click", ()=>{
  arizaFaturaAddSelect.value = "Belirsiz"
})
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
#                       EDİT SAYFALARI
***********************************************************/
let operationBtnID = -1;
function operationEditButtonsEvents() {
  let editButtons = document.querySelectorAll(".edit-operation-btn");
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(async () => {
        operationEditMode = true;
        operationBtnID = button.id;
        const data = await apiFunctions("operation_care", "GETID", "x", operationBtnID)
        for (var key in data) {
          if (data.hasOwnProperty(key)) {            
            var element = document.querySelector('input[name="' + key + '"]');
            var selectElement = document.querySelector('select[name="' + key + '"]');
            if (element) {
              //console.log(key)
              //console.log(data[key])
              //let projectNameForEdit = document.querySelector("#id_ProjectName");
              //projectNameForEdit.setAttribute('data-id', btnID);
              if (key == "Operation_Care_Company") {
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
        operationCareAddWindow.style.display = "flex";
      }, 10);
    })
  });
}

let failBtnID = -1;
function failEditButtonsEvents() {
  let editButtons = document.querySelectorAll(".edit-fail-btn");
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(async () => {
        failEditMode = true;
        failBtnID = button.id;
        const data = await apiFunctions("fail", "GETID", "x", failBtnID)
        console.log("logggggg");
        console.log(data);
        for (var key in data) {
          if (data.hasOwnProperty(key)) {            
            var element = document.querySelector('input[name="' + key + '"]');
            var selectElement = document.querySelector('select[name="' + key + '"]');
            if (element) {
              if(key != "Fail_Bill_File"){
                if (key == "Fail_Operation_Care") {
                  console.log(data.Fail_Operation_Care);
                  let failIdd = data.Fail_Operation_Care;
                  const dataFail = await apiFunctions("operation_care", "GETID", "x", failIdd)
                  element.value = dataFail.client.CompanyName_Clients;
                } else {
                  element.value = data[key];
                }
              }
              //let projectNameForEdit = document.querySelector("#id_ProjectName");
              //projectNameForEdit.setAttribute('data-id', btnID);
             
            } else if (selectElement) {
              selectElement.value = data[key];
            }
          }
        }
        getClients();
        onPageLoads(formatedInputs)
        formatDateInputsForLoad(dateInputs)
        arizaAddWindow.style.display = "flex";
      }, 10);
    })
  });
}

/***********************************************************
#                       ADD SAYFALARI
***********************************************************/

//                  OPERATİON CARE ADD 
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
    console.log(operationBtnID);
    const jsonObject = {};
    for (const [key, value] of formData.entries()) {
      jsonObject[key] = value;
    }
    console.log(JSON.stringify(jsonObject));

    if (operationEditMode == false) {
      await apiFunctions("operation_care", "POST", formData);
      operationCareAddWindow.style.display = "none";
      getOperationCare(true);
      clearInputAfterSave(operationCareAddForm);
    } else {
      await apiFunctions("operation_care", "PUT", formData, operationBtnID);
      operationCareAddWindow.style.display = "none";
      getOperationCare(true);
      clearInputAfterSave(operationCareAddForm);
    }
  }
});

//                  ARIZA ADD 
const arizaAddForm = document.getElementById("ariza-add-form");

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
    if(billSelect.value == "Hayır"){
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
    // console.log(failEditMode)

    if (failEditMode == false) {
      await apiFunctions("fail", "POST", formData);
      arizaAddWindow.style.display = "none";
      clearInputAfterSave(arizaAddForm);
      getOperationFail(true);
      getOperationCare(true)
    } else {
      if(document.querySelector("#id_Fail_Bill_File").value == ""){
        formData.delete("Fail_Bill_File")
      }
      await apiFunctions("fail", "PUT", formData, failBtnID);
      arizaAddWindow.style.display = "none";
      clearInputAfterSave(arizaAddForm);
      getOperationFail(true);
      getOperationCare(true)
    }
  }
});






//                  CLİENT ADD 
const clientAddForm = document.getElementById("firma_add_form");
const clientFormAddBtn = document.querySelector("#firma_submit_btn");
clientFormAddBtn.addEventListener("click", async function (event) {
  var reqInputs = document.querySelectorAll("#id_CompanyName_Clients");
  var reqLabels = document.querySelectorAll("#firma_add_label")
  var firmaInput = document.querySelector("#id_PowerPlantName");
  var firmaSpan = document.querySelector("#firma_add_label")
  event.preventDefault();

  if (requiredInputs(reqInputs, reqLabels) && await powerpointNameControl(firmaInput, firmaSpan) ) {    
    try {
      const formData = new FormData(firma_add_form);
      apiFunctions("powerpoint", "POST", formData)
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
    var data = await apiFunctions("powerpoint", "GET")
    console.log(data);
    let rows = "";
    for (const client of data) {
      const row = `<span value="${client.id}" class="dropdown-item">${client.PowerPlantName}</span>`;
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
    var data = await apiFunctions("operation_care", "GET");
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

document.getElementById("id_Fail_Bill_File").addEventListener("change", function () {
  var fileName = this.value.split("\\").pop();
  document.getElementById("fatura_file_span").innerText = fileName + " seçildi";
});