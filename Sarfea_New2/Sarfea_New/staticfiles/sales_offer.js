const rowsElements = document.querySelectorAll(
  '.rows[data-situation="Potansiyel Müşteri"] .card-body , .rows[data-situation="Maliyet Hesaplama"] .card-body, .rows[data-situation="Fiyat Belirleme"] .card-body, .rows[data-situation="Teklif Hazırlama"] .card-body, .rows[data-situation="Teklif Hazır"] .card-body, .rows[data-situation="Teklif Sunuldu"] .card-body, .rows[data-situation="Sunum Sonrası Görüşme"] .card-body'
);
const listTable = document.querySelector("#list_table");
const lostTable = document.querySelector("#lost_table");
const salesTable = document.querySelector("#sales_table");
const wonTable = document.querySelector("#won_table");

const topMenuLi = document.querySelectorAll(".top-menu-ul li");
const rows = document.querySelectorAll(".rows");
const details = document.querySelector(".details");
const detailsSpan = document.querySelector("#details_span");
const fileBox = document.querySelector(".file_upload");
const maniContainer = document.querySelector(".main-container");
const listContainer = document.querySelector(".list-container");
const lostJobContainer = document.querySelector(".lost-job-container");
const salesContainer = document.querySelector(".sales-container");
const wonContainer = document.querySelector(".won-container");
const clientAddWindow = document.querySelector(".client-add-window");

const reqSalesInputs = document.querySelectorAll("#id_Client_Card, #id_Person_Deal, #id_Location_Card");
const reqSalesLabels = document.querySelectorAll("#firma_adi_span, #ilgilenen_kisi_span, #konum_span");

var editMode = false;



document.addEventListener("DOMContentLoaded", function () {
  //                  CARD NONE VERİLERİ DÜZELTME

  topMenuLi[2].classList.add("li-hover");

});


document.addEventListener("DOMContentLoaded", async () => {
  await getSalesCards();
  setInterval(async function () {
    //await getSalesCards();
  }, 5000);
});

