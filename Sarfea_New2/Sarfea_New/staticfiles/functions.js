var icon = document.querySelector(".icon");
var clearButton = document.querySelector(".clear");

//                  GENEL FUNCTİON
function openFile(url) {
  window.open(url, "_blank");
}
function bekleme(milisaniye) {
  return new Promise(resolve => {
    setTimeout(resolve, milisaniye);
  });
}


function clear(value) {
  if (value != undefined) {
    var cleanString = value.replace(/[^0-9,]/g, "");
    return cleanString;
  } else {
    var cleanString = 0;
    return cleanString;
  }
}
function clearForSubmit(value) {
  if (value != undefined) {
    var cleanString = value.replace(/[^0-9,]/g, "").replace(/,/g, ".");
    return cleanString;
  } else {
    var cleanString = 0;
    return cleanString;
  }
}
function clear2(value) {
  if (value != undefined) {
    var cleanString = value.replace(/[^0-9,]/g, "").replace(/,/g, ".");
    return cleanString;
  } else {
    var cleanString = 0;
    return cleanString;
  }
}
function clearForCalc(value) {
  if (value != undefined && value != null && value != NaN) {
    var numString = value.replace(/\./g, "").replace(",", ".");
    var num = parseFloat(numString);
    return num;
  } else {
    var cleanString = 0;
    return cleanString;
  }
}

//                  FORMAT NUMBERS

function formatNumber(number, fract) {
  var value = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fract,
    maximumFractionDigits: fract,
  }).format(number);
  return value.replace(/\./g, "a").replace(/,/g, ".").replace(/a/g, ",");
}
function format(number) {
  var indexOfDot = number.indexOf(",");
  if (indexOfDot !== -1) {
    var integerPart = number
      .slice(0, indexOfDot)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var decimalPart = number.slice(indexOfDot + 1);
    return integerPart + "," + decimalPart;
  } else {
    var formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
  }
}
function formatDateForTable(datex) {
  let formattedDate;
  if (datex) {
    let date = new Date(datex);
    formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
    return formattedDate;
  } else {
    formattedDate = "-";
    return formattedDate;
  }
}

//                  SPAN FORMATLAMA

function formatSpans(span, type) {
  switch (type) {
    case "kWe":
      var value = parseFloat(clear2(span.textContent));
      if (!isNaN(parseFloat(value))) {
        span.textContent = formatNumber(value, 0) + " kWe";
        span.title = formatNumber(value, 0) + " kWe";
      } else {
        span.textContent = "0 kWe";
        span.title = "0 kWe";
      }
      break;
    case "kWp":
      var value = parseFloat(clear2(span.textContent));
      if (!isNaN(parseFloat(value))) {
        span.textContent = formatNumber(value, 0) + " kWp";
        span.title = formatNumber(value, 0) + " kWp";
      } else {
        span.textContent = "0 kWp";
        span.title = "0 kWp";
      }
      break;
    case "usd":
      var value = parseFloat(clear2(span.textContent));
      if (!isNaN(parseFloat(value))) {
        span.textContent = formatNumber(value, 2) + " $";
        span.title = formatNumber(value, 2) + " $";
      } else {
        span.textContent = "0 $";
        span.title = "0 $";
      }
      break;
    case "text":
      break;
    case "numeric":
      var value = parseFloat(clear2(span.textContent));
      if (!isNaN(parseFloat(value))) {
        span.textContent = formatNumber(value, 2);
        span.title = formatNumber(value, 2);
      } else {
        span.textContent = "0";
        span.title = "0";
      }
      break;

    default:
  }
}

//                  TABLE FORMAT

