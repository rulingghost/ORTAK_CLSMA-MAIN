const jobHistoryTable = document.querySelector('#jobhistory_table');
const jobHistoryTableBody = jobHistoryTable.querySelector('tbody');
const expensesTable = document.querySelector('#expenses_table');
const expensesTableBody = expensesTable.querySelector('tbody');
const totalTable = document.querySelector('#total_table');
const totalTableBody = totalTable.querySelector('tbody');

const expensesDateInput = document.querySelector("#id_Date_Expenses");
const expensesAmountInput = document.querySelector("#id_Amount_Expenses");

const reqExpensesInput = document.querySelectorAll("#id_CompanyName_Paying_Expenses, #id_ExpensDetails_Expenses");
const reqExpensesLabels = document.querySelectorAll("#odeme_yapilan_firma_span, #gider_detay_span");

const reqJobhistoryInputs = document.querySelectorAll("#id_CompanyName_Job_JobHistory");
const reqJobhistoryLabels = document.querySelectorAll("#is_yapilan_firma_span");

const jobhistoryDateInput = document.querySelector("#id_Date_JobHistory");
const jobhistoryAmountInput = document.querySelector("#id_Amount_JobHistory");

const projectId = document.querySelector(".table__header p").id;
let supplierId = 0;
let expensesEditMode = false;
let jobHistoryEditMode = false;

//                  JOBHISTORY TABLE

