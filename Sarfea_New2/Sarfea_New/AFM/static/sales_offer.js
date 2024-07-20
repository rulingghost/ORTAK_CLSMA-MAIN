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

const reqSalesInputs = document.querySelectorAll("#id_Client_Card, #id_Person_Deal, #id_Location_Card, #id_Situation_Card");
const reqSalesLabels = document.querySelectorAll("#firma_adi_span, #ilgilenen_kisi_span, #konum_span, #drum_span");

//              TARİH İNPUTLARI FORMATLAMA
const dateInputs = document.querySelectorAll(".date-inputs");
formatDateInputs(dateInputs);

//              INPUT FORMATLAMA
const formatedInputs = document.querySelectorAll(".formatInputs");
inputsForFormat(formatedInputs);

var editMode = false;

var container = document.querySelector('.rows');
container.scrollTop = container.scrollHeight - container.clientHeight - 50;

document.addEventListener("DOMContentLoaded", function () {
  //                  CARD NONE VERİLERİ DÜZELTME

  topMenuLi[2].classList.add("li-hover");

});





document.addEventListener("DOMContentLoaded", async () => {
  uploadPage();
  //await getSalesCards();
  // setInterval(async function () {
  //   await getSalesCards();
  // }, 5000);
});

//                 KARTLARI EKRANA YAZDIRMA
async function getSalesCards() {
  try {
    let Rows = document.querySelectorAll(".card-body");
    var data = await apiFunctions("sales_offer", "GET");
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
    //dragCards()
    totalSpanFormatForDrag()
    //cardFormat();
    cardMenuFunctions()
    singleFileUpload()
    editBtns()
    dragTest()
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
    <li id="${card.id}" data-situation="${card.Situation_Card}" class="item card" draggable="true">
      <div >
          <div class="boxes">
              <p class="bold700 card-title">${card.client.CompanyName_Clients || "-"}</p>
          </div>
          <p>${formattedDate}</p>
          <div class="boxes">
              <p>${formatNumber(card.Offer_Cost_NotIncludingKDV_Card, 2) + "$"}</p>
          </div>
          <div class="boxes">
              <p>${formatNumber(card.UnitOffer_NotIncludingKDV, 2)  + "$"} USD/kWp</p>
          </div>
          <div class="boxes">
              <p>${formatNumber(card.Cost_NotIncludingKDV_Card, 2)  + "$"}</p>
              <p>${formatNumber(card.UnitCost_NotIncludingKDV, 2)  + "$"}</p>
          </div>
          <div class="boxes">
              <p>${formatNumber(card.DC_Power_Card, 2)  + " kWp"}</p>
              <p>${card.Terrain_Roof_Card}</p>
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
          <div style="margin-top: 10px; display: flex; justify-content: space-between;" class="buttons">
          ${card.Comment_Card_1 ? `<button class="blue" onclick="commendAddFunction(1, ${card.id})">Y1</button>` : `<button onclick="commendAddFunction(1, ${card.id})">Y1</button>`}
          ${card.Comment_Card_2 ? `<button class="blue" onclick="commendAddFunction(2, ${card.id})">Y2</button>` : `<button onclick="commendAddFunction(2, ${card.id})">Y2</button>`}
          ${card.Comment_Card_3 ? `<button class="blue" onclick="commendAddFunction(3, ${card.id})">Y3</button>` : `<button onclick="commendAddFunction(3, ${card.id})">Y3</button>`}
          ${card.Comment_Card_4 ? `<button class="blue" onclick="commendAddFunction(4, ${card.id})">Y4</button>` : `<button onclick="commendAddFunction(4, ${card.id})">Y4</button>`}
          ${card.Comment_Card_5 ? `<button class="blue" onclick="commendAddFunction(5, ${card.id})">Y5</button>` : `<button onclick="commendAddFunction(5, ${card.id})">Y5</button>`}
          ${card.Comment_Card_6 ? `<button class="blue" onclick="commendAddFunction(6, ${card.id})">Y4</button>` : `<button onclick="commendAddFunction(6, ${card.id})">Y4</button>`}
          ${card.Comment_Card_7 ? `<button class="blue" onclick="commendAddFunction(7, ${card.id})">Y5</button>` : `<button onclick="commendAddFunction(7, ${card.id})">Y5</button>`}
          </div>
          <div class="card-menu">
              <i class="fa-solid fa-ellipsis card_menu-btn"></i>
              <ul style="display: none;" class="card_menu">
                  <li id="${card.id}" class = "card_edit_btn">Düzenle</li>
                  <li onclick="lostCard(${card.id})">Kaybedildi</li>
                  <li onclick="gainCard(${card.id})">Kazanıldı</li>
                  <li onclick="waitCard(${card.id})">Bekleyen</li>
                  <li id="${card.id}" class = "card_edit_btn" onclick="reviseCard(${card.id})">Revize </li>
              </ul>
          </div>
      </div>
    </li>
  `;
}
var commendAddWindow = document.querySelector(".commend-add-window");
const commendContainer = document.querySelector("#commend_container");

const commendCard = document.querySelector(`#Comment_Card`);
const commendTel = document.querySelector(`#Comment_Telno_Card`);
const commendPerson = document.querySelector(`#Comment_Person_Card`);
const commendCDate = document.querySelector(`#Comment_Date_Card`);

var commendValue = -1;
var commendId = -1;

async function commendAddFunction(x, y){
  setTimeout(async () => {
    commendValue = x;
    commendId = y;
    commendAddWindow.style.display = "flex";
    const result = await apiFunctions("sales_offer", "GETID", "x", y)
    let key1 = `Comment_Card_${x}`;
    commendCard.value = result[key1] || "";
    let key2 = `Comment_Telno_Card_${x}`;
    commendTel.value = result[key2] || "";
    let key3 = `Comment_Person_Card_${x}`;
    commendPerson.value = result[key3] || "";
    let key4 = `Comment_Date_Card_${x}`;
    commendCDate.value = result[key4] || "";
    formatDateInputsForLoad(dateInputs)
  }, 10);
}
document.addEventListener("mousedown", (event) => {
  const commendAddContainer = document.querySelector(".commend-add-window .container");
  if (!commendAddContainer.contains(event.target)) {
    commendAddWindow.style.display = "none";
  }
});



async function commendSubmitFunction(event){
 // event.preventDefault();
  var formData = new FormData();
  
  formData.append(`Comment_Card_${commendValue}`, commendCard.value);
  formData.append(`Comment_Telno_Card_${commendValue}`, commendTel.value);
  formData.append(`Comment_Person_Card_${commendValue}`, commendPerson.value);
  formData.append(`Comment_Date_Card_${commendValue}`, formatDateForSubmit(commendCDate.value));
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });
  
  // JavaScript nesnesini JSON formatına dönüştürün
  const formDataJson = JSON.stringify(formDataObject);
  
  // JSON formatındaki formData'yı konsola yazdırın
  console.log(formDataJson);
  await apiFunctions("sales_offer", "PATCH", formData, commendId);
  getSalesCards();
  commendAddWindow.style.display = "none";
}