//                 KARTLARI EKRANA YAZDIRMA
async function getSalesCards(isEdit) {
  try {
    let Rows = document.querySelectorAll(".card-body");
    const data = await apiFunctions("sales_offer", "GET");
    //console.log(data)
    Rows.forEach(row => {
      row.innerHTML = '';
    });

    for (const card of data) {
      if (!card.Is_Gain && !card.Is_Lost && !card.Is_late) {
        let cardHTML = generateCard(card);
        cardPlaceRows(cardHTML, card.Situation_Card)
      }
    }
    dragCards()
    totalSpanFormatForDrag()
    cardFormat();
    cardMenuFunctions()
    singleFİleUpload()
    editBtns()
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}
function cardPlaceRows(card, situation) {
  var row = document.querySelector(`[data-situation="${situation}"] .card-body `);
  if (row) {
    row.insertAdjacentHTML("beforeend", card)
  }

}
function generateCard(card) {
  let formattedDate;
  if (card.Date_Card) {
    let date = new Date(card.Date_Card);
    formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
  } else { formattedDate = "-" }
  return `
  <div id="${card.id}" class="card" draggable="true" data-situation="${card.Situation_Card}">
      <div class="boxes">
          <p class="bold700">${card.client.CompanyName_Clients}</p>
      </div>
      <p>${formattedDate}</p>
      <div class="boxes">
          <p>${card.Offer_Cost_NotIncludingKDV_Card}</p>
          <p>${card.UnitOffer_NotIncludingKDV} USD/kWp</p>
      </div>
      <div class="boxes">
          <p>${card.Cost_NotIncludingKDV_Card}</p>
          <p>${card.UnitCost_NotIncludingKDV}</p>
      </div>
      <div class="boxes">
          <p>5000kwp</p>
          <p>Çatı</p>
      </div>
      <div class="boxes">
          <div class="buttons">
              ${card.M_File_Card ? `<button class="mr-3 blue" onclick="openFile('${card.M_File_Card}')">M1</button>` : `<button class="mb mr-3">M1</button>`}
              ${card.M_File_Card_2 ? `<button class="mr-3 blue" onclick="openFile('${card.M_File_Card_2}')">M2</button>` : `<button class="mb mr-3">M2</button>`}
              ${card.M_File_Card_3 ? `<button class="mr-3 blue" onclick="openFile('${card.M_File_Card_3}')">M3</button>` : `<button class="mb mr-3">M3</button>`}
          </div>
          <div class="buttons">
              ${card.Offer_File_Card ? `<button class="mr-3 blue" onclick="openFile('${card.Offer_File_Card}')">T1</button>` : `<button class="mb mr-3">T1</button>`}
              ${card.Offer_File_Card_2 ? `<button class="mr-3 blue" onclick="openFile('${card.Offer_File_Card_2}')">T2</button>` : `<button class="mb mr-3">T2</button>`}
              ${card.Offer_File_Card_3 ? `<button class="mr-3 blue" onclick="openFile('${card.Offer_File_Card_3}')">T3</button>` : `<button class="mb mr-3">T3</button>`}
              ${card.Offer_File_Card_4 ? `<button class="mr-3 blue" onclick="openFile('${card.Offer_File_Card_4}')">T4</button>` : `<button class="mb mr-3">T4</button>`}
              ${card.Offer_File_Card_5 ? `<button class="mr-3 blue" onclick="openFile('${card.Offer_File_Card_5}')">T5</button>` : `<button class="mb mr-3">T5</button>`}
          </div>
      </div>
      <div class="flex-row">
          <p class="eclipse"><span class="bold500">Yorum: </span>${card.Offer_Comment_Card}</p>
      </div>
      <div class="card-menu">
          <i class="fa-solid fa-ellipsis card_menu-btn"></i>
          <ul class="card_menu">
              <li id="${card.id}" class = "card_edit_btn">Düzenle</li>
              <li onclick="lostCard(${card.id})">Kaybedildi</li>
              <li onclick="gainCard(${card.id})">Kazanıldı</li>
              <li onclick="waitCard(${card.id})">Bekleyen</li>
              <li onclick="reviseCard(${card.id})"><a href="{% url 'sales_offer_edit' sales_offer_id=card.id %}">Revize </a></li>
          </ul>
      </div>
  </div>
  `;
}

//                  TOP MENU FONKSİYONLARI
topMenuLi.forEach(function (item) {
  item.addEventListener("click", function () {
    var clickedItemId = this.id;
    handleMenuItemClick(clickedItemId);
  });
});
function handleMenuItemClick(clickedItemId) {
  switch (clickedItemId) {
    case "list":
      listContainer.style.display = "flex";
      maniContainer.style.display = "none";
      salesContainer.style.display = "none";
      lostJobContainer.style.display = "none";
      wonContainer.style.display = "none";
      getTotalList()
      break;
    case "sale_time":
      listContainer.style.display = "none";
      maniContainer.style.display = "flex";
      salesContainer.style.display = "none";
      lostJobContainer.style.display = "none";
      wonContainer.style.display = "none";
      break;
    case "waiting_job":
      listContainer.style.display = "none";
      maniContainer.style.display = "none";
      salesContainer.style.display = "flex";
      lostJobContainer.style.display = "none";
      wonContainer.style.display = "none";
      getSalesList()
      break;
    case "losing_job":
      listContainer.style.display = "none";
      maniContainer.style.display = "none";
      salesContainer.style.display = "none";
      lostJobContainer.style.display = "flex";
      wonContainer.style.display = "none";
      getLostList()
      break;
    case "won_job":
      listContainer.style.display = "none";
      maniContainer.style.display = "none";
      salesContainer.style.display = "none";
      lostJobContainer.style.display = "none";
      wonContainer.style.display = "flex";
      getWonList()
      break;
    default:
      break;
  }
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

//                  CARD DRAG İŞLEMLERİ
function dragCards() {

  var rowcards = document.querySelectorAll(".card");

  var dragItem = null;
  for (var i of rowcards) {
    i.addEventListener("dragstart", dragStart);
    i.addEventListener("dragend", dragEnd);
  }
  function dragStart() {
    dragItem = this;
    console.log(dragItem)
    setTimeout(() => (this.style.display = "none"), 0);
  }
  function dragEnd() {
    setTimeout(() => (this.style.display = "flex"), 0);

  }
  for (j of rowsElements) {
    j.addEventListener("dragover", dragOver);
    j.addEventListener("dragenter", dragEnter);
    j.addEventListener("dragleave", dragLeave);
    j.addEventListener("drop", Drop);
  }
  function Drop() {
    this.append(dragItem);
    cardDateList(rowsElements);
    totalSpanFormatForDrag();
    //getSalesCards()

    var targetRowSituation = this.parentElement.dataset.situation;
    var cardId = dragItem.id;
    var xhr = new XMLHttpRequest();
    var updateCardSituationUrl = "/update_card_situation/";

    xhr.open("POST", updateCardSituationUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        dragItem.dataset.situation = targetRowSituation;
      }
    };
    xhr.send(
      JSON.stringify({ card_id: cardId, new_situation: targetRowSituation })
    );
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
  }
  function dragLeave() {
  }
}

//              TAŞIMA SONRASI TOTAL SPANLARIN GÜNCELLENMESİ
function totalSpanFormatForDrag() {
  rows.forEach(function (row) {
    let cards = row.querySelectorAll(".card");
    let totalCashSpan = row.querySelector(".total-cash span:nth-child(1)");
    let customersCountSpan = row.querySelector(".total-cash span:nth-child(2)");
    let totalCash = 0;

    cards.forEach(function (card) {
      let totalMaliyet = card.querySelector(".boxes:nth-of-type(3) p:first-of-type");
      let totalMaliyetCount = parseFloat(clear(totalMaliyet.textContent)) || 0;
      totalCash += totalMaliyetCount;
    });
    totalCashSpan.textContent = "$" + formatNumber(totalCash, 2);
    customersCountSpan.textContent = `(${String(cards.length)})`;
  });
}

//                  CARD FORMATLAMA
function cardFormat() {
  rows.forEach(function (row) {
    let cards = row.querySelectorAll(".card");
    let totalCashSpan = row.querySelector(".total-cash span:nth-child(1)");
    let customersCountSpan = row.querySelector(".total-cash span:nth-child(2)");
    let totalCash = 0;

    cards.forEach(function (card) {
      let totalTeklif = card.querySelector(".boxes:nth-of-type(2) p:first-of-type");
      let unitTeklif = card.querySelector(".boxes:nth-of-type(2) p:nth-of-type(2)");
      let totalMaliyet = card.querySelector(".boxes:nth-of-type(3) p:first-of-type");
      let unitMaliyet = card.querySelector(".boxes:nth-of-type(3) p:nth-of-type(2)");
      let powerSpan = card.querySelector(".boxes:nth-of-type(4) p:nth-of-type(1)");
      let totalTeklifCount = parseFloat(totalTeklif.textContent.replace(/,/g, ".")) || 0;
      let unitTeklifCount = parseFloat(unitTeklif.textContent.replace(/,/g, ".")) || 0;
      let totalMaliyetCount = parseFloat(totalMaliyet.textContent.replace(/,/g, ".")) || 0;
      let unitMaliyetCount = parseFloat(unitMaliyet.textContent.replace(/,/g, ".")) || 0;
      let powerCount = parseFloat(powerSpan.textContent.replace(/,/g, ".")) || 0;

      totalTeklif.textContent = "$ " + formatNumber(totalTeklifCount, 2);
      unitTeklif.textContent = formatNumber(unitTeklifCount, 0) + " USD/kWp";
      totalMaliyet.textContent = "$ " + formatNumber(totalMaliyetCount, 2);
      unitMaliyet.textContent = formatNumber(unitMaliyetCount, 0) + " USD/kWp";
      powerSpan.textContent = formatNumber(powerCount, 0) + " kWp";

      totalCash += totalMaliyetCount;
    });

    totalCashSpan.textContent = "$" + formatNumber(totalCash, 2);
    customersCountSpan.textContent = `(${String(cards.length)})`;
  });
}

//                  CARD MENÜ
function cardMenuFunctions() {

  var cardMenuBtn = document.querySelectorAll(".card_menu-btn");
  let cardMenu;
  // let btn1;
  // var boolClick = false;
  cardMenuBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let card = this.closest(".card");
      cardMenu = card.querySelector(".card_menu");
      if (cardMenu.style.display == "none") {
        cardMenu.style.display = "block";
      }
      else {
        cardMenu.style.display = "none";
      }
    });
    document.addEventListener("click", function (event) {
      var isClickInsideDiv = btn.contains(event.target);
      let card = btn.closest(".card");
      let cardMenu1 = card.querySelector(".card_menu");
      if (!isClickInsideDiv) {
        cardMenu1.style.display = "none";
      }
    });
  });

}