async function getJobhistory(id) {
    try {
        let currentRows = jobHistoryTable.querySelectorAll("tr");
        //const data = await apiFunctions("job_history", "GET")
        //console.log(data)
        const data = await apiFunctions("project", "GETID", "x", projectId)        
        let rows = '';
        let totalTlSpan = document.querySelector("#jobhistory_tl_td");
        let totalUSDSpan = document.querySelector("#jobhistory_usd_td");
        let totalTl = 0;
        let totalUSD = 0;
        let formattedDate;
        for (const jobHistory of data.project_jobhistories) {

            // if (jobHistory.Date_JobHistory) {
            //     let date = new Date(jobHistory.Date_JobHistory);
            //     formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
            // } else { formattedDate = "-" }
            if (jobHistory.supplier_jobhistories.id == id) {
                const row = `
                <tr>
                    <td>
                        <button id="${jobHistory.id}" type="button" class="edit-jobhistory-btn" style="background: none; border:none;">
                        <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
                        <span style="display: none;">Düzenle</spam>
                        </button>
                    </td>
                    <td data-label="Fatura No" title="${jobHistory.Invoice_No_JobHistory || "-"}">${jobHistory.Invoice_No_JobHistory || "-"}</td>
                    <td data-label="Tarih" title="${formatDateForTable(jobHistory.Date_JobHistory)}">${formatDateForTable(jobHistory.Date_JobHistory)}</td>
                    <td data-label="Cinsi" title="${jobHistory.ExpensDetails_JobHistory || "-"}">${jobHistory.ExpensDetails_JobHistory || "-"}</td>
                    <td data-label="Tutar(TL)" title="${formatNumber(jobHistory.Amount_JobHistory, 2) + "₺"}">${formatNumber(jobHistory.Amount_JobHistory, 2) + "₺"}</td>
                    <td data-label="Kur" title="${formatNumber(jobHistory.Dollar_Rate_JobHistory, 4) + "₺"}">${formatNumber(jobHistory.Dollar_Rate_JobHistory, 4) + "₺"}</td>
                    <td data-label="Tutar(USD)" title="${formatNumber((parseFloat(jobHistory.Amount_JobHistory) / parseFloat(jobHistory.Dollar_Rate_JobHistory)), 2)}">${formatNumber((parseFloat(jobHistory.Amount_JobHistory) / parseFloat(jobHistory.Dollar_Rate_JobHistory)), 2) + "$"}</td>
                </tr>`;
                rows += row;
                totalTl += parseFloat(jobHistory.Amount_JobHistory) || 0;
                totalUSD += (parseFloat(jobHistory.Amount_JobHistory) / parseFloat(jobHistory.Dollar_Rate_JobHistory)) || 0;
            }
        }
        totalTlSpan.textContent = formatNumber(parseFloat(totalTl.toString()), 2);
        totalUSDSpan.textContent = formatNumber(parseFloat(totalUSD.toString()), 2);
        if (true) {
            jobHistoryTableBody.innerHTML = '';
            jobHistoryTableBody.insertAdjacentHTML('beforeend', rows);
            sortTableForStart(jobHistoryTable, 1);
            //jobhistoryTableFormat()
            sortingTable(jobHistoryTable)
            jobHistoryEditButtonsEvents()
        }

    } catch (error) {
        console.error('Error fetching and rendering clients:', error);
    }
}
async function getExpenses(id) {
    try {
        let currentRows = expensesTableBody.querySelectorAll("tr");
        //const data = await apiFunctions("expense", "GET")
        //console.log(data)
        const data = await apiFunctions("project", "GETID", "x", projectId)
        let totalTlSpan = document.querySelector("#expenses_tl_td");
        let totalUSDSpan = document.querySelector("#expenses_usd_td");
        let totalTl = 0;
        let totalUSD = 0;
        let rows = '';
        //let formattedDate;
        for (const expenses of data.project_expenses) {
            // if (expenses.Date_Expenses) {
            //     let date = new Date(expenses.Date_Expenses);
            //     formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
            // } else { formattedDate = "-" }
            if (expenses.supplier_expenses.id == id) {
                const row = `
                <tr>
                    <td>
                        <button id="${expenses.id}" type="button" class="edit-expenses-btn" style="background: none; border:none;">
                        <i id="edit-text" class="fa-solid fa-pen-to-square"></i>
                        <span style="display: none;">Düzenle</spam>
                        </button>
                    </td>
                    <td data-label="Tarih" title="${formatDateForTable(expenses.Date_Expenses)}" style="text-align:center">${formatDateForTable(expenses.Date_Expenses)}</td>
                    <td data-label="Açıklama" title="${expenses.ExpensDetails_Expenses || "-"}">${expenses.ExpensDetails_Expenses || "-"}</td>
                    <td data-label="Banka" title="${expenses.Bank_Expenses || "-"}">${expenses.Bank_Expenses || "-"}</td>
                    <td data-label="Tutar(TL)" title="${formatNumber(expenses.Amount_Expenses, 2) + "₺"}">${formatNumber(expenses.Amount_Expenses, 2) + "₺"}</td>
                    <td data-label="Kur" title="${formatNumber(expenses.Dollar_Rate_Expenses, 4) + "₺"}">${formatNumber(expenses.Dollar_Rate_Expenses, 4) + "₺"}</td>
                    <td data-label="Tutar(USD)" title="${formatNumber(parseFloat((expenses.Amount_Expenses) / parseFloat(expenses.Dollar_Rate_Expenses)), 2) + "$"}">${formatNumber(parseFloat((expenses.Amount_Expenses) / parseFloat(expenses.Dollar_Rate_Expenses)), 2) + "$"}</td>
                </tr>`;
                rows += row;
                totalTl += parseFloat(expenses.Amount_Expenses) || 0;
                totalUSD += (parseFloat(expenses.Amount_Expenses) / parseFloat(expenses.Dollar_Rate_Expenses)) || 0;
            }
            totalTlSpan.textContent = formatNumber(parseFloat(totalTl.toString()), 2);
            totalUSDSpan.textContent = formatNumber(parseFloat(totalUSD.toString()), 2);
        }
        if (true) {
            expensesTableBody.innerHTML = '';
            expensesTableBody.insertAdjacentHTML('beforeend', rows);
            sortTableForStart(expensesTable, 1);
            //expensesTableFormat();
            sortingTable(expensesTable)
            expensesEditButtonsEvents();
        }

    } catch (error) {
        console.error('Error fetching and rendering clients:', error);
    }
}
async function getTotalTable() {
    try {
        let currentRows = totalTableBody.querySelectorAll("tr");
        //const data = await apiFunctions("expense", "GET")
        //console.log(data)
        const data = await apiFunctions("project", "GETID", "x", projectId)

        let totalTlLeft = 0;
        let totalUSDLeft = 0;
        let totalTlRight = 0;
        let totalUSDRight = 0;
        console.log(data)
        var supplierList = {};

        data.project_expenses.forEach(function (obj) {

            var supplierName = obj.supplier_expenses.CompanyName_Supplier;
            if (!supplierList.hasOwnProperty(supplierName)) {
                supplierList[supplierName] = {
                    id: obj.supplier_expenses.id,
                    name: obj.supplier_expenses.CompanyName_Supplier,
                    expensesTl: parseFloat(obj.Amount_Expenses),
                    expensesUsd: parseFloat(obj.Amount_USD_Expenses)
                };
            } else {
                if (typeof supplierList[supplierName].expensesTl !== 'number') {
                    supplierList[supplierName].expensesTl = 0;
                }
                if (typeof supplierList[supplierName].expensesUsd !== 'number') {
                    supplierList[supplierName].expensesUsd = 0;
                }
                supplierList[supplierName].expensesTl += parseFloat(obj.Amount_Expenses);
                supplierList[supplierName].expensesUsd += parseFloat(obj.Amount_USD_Expenses);
            }
        });
        data.project_jobhistories.forEach(function (obj) {
            var supplierName = obj.supplier_jobhistories.CompanyName_Supplier;

            if (!supplierList.hasOwnProperty(supplierName)) {
                supplierList[supplierName] = {
                    id: obj.supplier_jobhistories.id,
                    name: obj.supplier_jobhistories.CompanyName_Supplier,
                    jobHistoryTl: parseFloat(obj.Amount_JobHistory),
                    jobhistoryUsd: parseFloat(obj.Amount_USD_JobHistory)
                };
            } else {
                if (isNaN(parseFloat(supplierList[supplierName].jobHistoryTl))) {
                    supplierList[supplierName].jobHistoryTl = 0;
                }
                if (isNaN(parseFloat(supplierList[supplierName].jobhistoryUsd))) {
                    supplierList[supplierName].jobhistoryUsd = 0;
                }
                supplierList[supplierName].jobHistoryTl += parseFloat(obj.Amount_JobHistory);
                supplierList[supplierName].jobhistoryUsd += parseFloat(obj.Amount_USD_JobHistory);
            }
        });
        let totalTlSpanLeft = document.querySelector("#total_left_tl_td");
        let totalUSDSpanLeft = document.querySelector("#total_left_usd_td");
        let totalTlSpanRight = document.querySelector("#total_right_tl_td");
        let totalUSDSpanRight = document.querySelector("#total_right_usd_td");
        let rows = '';
        for (var key in supplierList) {
            const row = `
                <tr>              
                    <td></td>      
                    <td data-label="Firma Adı">${supplierList[key].name}</td>
                    <td data-label="Toplam İş Miktarı(TL)">${formatNumber(supplierList[key].jobHistoryTl) + "₺"}</td>
                    <td data-label="Toplam İş Miktarı(USD)">${formatNumber(supplierList[key].jobhistoryUsd) + "$"}</td>
                    <td data-label="Toplam Gider(TL)">${formatNumber(supplierList[key].expensesTl) + "₺"}</td>
                    <td data-label="Toplam Gider(USD)">${formatNumber(supplierList[key].expensesUsd) + "$"}</td>
                </tr>`;
            rows += row;
            totalTlLeft += !isNaN(parseFloat(supplierList[key].jobHistoryTl)) ? parseFloat(supplierList[key].jobHistoryTl) : 0;
            totalUSDLeft += !isNaN(parseFloat(supplierList[key].jobhistoryUsd)) ? parseFloat(supplierList[key].jobhistoryUsd) : 0;
            totalTlRight += !isNaN(parseFloat(supplierList[key].expensesTl)) ? parseFloat(supplierList[key].expensesTl) : 0;
            totalUSDRight += !isNaN(parseFloat(supplierList[key].expensesUsd)) ? parseFloat(supplierList[key].expensesUsd) : 0;

        }
        totalTlSpanLeft.textContent = formatNumber(parseFloat(totalTlLeft.toString()), 2) + " ₺";
        totalUSDSpanLeft.textContent = formatNumber(parseFloat(totalUSDLeft.toString()), 2) + " $";
        totalTlSpanRight.textContent = formatNumber(parseFloat(totalTlRight.toString()), 2) + " ₺";
        totalUSDSpanRight.textContent = formatNumber(parseFloat(totalUSDRight.toString()), 2) + " $";
        document.querySelector("#genel_tl").textContent = formatNumber(parseFloat((totalTlRight - totalTlLeft).toString()), 2) + " ₺";
        document.querySelector("#genel_usd").textContent = formatNumber(parseFloat((totalUSDRight - totalUSDLeft).toString()), 2) + " $";        
        if (true) {

            totalTableBody.innerHTML = '';
            totalTableBody.insertAdjacentHTML('beforeend', rows);
            sortTableForStart(totalTable, 1);
            //totalTableFormat()
            sortingTable(totalTable)
        }

    } catch (error) {
        console.error('Error fetching and rendering clients:', error);
    }
}

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