function tableFormat(cells, type) {
  switch (type) {
    case "usd":
      cells.forEach(function (cell) {
        //var value = parseFloat(cell.textContent.replace(/,/g, "."));
        var value = parseFloat(cell.textContent);
        if (!isNaN(parseFloat(value))) {
          cell.textContent = formatNumber(value, 2) + "$";
          cell.title = formatNumber(value, 2) + "$";
        } else {
          cell.textContent = "0.00$";
          cell.title = "0.00$";
        }
      });
      break;
    case "tl":
      cells.forEach(function (cell) {
        // var value = parseFloat(cell.textContent.replace(/,/g, "."));
        var value = parseFloat(cell.textContent);
        if (!isNaN(parseFloat(value))) {
          cell.textContent = formatNumber(value, 2) + "₺";
          cell.title = formatNumber(value, 2) + "₺";
        } else {
          cell.textContent = "0.00₺";
          cell.title = "0.00₺";
        }
      });
      break;
    case "kur":
      cells.forEach(function (cell) {
        var value = parseFloat(cell.textContent);
        console.log(value)
        if (!isNaN(parseFloat(value))) {
          cell.textContent = formatNumber(value, 4) + "₺";
          cell.title = formatNumber(value, 4) + "₺";
        } else {
          cell.textContent = "0.00₺";
          cell.title = "0.00₺";
        }
      });
      break;
    case "text":
      cells.forEach(function (cell) {
        if (
          cell.textContent.trim() == "None" ||
          cell.textContent.trim() == "" ||
          cell.textContent.trim() == "null" ||
          cell.textContent.trim() == "NaN"
        ) {
          cell.textContent = "-";
        }
      });
      break;
    case "numeric":
      cells.forEach(function (cell) {
        var value = parseFloat(cell.textContent);
        if (!isNaN(parseFloat(value))) {
          cell.textContent = formatNumber(value, 0);
          cell.title = formatNumber(value, 0);
        } else {
          cell.textContent = "0";
          cell.title = "0";
        }
      });
      break;

    default:
  }
}

//                  SIRALAMA İŞLEMLERİ

const search = document.querySelector(".searchForNav input");
if (search) { search.addEventListener("input", searchTable); }


// SEARCHİNG
function searchTable() {
  const table_rows = document.querySelectorAll("tbody tr");
  table_rows.forEach((row, i) => {
    let table_data = row.textContent.toLowerCase(),
      search_data = search.value.toLowerCase();
    row.classList.toggle("hide", table_data.indexOf(search_data) < 0);
    row.style.setProperty("--delay", i / 25 + "s");
  });
  document.querySelectorAll("tbody tr:not(.hide)").forEach((visible_row, i) => {
    visible_row.style.backgroundColor =
      i % 2 == 0 ? "transparent" : "#0000000b";
  });
}
// SORTİNG
function sortingTable(table) {
  const table_headings = table.querySelectorAll("thead th");
  const table_rows = table.querySelectorAll("tbody tr");
  const tableBody = table.querySelector("tbody");
  table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
      table_headings.forEach((head) => head.classList.remove("active"));
      head.classList.add("active");
      table
        .querySelectorAll("td")
        .forEach((td) => td.classList.remove("active"));
      table_rows.forEach((row) => {
        row.querySelectorAll("td")[i].classList.add("active");
      });

      head.classList.toggle("asc", sort_asc);
      sort_asc = head.classList.contains("asc") ? false : true;

      sortTable(i, sort_asc, table_rows, tableBody);
    };
  });
}
function sortTable(column, sort_asc, table_rows, tableBody) {
  [...table_rows]
    .sort((a, b) => {
      let first_row = a
        .querySelectorAll("td")
      [column].textContent.toLowerCase(),
        second_row = b.querySelectorAll("td")[column].textContent.toLowerCase();
      let first_number = first_row
        .replace(/\./g, "")
        .replace("$", "")
        .replace("₺", "")
        .replace(",", ".");
      let second_number = second_row
        .replace(/\./g, "")
        .replace("$", "")
        .replace("₺", "")
        .replace(",", ".");

      // const datePattern = /^\d{1,2} [a-zA-Z]+ \d{4}$/;
      const datePattern =
        /^(0?[1-9]|[12][0-9]|3[01])\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s+\d{4}$/;

      if (datePattern.test(first_row) && datePattern.test(second_row)) {
        return sort_asc
          ? compareDates(second_row, first_row)
          : compareDates(first_row, second_row);
      }
      if (
        !isNaN(parseFloat(first_number)) &&
        !isNaN(parseFloat(second_number))
      ) {
        first_number = parseFloat(first_number);
        second_number = parseFloat(second_number);
        return sort_asc
          ? first_number < second_number
            ? 1
            : -1
          : first_number < second_number
            ? -1
            : 1;
      } else {
        return sort_asc
          ? first_row < second_row
            ? 1
            : -1
          : first_row < second_row
            ? -1
            : 1;
      }
    })
    .map((sorted_row) => tableBody.appendChild(sorted_row));
}
function sortTableForStart(table, columnIndex) {
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll("td")[columnIndex].textContent.trim();
    const cellB = rowB.querySelectorAll("td")[columnIndex].textContent.trim();
    return cellA.localeCompare(cellB);
  });

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  rows.forEach((row) => {
    tbody.appendChild(row);
  });
}
function compareDates(date1, date2) {
  const months = {
    ocak: 0,
    şubat: 1,
    mart: 2,
    nisan: 3,
    mayıs: 4,
    haziran: 5,
    temmuz: 6,
    ağustos: 7,
    eylül: 8,
    ekim: 9,
    kasım: 10,
    aralık: 11,
  };

  const [day1, month1, year1] = date1.split(" ");
  const [day2, month2, year2] = date2.split(" ");

  const d1 = new Date(year1, months[month1], day1);
  const d2 = new Date(year2, months[month2], day2);
  console.log(year1, months[month1], day1);
  console.log(year2, months[month2], day2);
  if (d1 > d2) {
    return 1;
  } else if (d1 < d2) {
    return -1;
  } else {
    return 1;
  }
}