function dragTest() {
  const sortableLists = document.querySelectorAll(".card-body");
  sortableLists.forEach((sortableList) => {

      const items = sortableList.querySelectorAll(".item");

      items.forEach(item => {
        item.addEventListener("dragstart", (event) => {
          const draggingItem = event.target;
          dragItem = draggingItem;
          setTimeout(() => draggingItem.classList.add("dragging"), 0);
      });
          item.addEventListener("dragend", (event) => {
              item.classList.remove("dragging"); 
                           
              updateCardSituation(item, event.target.parentElement);
              totalSpanFormatForDrag()
          });
      });

      const initSortableList = (e) => {
          e.preventDefault();
          const draggingItem = document.querySelector(".dragging");
          let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];

          let nextSibling = siblings.find(sibling => {
              return e.clientY <= sibling.offsetTop + sibling.offsetHeight;
          });

          sortableList.insertBefore(draggingItem, nextSibling);
      }

      sortableList.addEventListener("dragover", initSortableList);
      sortableList.addEventListener("dragenter", e => e.preventDefault());
  })
  
}

function updateCardSituation(draggingItem, ul) {
  var targetRowSituation = ul.parentElement.dataset.situation;
  
  var cardId = draggingItem.id;
  var xhr = new XMLHttpRequest();
  var updateCardSituationUrl = "/update_card_situation/";

  xhr.open("POST", updateCardSituationUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {       
        dragItem.dataset.situation = targetRowSituation;
        //dragItem.dataset.situation = response.new_situation;
    }
};
  xhr.send(      
      JSON.stringify({ card_id: cardId, new_situation: targetRowSituation })
  );
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
      //location.reload();
      uploadPage()
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
      uploadPage()
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
      uploadPage()
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
      uploadPage()
      //location.reload();
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
      //location.reload();
      uploadPage()
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
      //location.reload();
      uploadPage()
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
      //location.reload();
      uploadPage()
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
function singleFileUpload() {
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
    var jsonObject = {};
  formData.forEach(function (value, key) {
    jsonObject[key] = value;
  });
  console.log(JSON.stringify(jsonObject));
    if (editMode == false) {
      await apiFunctions("sales_offer", "POST", formData);
    } else {
      const fileInpust1 = document.querySelectorAll(".inputfile-1");
      fileInpust1.forEach((input)=>{
        if(input.value == ""){
          let inputName = input.getAttribute("name")
          formData.delete(inputName)
        }
      })
      const fileInpust2 = document.querySelectorAll(".inputfile-2");
      fileInpust2.forEach((input)=>{
        if(input.value == ""){
          let inputName = input.getAttribute("name")
          formData.delete(inputName)
        }
      })      
      await apiFunctions("sales_offer", "PUT", formData, btnID);
    }
    salesOfferAddWindow.style.display = "none";
    clearInputAfterSave(addForm);
    uploadPage();
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
    var data = await apiFunctions("client", "GET")
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
    var data = await apiFunctions("sales_offer", "GET");
    console.log(data)
    let rows = "";
    const listTableBody = listTable.querySelector("tbody");
    listTableBody.innerHTML = "";
    for (const card of data) {
      var row = document.createElement("tr");
      //row.id = card.id;
      row.setAttribute("data-id", card.id);
      row.addEventListener("click", goToCard);

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
          <td data-label="Durum" class="list_firt_tr"><a href="/sales_offer_revises/${card.id}/"><i class="fas fa-book"></i><span style="display: none;">Revize</span></a><span class="icon-blue"></span></td>
          <td data-label="Durum">${card.Is_Gain ? 'Kazanılan İş' : (card.Is_Lost ? 'Kaybedilen İş' : (card.Is_late ? 'Bekleyen İş' : card.Situation_Card))}</td>
          <td data-label="Müşteri Adı">${card.client.CompanyName_Clients || "-"}</td>
          <td data-label="Konum">${card.Location_Card || "-"}</td>
          <td data-label="İlgili Kişi">${card.Person_Deal || "-"}</td>
          <td data-label="AC Güç">${formatNumber(card.AC_Power_Card, 0) + "kWe"}</td>
          <td data-label="DC Güç">${formatNumber(card.DC_Power_Card, 0) + "kWp"}</td>
          <td data-label="Birim Maliyet">${formatNumber(card.UnitCost_NotIncludingKDV, 2) + "$"}</td>
          <td data-label="Toplam Maliyet">${formatNumber(card.Cost_NotIncludingKDV_Card, 2) + "$"}</td>
          <td data-label="Birim Teklif">${formatNumber(card.UnitOffer_NotIncludingKDV, 2) + "$"}</td>
          <td data-label="Toplam Teklif">${formatNumber(card.Offer_Cost_NotIncludingKDV_Card, 2) + "$"}</td>
          <td data-label="Arazi/Çatı">${card.Terrain_Roof_Card || "-"}</td>
          <td data-label="Arazi Maliyeti">${formatNumber(card.Roof_Cost_Card, 2) + "$"}</td>
          <td data-label="Arazi Dahil B.M.">${formatNumber(card.Unit_Cost_with_Roof_Cost, 2) + "$"}</td>
          <td data-label="Arazi Dahil T.T.">${formatNumber(card.Unit_Offer_with_Roof_Cost, 2) + "$"}</td>
          <td data-label="Arazi Maliyeti">${formatNumber(card.Profit_Rate_Card, 2) + " $/MW"}</td>
          <td data-label="Tarih">${formatDateForTable(card.Date_Card)}</td>
          ${card.Comment_Card_1 ? `<td data-label="Yorum 1" title="${card.Comment_Card_1}">${card.Comment_Card_1.slice(0, 10)}</td>` : `<td>-</td>`}
          ${card.Comment_Card_2 ? `<td data-label="Yorum 2" title="${card.Comment_Card_2}">${card.Comment_Card_2.slice(0, 10)}</td>` : `<td>-</td>`}
          ${card.Comment_Card_3 ? `<td data-label="Yorum 3" title="${card.Comment_Card_3}">${card.Comment_Card_3.slice(0, 10)}</td>` : `<td>-</td>`}
          ${card.Comment_Card_4 ? `<td data-label="Yorum 4" title="${card.Comment_Card_4}">${card.Comment_Card_4.slice(0, 10)}</td>` : `<td>-</td>`}
          ${card.Comment_Card_5 ? `<td data-label="Yorum 5" title="${card.Comment_Card_5}">${card.Comment_Card_5.slice(0, 10)}</td>` : `<td>-</td>`}
          ${card.Comment_Card_6 ? `<td data-label="Yorum 6" title="${card.Comment_Card_6}">${card.Comment_Card_6.slice(0, 10)}</td>` : `<td>-</td>`}
          ${card.Comment_Card_7 ? `<td data-label="Yorum 7" title="${card.Comment_Card_7}">${card.Comment_Card_7.slice(0, 10)}</td>` : `<td>-</td>`}
        `;

      listTableBody.appendChild(row);
    }
    listTablePaint();
    sortingTable(listTable);
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
    var data = await apiFunctions("sales_offer", "GET");
    let rows = "";
    const lostTableBody = lostTable.querySelector("tbody");
    for (const card of data) {
      if (card.Is_Lost) {
        const row = `
                  <tr>
                      <td>
                        <a href="#" onclick="reLostCard(${card.id}); return false;">
                          <i class="fa-solid fa-rotate-left"></i>
                          <span style="display: none;">Geri Al</span>
                        </a>
                      </td>
                      <td data-label="Müşteri Adı">${card.client.CompanyName_Clients || "-"}</td>
                      <td data-label="Konum">${card.Location_Card || "-"}</td>
                      <td data-label="İlgili Kişi">${card.Person_Deal || "-"}</td>
                      <td data-label="AC Güç">${formatNumber(card.AC_Power_Card, 0) + "kWe"}</td>
                      <td data-label="DC Güç">${formatNumber(card.DC_Power_Card, 0) + "kWp"}</td>
                      <td data-label="Birim Maliyet">${formatNumber(card.UnitCost_NotIncludingKDV , 2) + "$" }</td>
                      <td data-label="Toplam Maliyet">${formatNumber(card.Cost_NotIncludingKDV_Card, 2) + "$" }</td>
                      <td data-label="Birim Teklif">${formatNumber(card.UnitOffer_NotIncludingKDV, 2) + "$" }</td>
                      <td data-label="Toplam Teklif">${formatNumber(card.Offer_Cost_NotIncludingKDV_Card, 2) + "$" }</td>
                      <td data-label="Arazi/Çatı">${card.Terrain_Roof_Card || "-"}</td>
                      <td data-label="Arazi Maliyeti">${formatNumber(card.Roof_Cost_Card, 2) + "$" }</td>
                      <td data-label="Arazi Dahil Birim Maliyet">${formatNumber(card.Unit_Cost_with_Roof_Cost, 2) + "$" }</td>
                      <td data-label="Arazi Dahil Toplam Teklif">${formatNumber(card.Unit_Offer_with_Roof_Cost, 2) + "$" }</td>
                      <td data-label="Arazi Maliyeti">${formatNumber(card.Profit_Rate_Card, 2) + "$/MW" }</td>
                      <td data-label="Tarih">${formatDateForTable(card.Date_Card)}</td>
                  </tr>
              `;
        rows += row;
      }
    }
    lostTableBody.innerHTML = "";
    lostTableBody.insertAdjacentHTML("beforeend", rows);
    sortingTable(lostTable);
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
    var data = await apiFunctions("sales_offer", "GET");
    let rows = "";
    const salesTableBody = salesTable.querySelector("tbody");
    for (const card of data) {
      if (card.Is_late) {
        const row = `
                  <tr>
                      <td>
                        <a href="#" onclick="reWaitCard(${card.id}); return false;">
                          <i class="fa-solid fa-rotate-left"></i>
                          <span style="display: none;">Geri Al</span>
                        </a>
                      </td>
                      <td data-label="Müşteri Adı">${card.client.CompanyName_Clients || "-"}</td>
                      <td data-label="Konum">${card.Location_Card || "-"}</td>
                      <td data-label="İlgili Kişi">${card.Person_Deal || "-"}</td>
                      <td data-label="AC Güç">${formatNumber(card.AC_Power_Card, 0) + "kWe"}</td>
                      <td data-label="DC Güç">${formatNumber(card.DC_Power_Card, 0) + "kWp"}</td>
                      <td data-label="Birim Maliyet">${formatNumber(card.UnitCost_NotIncludingKDV, 2) + "$"}</td>
                      <td data-label="Toplam Maliyet">${formatNumber(card.Cost_NotIncludingKDV_Card, 2) + "$"}</td>
                      <td data-label="Birim Teklif">${formatNumber(card.UnitOffer_NotIncludingKDV, 2) + "$"}</td>
                      <td data-label="Toplam Teklif">${formatNumber(card.Offer_Cost_NotIncludingKDV_Card, 2) + "$"}</td>
                      <td data-label="Arazi/Çatı">${card.Terrain_Roof_Card || "-"}</td>
                      <td data-label="Arazi Maliyeti">${formatNumber(card.Roof_Cost_Card, 2) + "$"}</td>
                      <td data-label="Arazi Dahil Birim Maliyet">${formatNumber(card.Unit_Cost_with_Roof_Cost, 2) + "$"}</td>
                      <td data-label="Arazi Dahil Toplam Teklif">${formatNumber(card.Unit_Offer_with_Roof_Cost, 2) + "$"}</td>
                      <td data-label="Arazi Maliyeti">${formatNumber(card.Profit_Rate_Card, 2) + "$/MW"}</td>
                      <td data-label="Tarih">${formatDateForTable(card.Date_Card)}</td>
                  </tr>
              `;
        rows += row;
      }
    }
    salesTableBody.innerHTML = "";
    salesTableBody.insertAdjacentHTML("beforeend", rows);
    sortingTable(salesTable);
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
    var data = await apiFunctions("sales_offer", "GET");
    let rows = "";
    const wonTableBody = wonTable.querySelector("tbody");
    for (const card of data) {
      if (card.Is_Gain) {
        const row = `
                  <tr>
                      <td>
                        <a href="#" onclick="reGainCard(${card.id}); return false;">
                          <i class="fa-solid fa-rotate-left"></i>
                          <span style="display: none;">Geri Al</span>
                        </a>
                      </td>
                      <td data-label="Müşteri Adı">${card.client.CompanyName_Clients || "-"}</td>
                      <td data-label="Konum">${card.Location_Card || "-"}</td>
                      <td data-label="İlgili Kişi">${card.Person_Deal || "-"}</td>
                      <td data-label="AC Güç">${formatNumber(card.AC_Power_Card, 0) + "kWe"}</td>
                      <td data-label="DC Güç">${formatNumber(card.DC_Power_Card, 0) + "kWp"}</td>
                      <td data-label="Birim Maliyet">${formatNumber(card.UnitCost_NotIncludingKDV, 2) + "$"}</td>
                      <td data-label="Toplam Maliyet">${formatNumber(card.Cost_NotIncludingKDV_Card, 2) + "$"}</td>
                      <td data-label="Birim Teklif">${formatNumber(card.UnitOffer_NotIncludingKDV, 2) + "$"}</td>
                      <td data-label="Toplam Teklif">${formatNumber(card.Offer_Cost_NotIncludingKDV_Card, 2) + "$"}</td>
                      <td data-label="Arazi/Çatı">${card.Terrain_Roof_Card || "-"}</td>
                      <td data-label="Arazi Maliyeti">${formatNumber(card.Roof_Cost_Card, 2) + "$"}</td>
                      <td data-label="Arazi Dahil Birim Maliyet">${formatNumber(card.Unit_Cost_with_Roof_Cost, 2) + "$"}</td>
                      <td data-label="Arazi Dahil Toplam Teklif">${formatNumber(card.Unit_Offer_with_Roof_Cost, 2) + "$"}</td>
                      <td data-label="Arazi Maliyeti">${formatNumber(card.Profit_Rate_Card, 2) + "$/MW"}</td>
                      <td data-label="Tarih">${formatDateForTable(card.Date_Card)}</td>
                  </tr>
              `;
        rows += row;
      }
    }
    wonTableBody.innerHTML = "";
    wonTableBody.insertAdjacentHTML("beforeend", rows);
    sortingTable(wonTable);
    //editBtns();
    //sortTableForStart(supplierTable, 1);
    //allTableFormat();
    //sortingTable(supplierTable);    
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}
function uploadPage(){
  getSalesCards()
  getWonList()
  getSalesList()
  getLostList()
  getTotalList()
}
//                  LİSTEDEN CARDA GİTME
const goToCard = (event)=>{ 
  var cardId = event.currentTarget.getAttribute("data-id");
    console.log(cardId)
    const card = document.getElementById(cardId);
    if (card) {
      topMenuLi[2].classList.add("li-hover");
      topMenuLi[0].classList.remove("li-hover");
      handleMenuItemClick("sale_time");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log(card)
      //card.style.background = "#fff";
      card.style.boxShadow = "0px 0px 8px 2px red";
      setTimeout(function() {
        card.style.background = "#ffffff80"
        card.style.boxShadow = "1px 1px 5px #2c2c2c";
      }, 2500);      

    } 
}



//                CARD EDİT FUNCTİON
let btnID = -1;

async function editBtns() {
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
        onPageLoads(formatedInputs)
        formatDateInputsForLoad(dateInputs)

      }, 10);
    })
  });
}
formatDateInputs(dateInputs);
formatDateInputsForLoad(dateInputs);

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

// ARAZİ BEDELİ
var terrainSelect = document.querySelector("#id_Terrain_Roof_Card");
var terrainCost = document.querySelector("#id_Roof_Cost_Card");
// const secilenDeger = terrainSelect.value;
// if (secilenDeger === "Arazi") {
//   terrainCost.disabled = false;
// } else {
//   terrainCost.disabled = true;
// }
terrainSelect.addEventListener("change", async function () {
  const secilenDeger = terrainSelect.value;
  if (secilenDeger === "Arazi") {
    terrainCost.disabled = false;
  } else {
    terrainCost.disabled = true;
    terrainCost.value = "";
  }
});



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
    "#left-menu-nav"
  );
  if (window.innerWidth <= 767 && !leftMenuNav.contains(event.target)) {
    leftMenu.style.display = "none";
  }
});


const listMenu = document.querySelector(".top-menu-ul");
const hamburgerBtn2 = document.querySelector(".hamburger-button2");
hamburgerBtn2.addEventListener("click", () => {
  setTimeout(async () => { listMenu.style.display = "flex";}, 20) 
});

document.addEventListener("click", (event) => {

  if (window.innerWidth <= 767 && !listMenu.contains(event.target)) {
    listMenu.style.display = "none";
  }
});

const searchTerm = document.querySelector('.searchForNav input');
searchTerm.addEventListener("input", ()=>{
  filterCards()
})

function filterCards() {
  const searchTerm = document.querySelector('.searchForNav input').value.toLowerCase();
  const cards = document.querySelectorAll('.card-body li.item');
  cards.forEach(card => {
    if(card){
      const companyName = card.querySelector('.card-title').textContent.toLowerCase();
      if (companyName.includes(searchTerm)) {
        card.style.display = 'list-item';
      } else {
        card.style.display = 'none';
      }
    }
  });
  
  //document.querySelector('.card-body').innerHTML = cards.map(generateCard).join('');
}