// function expensesTableFormat() {
//     var usdCells = expensesTableBody.querySelectorAll("td:nth-child(7)");
//     var tlCells = expensesTableBody.querySelectorAll("td:nth-child(5)");
//     var kurCells = expensesTableBody.querySelectorAll("td:nth-child(6)");
//     var textCells = expensesTableBody.querySelectorAll("td:nth-child(2), td:nth-child(3), td:nth-child(4)");
//     tableFormat(usdCells, "usd");
//     tableFormat(tlCells, "tl");
//     tableFormat(textCells, "text");
//     tableFormat(kurCells, "kur");
// }
// function jobhistoryTableFormat() {
//     var usdCells = jobHistoryTableBody.querySelectorAll("td:nth-child(7)");
//     var tlCells = jobHistoryTableBody.querySelectorAll("td:nth-child(5)");
//     var kurCells = jobHistoryTableBody.querySelectorAll("td:nth-child(6)");
//     var textCells = jobHistoryTableBody.querySelectorAll("td:nth-child(2), td:nth-child(3), td:nth-child(4)");
//     tableFormat(usdCells, "usd");
//     tableFormat(tlCells, "tl");
//     tableFormat(textCells, "text");
//     tableFormat(kurCells, "kur");
// }
// function totalTableFormat() {
//     var usdCells = totalTableBody.querySelectorAll("td:nth-child(4),td:nth-child(6)");
//     var tlCells = totalTableBody.querySelectorAll("td:nth-child(3), td:nth-child(5)");
//     tableFormat(usdCells, "usd");
//     tableFormat(tlCells, "tl");
// }