//                  TABLO SEARCH İŞLEMLERİ

// function filterTable(searchInput, table) {
//   var filter = searchInput.value.toLowerCase();
//   var rows = table.getElementsByTagName("tr");

//   for (var i = 0; i < rows.length; i++) {
//     var row = rows[i];

//     if (!row.querySelector("th")) {
//       var cells = row.getElementsByTagName("td");
//       var shouldShow = false;

//       for (var j = 0; j < cells.length; j++) {
//         var cell = cells[j];

//         if (cell) {
//           var text = cell.textContent || cell.innerText;

//           if (text.toLowerCase().indexOf(filter) > -1) {
//             shouldShow = true;
//             break;
//           }
//         }
//       }

//       if (shouldShow) {
//         row.style.display = "";
//       } else {
//         row.style.display = "none";
//       }
//     }
//   }
// }
// function showAllRows(table) {
//   var rows = table.getElementsByTagName("tr");
//   for (var i = 0; i < rows.length; i++) {
//     rows[i].style.display = "";
//   }
// }

//                  ZORUNLU İNPUT BİLDİRİMLERİ

function requiredInputs(inputs, labels) {
  var value = 0;
  inputs.forEach(function (input, index) {
    if (input.value == "") {
      labels[index].style.color = "red";
      labels[index].style.fontWeight = "600";
    } else {
      labels[index].style.color = "black";
      labels[index].style.fontWeight = "500";
      value += 1;
    }
  });
  if (value == inputs.length) {
    return true;
  } else {
    return false;
  }
}
async function supplierNameControl(input, label, currentSupplier) {
  var data = await apiFunctions("supplier", "GET");
  let exClient = input.value.trim().toLowerCase();
  let bool = true;
 
    for (var supplier of data) {
      if (currentSupplier != supplier.CompanyName_Supplier) {
      let reClient = supplier.CompanyName_Supplier.trim().toLowerCase();
      if (reClient == exClient) {
        label.style.color = "red";
        label.style.fontWeight = "600";
        bool = false;
        break;
      } else {
        label.style.color = "black";
        label.style.fontWeight = "500";
      }
    }
  }
  return bool;
}
async function clientNameControl(input, label, currentClient) {
  var data = await apiFunctions("client", "GET");
  let exClient = input.value.trim().toLowerCase();
  let bool = true;

  for (var supplier of data) {
    if (currentClient != supplier.CompanyName_Clients) {
        let reClient = supplier.CompanyName_Clients.trim().toLowerCase();
        if (reClient == exClient) {
          label.style.color = "red";
          label.style.fontWeight = "600";
          bool = false;
          break;
        } else {
          label.style.color = "black";
          label.style.fontWeight = "500";
        }
    }    
  }
  return bool;
}
async function projectNameControl(input, label, currentProject) {
  var data = await apiFunctions("project", "GET");
  let exClient = input.value.trim().toLowerCase();
  let bool = true;  
    for (var supplier of data) {
      if (currentProject != supplier.ProjectName) {
      let reClient = supplier.ProjectName.trim().toLowerCase();
      if (reClient == exClient) {
        label.style.color = "red";
        label.style.fontWeight = "600";
        bool = false;
        break;
      } else {
        label.style.color = "black";
        label.style.fontWeight = "500";
      }
    }
  }
  return bool;
}
async function clearInputAfterSave(form) {
  //let inputs = form.querySelectorAll("input:not([type='button']");
  var inputs = form.querySelectorAll("input:not([type='button']):not(.not_this)");
  inputs.forEach((input) => {
    input.value = "";
  });
}