//              TARİH İNPUTLARI FORMATLAMA
const dateInputs = document.querySelectorAll(".date-inputs");
formatDateInputs(dateInputs);

//              INPUT FORMATLAMA
const formatedInputs = document.querySelectorAll(".formatInputs");
inputsForFormat(formatedInputs);







//                  SİLME İŞLEMİ
const csrfCookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="));
const csrfToken = csrfCookie ? csrfCookie.split("=")[1] : null;
function deleteCard(cardId) {
  if (!csrfToken) {
    console.error("CSRF token bulunamadı.");
    return;
  }
  fetch(`AFM/delete_salesoffercard/${cardId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        location.reload();
        throw new Error("Silme işlemi başarısız");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Silme başarılı", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
}

//                  LOST İŞLEMLERİ  
function lostCard(cardId) {
  const csrftoken = getCookie("csrftoken");

  if (!csrftoken) {
    console.error("CSRF token bulunamadı.");
    return;
  }

  fetch(`AFM/set_card_lost/${cardId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kaybedildi işlemi başarısızz");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Kaybedildi işlemi başarılı", data);
      //location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
}
function reLostCard(cardId) {
  const csrftoken = getCookie("csrftoken");

  if (!csrftoken) {
    console.error("CSRF token bulunamadı.");
    return;
  }

  fetch(`AFM/set_card_relost/${cardId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kaybedildi işlemi başarısızz");
      }
      return response.json();
    })
    .then((data) => {
      console.log("00Kaybedildi işlemi başarılı", data);
      //location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
} function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

//                  GAİN İŞLEMLERİ  
function gainCard(cardId) {
  const csrftoken = getCookie("csrftoken");

  if (!csrftoken) {
    console.error("CSRF token bulunamadı.");
    return;
  }

  fetch(`AFM/set_card_gain/${cardId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kaybedildi işlemi başarısızz");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Kaybedildi işlemi başarılı", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
}
function reGainCard(cardId) {
  const csrftoken = getCookie("csrftoken");

  if (!csrftoken) {
    console.error("CSRF token bulunamadı.");
    return;
  }

  fetch(`AFM/set_card_regain/${cardId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kaybedildi işlemi başarısızz");
      }
      return response.json();
    })
    .then((data) => {
      console.log("00Kaybedildi işlemi başarılı", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
}

//                  WAİT İŞLEMLERİ  
function waitCard(cardId) {
  const csrftoken = getCookie("csrftoken");

  if (!csrftoken) {
    console.error("CSRF token bulunamadı.");
    return;
  }

  fetch(`AFM/set_card_wait/${cardId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kaybedildi işlemi başarısızz");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Kaybedildi işlemi başarılı", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
}
function reWaitCard(cardId) {
  const csrftoken = getCookie("csrftoken");

  if (!csrftoken) {
    console.error("CSRF token bulunamadı.");
    return;
  }

  fetch(`AFM/set_card_rewait/${cardId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kaybedildi işlemi başarısızz");
      }
      return response.json();
    })
    .then((data) => {
      console.log("00Kaybedildi işlemi başarılı", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
}

//                  DOSYA YENİ SEKME AÇMA  
function openFile(url) {
  window.open(url, "_blank");
}


/***********************************************************
  #                       EKLEME SAYFALARI FONKSİYONLARI
  ***********************************************************/

// YENİ SATIŞ EKLEME  
const salesOfferAddWindow = document.querySelector(".sales-offer-add-window");
const salesOfferAddBtn = document.querySelector(".project-add-btn");

salesOfferAddBtn.addEventListener("click", () => {
  setTimeout(() => {
    editMode = false;
    salesOfferAddWindow.style.display = "flex";
  }, 10);
});
document.addEventListener("mousedown", (event) => {
  const salesOfferAddContainer = document.querySelector(".sales-offer-add-window .container");
  if (!salesOfferAddContainer.contains(event.target) && clientAddWindow.style.display == "none") {
    salesOfferAddWindow.style.display = "none";
  }
});

// YENİ FİRMA EKLEME
const companyAddBtns = document.querySelectorAll(".paying-company-add-btn");

const companyX = clientAddWindow.querySelector(".close-window");
companyAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTimeout(() => {
      clientAddWindow.style.display = "flex";
    }, 20);
  });
  document.addEventListener("mousedown", (event) => {
    const clientAddContainer = clientAddWindow.querySelector(".container");
    if (!clientAddContainer.contains(event.target)) {
      setTimeout(() => {
        clientAddWindow.style.display = "none";
      }, 15);
    }
  });
});

// DOSYA YÜKLEME
function singleFİleUpload() {
  var mButtons = document.querySelectorAll(".mb");
  mButtons.forEach(function (item) {
    item.addEventListener("click", function () {
      cardId = this.closest(".card").id;

      switch (item.textContent) {
        case "M1":
          details.textContent = "Maliyet Dosyası";
          detailsSpan.textContent = "M1 Dosyası Seçiniz...";
          fileType = "M_File_Card";

          break;

        case "M2":
          details.textContent = "Maliyet Dosyası";
          detailsSpan.textContent = "M2 Dosyası Seçiniz...";
          fileType = "M_File_Card_2";

          break;

        case "M3":
          details.textContent = "Maliyet Dosyası";
          detailsSpan.textContent = "M3 Dosyası Seçiniz...";
          fileType = "M_File_Card_3";

          break;
        case "T1":
          details.textContent = "Teklif Dosyası";
          detailsSpan.textContent = "T1 Dosyası Seçiniz...";
          fileType = "Offer_File_Card";

          break;
        case "T2":
          details.textContent = "Teklif Dosyası";
          detailsSpan.textContent = "T2 Dosyası Seçiniz...";
          fileType = "Offer_File_Card_2";

          break;
        case "T3":
          details.textContent = "Teklif Dosyası";
          detailsSpan.textContent = "T3 Dosyası Seçiniz...";
          fileType = "Offer_File_Card_3";

          break;
        case "T4":
          details.textContent = "Teklif Dosyası";
          detailsSpan.textContent = "T4 Dosyası Seçiniz...";
          fileType = "Offer_File_Card_4";

          break;
        case "T5":
          details.textContent = "Teklif Dosyası";
          detailsSpan.textContent = "T5 Dosyası Seçiniz...";
          fileType = "Offer_File_Card_5";

          break;
        default:
          break;
      }
      fileBox.style.display = "block";
    });
  });
}
document.addEventListener("mousedown", (event) => {
  const fileAddContainer = document.querySelector(".file_upload_container .container");
  if (!fileAddContainer.contains(event.target)) {
    fileBox.style.display = "none";
  }
});
//                  DOSYA YÜKLEME İŞLEMLERİ
var cardId, fileType;

document.getElementById("id_file_up").addEventListener("change", function () {
  var fileName = this.value.split("\\").pop();
  document.getElementById("details_span").innerText = fileName + " seçildi";
});
document.getElementById("submit_btn").addEventListener("click", function (event) {
  event.preventDefault();
  uploadFile(cardId, fileType);

  setTimeout(function () {
    //document.querySelector("#file-form").submit();
    getSalesCards();
    fileBox.style.display = "none";
  }, 50);
});
function uploadFile(cardId, fileType) {
  var formData = new FormData();
  formData.append("file", document.getElementById("id_file_up").files[0]);
  formData.append("card_id", cardId);
  formData.append("file_type", fileType);

  fetch("/post_card_file/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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
  #                       FORM EKLEME İŞLEMLERİ
  ***********************************************************/

// SALES OFFER ADD
const addForm = document.getElementById("sales_offer_add_form");
const formAddBtn = document.querySelector("#sales-offer-create-btn");
formAddBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  if (requiredInputs(reqSalesInputs, reqSalesLabels)) {
    dateInputs.forEach(input => {
      input.value = formatDateForSubmit(input.value)
    })
    var formatInputss = salesOfferAddWindow.querySelectorAll(".formatInputs")
    formatInputss.forEach(input => {
      input.value = input.value.replace(/\./g, "").replace(/,/g, ".");
    })
    const formData = new FormData(addForm);

    const inputs = document.querySelectorAll(".sales-offer-add-window input[data-id]");
    inputs.forEach(input => {
      const dataId = input.getAttribute('data-id');
      formData.set(input.getAttribute('name'), dataId);
    });
    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    if (editMode == false) {
      await apiFunctions("sales_offer", "POST", formData);
    } else {
      await apiFunctions("sales_offer", "PUT", formData, btnID);
    }
    salesOfferAddWindow.style.display = "none";
    clearInputAfterSave(addForm);
    await getSalesCards();
    await getTotalList();
    await getLostList();
    await getSalesList();
    await getWonList();
  }
});

// FİRMA EKLEME
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
      }, 50);

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

//                  CARD TARİHE GÖRE SIRALAMA
cardDateList(rowsElements);



/***********************************************************
  #                       LİSTELERİ YAZDIRMA
  ***********************************************************/

getTotalList()
// TOTAL LİSTE
async function getTotalList() {
  try {
    const data = await apiFunctions("sales_offer", "GET");
    console.log(data)
    let rows = "";
    const listTableBody = listTable.querySelector("tbody");
    listTableBody.innerHTML = "";
    for (const card of data) {
      var row = document.createElement("tr");
      //row.id = card.id;
      row.setAttribute("data-id", card.id);

      if (card.Is_Gain) {
        row.classList.add("gain-job");
      } else if (card.Is_Lost) {
        row.classList.add("lost-job");
      } else if (card.Is_late) {
        row.classList.add("wait-job");
      } else {
        row.classList.add(getClassForSituation(card.Situation_Card));
      }

      row.innerHTML = `
          <td class="list_firt_tr"><a href="/sales_offer_revises/${card.id}/"><i class="fas fa-book"></i></a><span class="icon-blue"></span></td>
          <td>${card.Is_Gain ? 'Kazanılan İş' : (card.Is_Lost ? 'Kaybedilen İş' : (card.Is_late ? 'Bekleyen İş' : card.Situation_Card))}</td>
          <td>${card.client.CompanyName_Clients || "-"}</td>
          <td>${card.Location_Card || "-"}</td>
          <td>${card.Person_Deal || "-"}</td>
          <td>${formatNumber(card.AC_Power_Card, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.DC_Power_Card, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.UnitCost_NotIncludingKDV, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.Cost_NotIncludingKDV_Card, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.UnitOffer_NotIncludingKDV, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.Offer_Cost_NotIncludingKDV_Card, 2) + "₺" || 0 + "₺"}</td>
          <td>${card.Terrain_Roof_Card || "-"}</td>
          <td>${formatNumber(card.Roof_Cost_Card, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.Unit_Cost_with_Roof_Cost, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.Unit_Offer_with_Roof_Cost, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatNumber(card.Profit_Rate_Card, 2) + "₺" || 0 + "₺"}</td>
          <td>${formatDateForTable(card.Date_Card)}</td>
        `;

      listTableBody.appendChild(row);
    }
    listTablePaint();
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}
function getClassForSituation(situationCard) {
  switch (situationCard) {
    case 'Potansiyel Müşteri':
      return 'pot-mus';
    case 'Maliyet Hesaplama':
      return 'mal-hes';
    case 'Fiyat Belirleme':
      return 'fi-be';
    case 'Teklif Hazırlama':
      return 'tek-hazırlama';
    case 'Teklif Hazır':
      return 'tek-hazır';
    case 'Teklif Sunuldu':
      return 'tek-sunuldu';
    case 'Sunum Sonrası Görüşme':
      return 'sun-son-gor';
    default:
      return 'x';
  }
}
// LİSTE İŞ RENGİ VERME
function listTablePaint() {
  let trRowsList = listTable.querySelectorAll("tr");
  trRowsList.forEach((row) => {
    let span = row.querySelector(".icon-blue")
    switch (row.className) {
      case "gain-job":
        span.style.color = "#38b000"
        break;

      case "lost-job":
        span.style.color = "#bf0603"

        break;

      case "wait-job":
        span.style.color = "#00296b"

        break;
      case "pot-mus":
        span.style.color = "#D0DDFB"

        break;
      case "mal-hes":
        span.style.color = "#9DB8FB"

        break;
      case "fi-be":
        span.style.color = "#ece75f"

        break;
      case "tek-hazırlama":
        span.style.color = "#e5de00"

        break;
      case "tek-hazır":
        span.style.color = "#e6cc00"

        break;
      case "tek-sunuldu":
        span.style.color = "#e69b00"

        break;
      case "sun-son-gor":
        span.style.color = "#e47200"

        break;
      default:
        break;
    }
  });
}

// LOST LİST
getLostList()
async function getLostList() {
  try {
    //let currentRows = supplierTableBody.querySelectorAll("tr");
    const data = await apiFunctions("sales_offer", "GET");
    let rows = "";
    const lostTableBody = lostTable.querySelector("tbody");
    for (const card of data) {
      if (card.Is_Lost) {
        const row = `
                  <tr>
                      <td>
                        <a href="#" onclick="reLostCard(${card.id}); return false;">
                          <i class="fa-solid fa-rotate-left"></i>
                        </a>
                      </td>
                      <td>${card.client.CompanyName_Clients || "-"}</td>
                      <td>${card.Location_Card || "-"}</td>
                      <td>${card.Person_Deal || "-"}</td>
                      <td>${formatNumber(card.AC_Power_Card) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.DC_Power_Card) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.UnitCost_NotIncludingKDV) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.Cost_NotIncludingKDV_Card) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.UnitOffer_NotIncludingKDV) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.Offer_Cost_NotIncludingKDV_Card) + "₺" || 0 + "₺"}</td>
                      <td>${card.Terrain_Roof_Card || "-"}</td>
                      <td>${formatNumber(card.Roof_Cost_Card) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.Unit_Cost_with_Roof_Cost) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.Unit_Offer_with_Roof_Cost) + "₺" || 0 + "₺"}</td>
                      <td>${formatNumber(card.Profit_Rate_Card) + "₺" || 0 + "₺"}</td>
                      <td>${formatDateForTable(card.Date_Card)}</td>
                  </tr>
              `;
        rows += row;
      }
    }
    lostTableBody.innerHTML = "";
    lostTableBody.insertAdjacentHTML("beforeend", rows);

    //editBtns();
    //sortTableForStart(supplierTable, 1);
    //allTableFormat();
    //sortingTable(supplierTable);    
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}

// SALES LİST
getSalesList()
async function getSalesList() {
  try {
    const data = await apiFunctions("sales_offer", "GET");
    let rows = "";
    const salesTableBody = salesTable.querySelector("tbody");
    for (const card of data) {
      if (card.Is_late) {
        const row = `
                  <tr>
                      <td>
                        <a href="#" onclick="reWaitCard(${card.id}); return false;">
                          <i class="fa-solid fa-rotate-left"></i>
                        </a>
                      </td>
                      <td>${card.client.CompanyName_Clients}</td>
                      <td>${card.Location_Card}</td>
                      <td>${card.Person_Deal}</td>
                      <td>${card.AC_Power_Card}</td>
                      <td>${card.DC_Power_Card}</td>
                      <td>${card.UnitCost_NotIncludingKDV}</td>
                      <td>${card.Cost_NotIncludingKDV_Card}</td>
                      <td>${card.UnitOffer_NotIncludingKDV}</td>
                      <td>${card.Offer_Cost_NotIncludingKDV_Card}</td>
                      <td>${card.Terrain_Roof_Card}</td>
                      <td>${card.Roof_Cost_Card}</td>
                      <td>${card.Unit_Cost_with_Roof_Cost}</td>
                      <td>${card.Unit_Offer_with_Roof_Cost}</td>
                      <td>${card.Profit_Rate_Card}</td>
                      <td>${card.Date_Card}</td>
                  </tr>
              `;
        rows += row;
      }
    }
    salesTableBody.innerHTML = "";
    salesTableBody.insertAdjacentHTML("beforeend", rows);
    //editBtns();
    //sortTableForStart(supplierTable, 1);
    //allTableFormat();
    //sortingTable(supplierTable);    
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}

// WON LİST
getWonList()
async function getWonList() {
  try {
    const data = await apiFunctions("sales_offer", "GET");
    let rows = "";
    const wonTableBody = wonTable.querySelector("tbody");
    for (const card of data) {
      if (card.Is_Gain) {
        const row = `
                  <tr>
                      <td>
                        <a href="#" onclick="reGainCard(${card.id}); return false;">
                          <i class="fa-solid fa-rotate-left"></i>
                        </a>
                      </td>
                      <td>${card.client.CompanyName_Clients}</td>
                      <td>${card.Location_Card}</td>
                      <td>${card.Person_Deal}</td>
                      <td>${card.AC_Power_Card}</td>
                      <td>${card.DC_Power_Card}</td>
                      <td>${card.UnitCost_NotIncludingKDV}</td>
                      <td>${card.Cost_NotIncludingKDV_Card}</td>
                      <td>${card.UnitOffer_NotIncludingKDV}</td>
                      <td>${card.Offer_Cost_NotIncludingKDV_Card}</td>
                      <td>${card.Terrain_Roof_Card}</td>
                      <td>${card.Roof_Cost_Card}</td>
                      <td>${card.Unit_Cost_with_Roof_Cost}</td>
                      <td>${card.Unit_Offer_with_Roof_Cost}</td>
                      <td>${card.Profit_Rate_Card}</td>
                      <td>${card.Date_Card}</td>
                  </tr>
              `;
        rows += row;
      }
    }
    wonTableBody.innerHTML = "";
    wonTableBody.insertAdjacentHTML("beforeend", rows);
    //editBtns();
    //sortTableForStart(supplierTable, 1);
    //allTableFormat();
    //sortingTable(supplierTable);    
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}





//                CARD EDİT FUNCTİON
let btnID = -1;
function editBtns() {
  let editButtons = document.querySelectorAll(".card_edit_btn");
  console.log(editButtons)
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      setTimeout(async () => {
        editMode = true;
        btnID = button.id;
        const data = await apiFunctions("sales_offer", "GETID", "x", btnID)
        console.log(data)
        for (var key in data) {
          if (data.hasOwnProperty(key)) {

            var element = document.querySelector('input[name="' + key + '"]');
            var selectElement = document.querySelector('select[name="' + key + '"]');
            if (element) {
              if (key == "Client_Card") {
                element.value = data["client"].CompanyName_Clients;
                element.setAttribute('data-id', data[key]);
              } else if (element.type != "file") {
                element.value = data[key];
              }
            } else if (selectElement) {
              selectElement.value = data[key];
            }
          }
        }
        salesOfferAddWindow.style.display = "flex";
      }, 10);
    })
  });
}


//                  MALİYET HESAPLAMA İŞLEMLERİ
var teklifBedeliInput = document.querySelector("#id_Offer_Cost_NotIncludingKDV_Card");
var dcGucInput = document.querySelector('#id_DC_Power_Card');
var birimTeklifInput = document.querySelector("#id_UnitOffer_NotIncludingKDV");

var birimBasiMaliyetInput = document.querySelector("#id_UnitCost_NotIncludingKDV");
var isBedeliInput = document.querySelector("#id_Cost_NotIncludingKDV_Card");
let teklifBedeliCalc = document.querySelector("#teklif_bedeli_btn");
let birimTeklifCalc = document.querySelector("#br_tek_btn");
let toplamMaliyetCalc = document.querySelector("#total_mal_btn");
let birimMaliyetCalc = document.querySelector("#br_mal_btn");
let dcGucCalc = document.querySelector("#dc_guc_btn");

teklifBedeliCalc.addEventListener("click", () => {
  if (!(clear2(birimTeklifInput.value) == "") && !(clear2(dcGucInput.value) == "")) {
    var value = clear2(birimTeklifInput.value) * clear2(dcGucInput.value);
    teklifBedeliInput.value = formatNumber(value, 2);
  }
});
birimTeklifCalc.addEventListener("click", () => {
  if (!(clear2(teklifBedeliInput.value) == "") && !(clear2(dcGucInput.value) == "")) {
    var value = clear2(teklifBedeliInput.value) / clear2(dcGucInput.value);
    birimTeklifInput.value = formatNumber(value, 2);
  }
});
toplamMaliyetCalc.addEventListener("click", () => {
  if (!(clear2(birimBasiMaliyetInput.value) == "") && !(clear2(dcGucInput.value) == "")) {
    var value = clear2(birimBasiMaliyetInput.value) * clear2(dcGucInput.value);
    isBedeliInput.value = formatNumber(value, 2);
  }
});
birimMaliyetCalc.addEventListener("click", () => {
  if (!(clear2(isBedeliInput.value) == "") && !(clear2(dcGucInput.value) == "")) {
    var value = clear2(isBedeliInput.value) / clear2(dcGucInput.value);
    birimBasiMaliyetInput.value = formatNumber(value, 2);
  }
});
dcGucCalc.addEventListener("click", () => {
  if (!(clear2(teklifBedeliInput.value) == "") && !(clear2(birimTeklifInput.value) == "")) {
    var value = clear2(teklifBedeliInput.value) / clear2(birimTeklifInput.value);
    dcGucInput.value = formatNumber(value, 2);
  }
  if (!(clear2(isBedeliInput.value) == "") && !(clear2(birimBasiMaliyetInput.value) == "")) {
    var value = clear2(isBedeliInput.value) / clear2(birimBasiMaliyetInput.value);
    dcGucInput.value = formatNumber(value, 2);
  }
});