//                  İNPUT FORMATLAMA
const formatedInputs = document.querySelectorAll(".formatInputs");
inputsForFormat(formatedInputs);

//                  EKLEME BUTTONLARI

var expensesAddWindow = document.querySelector('.expenses-add-window');
var expensesAddWindowButton = document.querySelector('.expenses-add-btn');
var jobhistoryAddWindow = document.querySelector('.jobhistory-add-window');
var jobhistoryAddWindowButton = document.querySelector('.jobhistory-add-btn');

//----- EXPENSES
expensesAddWindowButton.addEventListener("click", () => {
    setTimeout(() => {
        if (expensesEditMode == true) { clearInputAfterSave(expensesAddForm) }
        expensesEditMode = false;
        expensesAddWindow.style.display = "flex";
        getSuppliers()
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
        if (jobHistoryEditMode == true) { clearInputAfterSave(jobhistoryAddForm) }
        jobHistoryEditMode = false;
        jobhistoryAddWindow.style.display = "flex";
        getSuppliers()
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


/***********************************************************
#                       EXPENSES ADD
***********************************************************/

const expensesAddForm = document.getElementById("expenses_add_form");
const expensesFormAddBtn = document.querySelector("#expenses-create-btn");
expensesFormAddBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    if (requiredInputs(reqExpensesInput, reqExpensesLabels)) {
        const compId = document.getElementById("id_CompanyName_Paying_Expenses").value;
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
        if (expensesEditMode == false) {
            await apiFunctions("expense", "POST", formData);
        } else {
            await apiFunctions("expense", "PUT", formData, expensesBtnID);
        }
        expensesAddWindow.style.display = "none";
        await getCompany()
        getExpenses(supplierId)
        getSuppliers();
        clearInputAfterSave(expensesAddForm);
        getTotalTable();
        firstClickToCompany(compId)
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
        let kurValue = await getUSDKur(tarih);
        expensesKurInput.value = kurValue.replace('.', ',');
    } else if (secilenDeger === "secenek3") {
        tarih = tarihFormatiniDegistir(expensesDateInput.value);
        let kurValue = await getUSDKur(tarih);
        expensesKurInput.value = kurValue.replace('.', ',');
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
        const compId = document.getElementById("id_CompanyName_Job_JobHistory").value;
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
        if (jobHistoryEditMode == false) {
            await apiFunctions("job_history", "POST", formData);
        } else {
            await apiFunctions("job_history", "PUT", formData, jobHistoryBtnID);
        }
        jobhistoryAddWindow.style.display = "none";
        await getCompany()
        getSuppliers();
        getJobhistory(supplierId)
        clearInputAfterSave(jobhistoryAddForm);
        getTotalTable();
        firstClickToCompany(compId)
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
        let kurValue = await getUSDKur(tarih);
        jobhistoryKurInput.value = kurValue.replace('.', ',');
    } else if (secilenDeger === "secenek3") {
        tarih = tarihFormatiniDegistir(jobhistoryDateInput.value);
        let kurValue = await getUSDKur(tarih);
        jobhistoryKurInput.value = kurValue.replace('.', ',');
    }
});

//                    SUPPLİER ADD

const supplierAddForm = document.getElementById("supplier_add_form");
const supplerFormAddBtn = document.querySelector("#supplier_add_btn");
supplerFormAddBtn.addEventListener("click", async function (event) {
    var firmaInput = document.querySelector("#id_CompanyName_Supplier")
    var firmaSpan = document.querySelector("#firma_add_label")
    var reqInputs = document.querySelectorAll("#id_CompanyName_Supplier")
    var reqLabels = document.querySelectorAll("#firma_add_label")
    event.preventDefault();

    if (requiredInputs(reqInputs, reqLabels) && await supplierNameControl(firmaInput, firmaSpan)) {
        const formData = new FormData(supplierAddForm);
        await apiFunctions("supplier", "POST", formData)
        supplierAddWindow.style.display = "none";
        getSuppliers();
        clearInputAfterSave(supplierAddForm);
    }
});

async function getSuppliers() {
    try {
        const data = await apiFunctions("supplier", "GET");
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



const totalTableBtn = document.querySelector("#toplam-maliyet");
const twoTableSection = document.querySelector("#two_table_section");
const totalTableSection = document.querySelector("#total_table_section");

totalTableBtn.addEventListener("click", () => {

    if (totalTableSection.style.display == "none") {
        twoTableSection.style.display = "none";
        getTotalTable();
        totalTableSection.style.display = "flex";
    } else {
        twoTableSection.style.display = "flex";
        totalTableSection.style.display = "none";
    }
})

function firstClickToCompany(elemet){
    const comps = document.querySelectorAll(".sidebar-links ul li")
    const linksArray = Array.from(comps);
    const lastElement = linksArray[0];
   
    if(elemet){        
        comps.forEach(item => {           
            if(item.textContent.trim() == elemet.trim()){
                getSupplierInfo(item.id)
            }
        });
    } else{
        getSupplierInfo(lastElement.id)
    }
} 
function getSupplierInfo(id) {
    var comps2 = document.querySelectorAll(".sidebar-links ul li")
    console.log(comps2);
    comps2.forEach(item => {
        item.classList.remove("activeComp");
        if(item.id == id){
            item.classList.add("activeComp");
        }
    });    
    twoTableSection.style.display = "flex";
    totalTableSection.style.display = "none";
    supplierId = id;
    getExpenses(id)
    getJobhistory(id)
    genelToplam()

}
async function genelToplam() {
    var genelTl = document.querySelector("#genel_tl")
    var genelUsd = document.querySelector("#genel_usd")
    var jobTlForCal = document.querySelector("#jobhistory_tl_td")
    var jobUsdForCal = document.querySelector("#jobhistory_usd_td")
    var expTlForCal = document.querySelector("#expenses_tl_td")
    var expUsdForCal = document.querySelector("#expenses_usd_td")
    await bekleme(50)
    genelTl.textContent = formatNumber((clearForCalc(expTlForCal.textContent) - clearForCalc(jobTlForCal.textContent)), 2) + " ₺";
    genelUsd.textContent = formatNumber((clearForCalc(expUsdForCal.textContent) - clearForCalc(jobUsdForCal.textContent)), 2) + " $";
}





const realizedCostCompnay = document.querySelector(".sidebar-links ul")
getCompany("asd");
async function getCompany(x) {
    try {
        //const response = await apiFunctions("supplier", "GET")

        const data = await apiFunctions("project", "GETID", "x", projectId)
        var supplierList = {};

        data.project_expenses.forEach(function (obj) {
            var supplierName = obj.supplier_expenses.CompanyName_Supplier;
            if (!supplierList.hasOwnProperty(supplierName)) {
                supplierList[supplierName] = { id: obj.supplier_expenses.id, name: obj.supplier_expenses.CompanyName_Supplier };
            }
        });
        data.project_jobhistories.forEach(function (obj) {
            var supplierName = obj.supplier_jobhistories.CompanyName_Supplier;
            if (!supplierList.hasOwnProperty(supplierName)) {
                supplierList[supplierName] = { id: obj.supplier_jobhistories.id, name: obj.supplier_jobhistories.CompanyName_Supplier };
            }
        });
        realizedCostCompnay.innerHTML = "";
        for (var key in supplierList) {
            let li =
                `<li onclick="getSupplierInfo(this.id)" class="tooltip-element" data-tooltip="0" id="${supplierList[key].id}">
            <a href="#" class="active" data-active="0">
                <span class="link hide-for-menu">${supplierList[key].name}</span>
            </a>
        </li>`;
            realizedCostCompnay.insertAdjacentHTML("beforeend", li);
        }       
        if(x){
            firstClickToCompany();
        } 
    } catch (error) {
        console.error("Error fetching and rendering projects:", error);
    }
}



//                  EXPENSES EDİT FUNCTİON

let expensesBtnID = -1;
function expensesEditButtonsEvents() {
    let editButtons = document.querySelectorAll(".edit-expenses-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(async () => {
                expensesEditMode = true;
                expensesBtnID = button.id;
                const data = await apiFunctions("expense", "GETID", "x", expensesBtnID)
                console.log(data)
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var element = document.querySelector('input[name="' + key + '"]');
                        var selectElement = document.querySelector('select[name="' + key + '"]');
                        if (element) {
                            console.log(key)
                            console.log(data[key])
                            //let projectNameForEdit = document.querySelector("#id_ProjectName");
                            //projectNameForEdit.setAttribute('data-id', btnID);
                            if (key == "CompanyName_Paying_Expenses") {
                                element.value = data["supplier_expenses"].CompanyName_Supplier;
                                element.setAttribute('data-id', data[key]);
                            } else {
                                element.value = data[key];
                            }
                        } else if (selectElement) {
                            selectElement.value = data[key];
                        }
                    }
                }
                getSuppliers();
                onPageLoads(formatedInputs);
                formatDateInputsForLoad(dateInputs);
                expensesAddWindow.style.display = "flex";
            }, 10);
        })
    });
}