function controlSelectionInputsReverse(input, label, ddmenu) {
  var optionCount = 0;
  ddmenu.forEach(function (option) {
    if (input.value.trim() == option.textContent.trim()) {
      optionCount += 1;
    }
  });
  if (optionCount == 0) {
    label.style.color = "black";
    label.style.fontWeight = "500";
    return true;
  } else {
    label.style.color = "red";
    label.style.fontWeight = "600";
    return false;
  }
}

//                  INPUTLARI FORMATLAMA

function inputForFormat(input) {
  input.addEventListener("input", function (event) {
    var inputValue = event.target.value;
    var clearValue = clear(inputValue);
    var formatValue = format(clearValue);
    input.value = formatValue;
  });
}
function inputsForFormat(inputs) {
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      var inputValue = event.target.value;
      var clearValue = clear(inputValue);
      var formatValue = format(clearValue);
      input.value = formatValue;
    });
  });
}
function onPageLoad(input) {
  var inputValue = parseFloat(input.value);
  if (!isNaN(inputValue)) {
    var formatValue = formatNumber(inputValue, 2);
    input.value = formatValue;
    deger = formatValue;
  } else {
    input.value = "0";
  }
}
function onPageLoads(inputs) {
  inputs.forEach(input => {
    var inputValue = parseFloat(input.value);
    if (!isNaN(inputValue)) {
      var formatValue = formatNumber(inputValue, 2);
      input.value = formatValue;
      deger = formatValue;
    } else {
      input.value = "0";
    }
  })
}

//                  FİRMA ADLARI KONTROLÜ

function firmaCount(firmalar, input) {
  var firmaCount = 0;
  firmalar.forEach(function (firma) {
    if (input.value.trim() == firma.textContent.trim()) {
      firmaCount += 1;
    }
  });
  return firmaCount;
}

//                  TELEFON NUMARASI FORMATLAMA

function formatPhoneNumberByCountryCode(phoneNumber, countryCode) {
  var cleaned = phoneNumber.replace(/[^\d+]/g, "");
  var formatted = cleaned;

  switch (countryCode) {
    case "+90": // Türkiye
      phoneNumber.maxLength = 15;
      if (formatted.length < 4) return formatted;
      if (formatted.length < 7) {
        return `(${formatted.slice(0, 3)}) ${formatted.slice(3)}`;
      }
      if (formatted.length < 7) {
        return `(${formatted.slice(0, 3)}) ${formatted.slice(3)}`;
      }
      if (formatted.length < 9) {
        return `(${formatted.slice(0, 3)}) ${formatted.slice(
          3,
          6
        )} ${formatted.slice(6)}`;
      }
      if (formatted.length < 11) {
        return `(${formatted.slice(0, 3)}) ${formatted.slice(
          3,
          6
        )} ${formatted.slice(6, 8)} ${formatted.slice(8)}`;
      }
      break;
    default:
      break;
  }
}

//                  SEARCH İNPUT

if (icon && search) {
  icon.onclick = function () {
    search.classList.toggle("active");
  };
  function clearSearch() {
    const input = document.getElementById("mysearch");
    input.value = "";
  }
}

//                  12 ocak 2023 FORMATINDAKİ TARİHLERİ SIRALAMA

function parseCardDate(dateString) {
  if (dateString == "-") {
    return null;
  }
  var months = {
    Ocak: 0,
    Şubat: 1,
    Mart: 2,
    Nisan: 3,
    Mayıs: 4,
    Haziran: 5,
    Temmuz: 6,
    Ağustos: 7,
    Eylül: 8,
    Ekim: 9,
    Kasım: 10,
    Aralık: 11,
  };
  var dateParts = dateString.split(" ");
  var day = parseInt(dateParts[0]);
  var month = months[dateParts[1]];
  var year = parseInt(dateParts[2]);

  return new Date(year, month, day);
}

//                  GET MONTH NAME
function getMonthName(monthIndex) {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  return months[monthIndex];
}