//                  JOBHİSTORY EDİT FUNCTİON

let jobHistoryBtnID = -1;
function jobHistoryEditButtonsEvents() {
    let editButtons = document.querySelectorAll(".edit-jobhistory-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            setTimeout(async () => {
                jobHistoryEditMode = true;
                jobHistoryBtnID = button.id;
                const data = await apiFunctions("job_history", "GETID", "x", jobHistoryBtnID)
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var element = document.querySelector('input[name="' + key + '"]');
                        var selectElement = document.querySelector('select[name="' + key + '"]');
                        if (element) {
                            console.log(key)
                            console.log(data[key])
                            //let projectNameForEdit = document.querySelector("#id_ProjectName");
                            //projectNameForEdit.setAttribute('data-id', btnID);
                            if (key == "CompanyName_Job_JobHistory") {
                                element.value = data["supplier_jobhistories"].CompanyName_Supplier;
                                element.setAttribute('data-id', data[key]);
                            } else {
                                element.value = data[key];
                            }
                        } else if (selectElement) {
                            selectElement.value = data[key];
                        }
                    }
                }
                getSuppliers()
                onPageLoads(formatedInputs)
                formatDateInputsForLoad(dateInputs)
                jobhistoryAddWindow.style.display = "flex";
            }, 10);
        })
    });
}