//                  GÜN KONTROLÜ İÇİN TARİH FORMATLAMA
function dateFormatForColor(tableRows, colIndex) {
  var today = new Date();
  tableRows.forEach(function (row) {
    var tableDate = row.querySelector(`td:nth-child(${colIndex})`).textContent;
    var dateForColor = row.querySelector("td:nth-child(7) span");
    var dateParts = tableDate.split(" ");
    var day = parseInt(dateParts[0]);
    var month = dateParts[1];
    var year = parseInt(dateParts[2]);
    console.log(tableDate);
    var tableDateObj = new Date(year, monthIndex(month), day);

    var diffTime = Math.abs(tableDateObj - today);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (today === tableDateObj || today > tableDateObj) {
      dateForColor.classList.add("timeIsUp");
    } else if (diffDays <= 7 && today < tableDateObj) {
      dateForColor.classList.add("oneWeek");
    } else if (diffDays <= 15 && today < tableDateObj) {
      dateForColor.classList.add("twoWeek");
    }
  });
}
function dateFormatForColor1(dateForColor) {
  var today = new Date();  
    //var tableDate = dateForColor.textContent;
    var dateParts = dateForColor.split(" ");
    var day = parseInt(dateParts[0]);
    var month = dateParts[1];
    var year = parseInt(dateParts[2]);
    //console.log(tableDate);
    var tableDateObj = new Date(year, monthIndex(month), day);

    var diffTime = Math.abs(tableDateObj - today);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (today === tableDateObj || today > tableDateObj) {
      return "timeIsUp"
    } else if (diffDays <= 7 && today < tableDateObj) {
      return "oneWeek"
    } else if (diffDays <= 15 && today < tableDateObj) {
      return "twoWeek"
    }
}
function monthIndex(month) {
  var months = {
    Ocak: 0,
    Şubat: 1,
    Mart: 2,
    Nisan: 3,
    Mayıs: 4,
    Haziran: 5,
    Temmuz: 6,
    Ağustos: 7,
    Eylül: 8,
    Ekim: 9,
    Kasım: 10,
    Aralık: 11,
  };
  return months[month];
}

function takeCurrentDay() {
  var bugun = new Date();
  var gun = bugun.getDate();
  var ay = bugun.getMonth() + 1;
  var yil = bugun.getFullYear();

  if (gun < 10) {
    gun = "0" + gun;
  }
  if (ay < 10) {
    ay = "0" + ay;
  }
  var bugununTarihi = yil + "-" + ay + "-" + gun;
  return bugununTarihi;
}

//                  CARDLARI TARİHE GÖRE SIRALAMA

function cardDateList(rows) {
  rows.forEach(function (row) {
    var cards = row.querySelectorAll(".card");
    var sortedCards = Array.from(cards).sort(function (a, b) {
      var dateA = parseCardDate(a.querySelector("p:nth-child(2)").textContent);
      var dateB = parseCardDate(b.querySelector("p:nth-child(2)").textContent);

      if (dateA === null && dateB !== null) {
        return 1;
      } else if (dateA !== null && dateB === null) {
        return -1;
      }

      return dateA - dateB;
    });
    for (var i = 0; i < sortedCards.length; i++) {
      row.appendChild(sortedCards[i]);
    }
  });
}

//                  TARİH FORMATLAMA
function formatDateInputs(inputs) {
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      var userInput = input.value;
      if (event.inputType !== "deleteContentBackward") {
        input.value = formatDate(userInput);
      }
    });
  })
}
function formatDateInputsForLoad(inputs) {
  inputs.forEach(input => {
    let userInput = tarihFormatReverse(input.value)
    input.value = formatDate(userInput);
  })
}
function tarihFormatReverse(date) {
  var datePiece = date.split("-");
  var newDate = datePiece[2] + datePiece[1] + datePiece[0];
  return newDate;
}
function formatDate(date) {
  var cleaned = date.replace(/[^\d+]/g, "");
  var formatted = cleaned;
  var day = "31";
  var month = "12";
  var year = "2999";

  if (formatted.length < 3) {
    if (formatted < day) {
      return formatted;
    } else {
      return "31";
    }
  }
  if (formatted.length < 5) {
    if (formatted.slice(2) < month) {
      return `${formatted.slice(0, 2)}.${formatted.slice(2)}`;
    } else {
      return `${formatted.slice(0, 2)}.12`;
    }
  }
  if (formatted.length < 10) {
    if (formatted.slice(4) < year) {
      return `${formatted.slice(0, 2)}.${formatted.slice(
        2,
        4
      )}.${formatted.slice(4)}`;
    } else {
      return `${formatted.slice(0, 2)}.${formatted.slice(2, 4)}.2999`;
    }
  }
}
function formatDateForSubmit(date) {
  if (date.length == 10) {
    var splits = date.split(".");
    //console.log(splits)
    var gun = splits[0];
    var ay = splits[1];
    var yil = splits[2];

    var newFormat = yil + "-" + ay + "-" + gun;

    return newFormat;
  } else {
    return "";
  }
}
function convertDateFormat(tarih) {
  var date = tarih.split(".");
  date = `${date[1]}.${date[0]}.${date[2]}`;
  return date;
}