// RESPONSİVE KODLAR
const mediaQuery = window.matchMedia("(max-width: 767px)");
function checkWindowSize() {
  if (window.innerWidth > 767) {
    leftMenu.style.display = "block";
  } else {
    leftMenu.style.display = "none";
  }
}
window.addEventListener("load", checkWindowSize);
window.addEventListener("resize", checkWindowSize);

//left menü acma kapatma
const leftMenu = document.querySelector(".left-menu");

const hamburgerBtn = document.querySelector(".hamburger-button");
hamburgerBtn.addEventListener("click", () => {
  setTimeout(async () => { leftMenu.style.display = "block";}, 20)
 
});

document.addEventListener("click", (event) => {
  const leftMenuNav = document.querySelector(
    ".left-menu"
  );
  if (window.innerWidth <= 767 && !leftMenuNav.contains(event.target)) {
    leftMenu.style.display = "none";
  }
});

// responsive tablolar arası geçiş


const botTable = document.querySelector(".bot-table")
const topTable = document.querySelector(".top-table")
const botTablebtn = document.querySelector(".expenses-add-btn")
const topTablebtn = document.querySelector(".jobhistory-add-btn")
const expensesTableBtn = document.getElementById("expenses-table-btn")

expensesTableBtn.addEventListener("click", ()=>{
    botTable.style.display = "flex";
    topTable.style.display = "none";
    botTablebtn.style.display = "block";
    topTablebtn.style.display = "none";
})

const jobhistoryTableBtn = document.getElementById("jobhistory-table-btn")

jobhistoryTableBtn.addEventListener("click", ()=>{
    botTable.style.display = "none";
    topTable.style.display = "flex";
    botTablebtn.style.display = "none";
    topTablebtn.style.display = "block";
})