//                 DOLAR KURU İÇİN TARİH ÇEKME

function tarihFormatiniDegistir(tarih) {
  tarih = convertDateFormat(tarih);
  const dateObj = new Date(tarih);
  dateObj.setDate(dateObj.getDate() + 1);
  if (isWeekend(dateObj)) {
    dateObj.setDate(dateObj.getDate() + 1);
  }
  while (isWeekend(dateObj)) {
    dateObj.setDate(dateObj.getDate() + 1);
  }
  const yil = dateObj.getFullYear();
  const ay = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const gun = dateObj.getDate().toString().padStart(2, "0");
  const yeniFormatliTarih = gun + "-" + ay + "-" + yil;
  return yeniFormatliTarih;
}
function birGunOncekiTarih(dateString) {
  dateString = convertDateFormat(dateString);
  const dateObj = new Date(dateString);
  dateObj.setDate(dateObj.getDate());
  while (isWeekend(dateObj)) {
    dateObj.setDate(dateObj.getDate() + 1);
  }
  const yil = dateObj.getFullYear();
  const ay = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const gun = dateObj.getDate().toString().padStart(2, "0");
  const yeniFormatliTarih = gun + "-" + ay + "-" + yil;
  return yeniFormatliTarih;
}
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}
function dateInputFormat(input) {
  let tarih = input.value;
  if (tarih.length == 10) {
    var parcalar = tarih.split("-");

    var yil = parcalar[0];
    var ay = parcalar[1];
    var gun = parcalar[2];

    var yeniFormat = gun + "." + ay + "." + yil;

    input.value = yeniFormat;
  } else {
    input.value = "";
  }
}

//            ***** DOM EVENTS *****

document.addEventListener("DOMContentLoaded", async function () {




});
//                  DROPDOWN İNPUTS
function dropdownActive() {
  var dropdownInputs = document.querySelectorAll(".myInput");
  if (dropdownInputs) {
    dropdownInputs.forEach((input) => {
      const dropdownId = input.getAttribute("data-dropdown");
      const dropdown = document.getElementById(dropdownId);
      const dropBox = input.parentElement;
      const dropdownItems = dropdown.querySelectorAll(".dropdown-item");

      input.addEventListener("focus", function () {
        setTimeout(() => {
          dropdown.classList.add("show");
        }, 10);
      });

      document.addEventListener("click", function (event) {
        var isClickInput = dropBox.contains(event.target);
        if (dropdown.classList.contains("show")) {
          if (!isClickInput) {
            setTimeout(() => {
              input.value = "";
              dropdownItems.forEach((item) => {
                item.style.display = "block";
              });
              dropdown.classList.remove("show");
            }, 1);
          }
        }
      });

      input.addEventListener("input", function () {
        const filterText = input.value.toLowerCase();

        dropdownItems.forEach((item) => {
          const itemText = item.textContent.toLowerCase();
          if (itemText.startsWith(filterText)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });

      dropdownItems.forEach((item) => {

        item.addEventListener("click", function () {
          if (input.classList.contains('need_id')) {
            input.setAttribute('data-id', this.getAttribute('value'));
          }
          input.value = this.textContent;

          //input.setAttribute('data-id', `${}`);
          dropdown.classList.remove("show");
        });
      });
    });
  }
}

/***********************************************************
#                       APİ FUNCTİONS
***********************************************************/
async function apiFunctions(name, type, myForm, id) {

  switch (type) {
    case "GET":
      try {
        const response = await fetch(`/api_${name}/`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("There was an error!", error);
      }
      break;

    case "GETID":
      try {
        const response = await fetch(`/api_${name}/${id}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("There was an error!", error);
      }
      break;

    case "POST":
      try {
        await fetch(`/api_${name}/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: myForm,
        });
      } catch (error) {
        console.error("There was an error!", error);
      }
      break;

    case "PUT":
      try {
        //const formData = new FormData(myForm);
        //console.log(`/api_${name}/${id}`)
        await fetch(`/api_${name}/${id}`, {
          method: "PUT",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: myForm,
        });

      } catch (error) {
        console.error("There was an error!", error);
      }
      break;
    default:


  }

}

//  DOLAR KURU
async function getUSDKur(date) {
  try {
    const response = await fetch(`/get_dollar_rate/${date}/`);
    const data = await response.json();
    return data.rate.toString();
  } catch (error) {
    return "0";
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}