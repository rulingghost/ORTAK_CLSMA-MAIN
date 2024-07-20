var topMenuLi = document.querySelectorAll(".top-menu-ul li");
var bakimKontrolContainer = document.querySelector(".anket-container");
var santralTakipContainer = document.querySelector(".santral_takip_container");
var arizaTakipContainer = document.querySelector(".ariza_takip_container");
var inventorContainer = document.querySelector(".inventor_container");



document.addEventListener("DOMContentLoaded", function () {
  
    topMenuLi[0].classList.add("li-hover");
   
});


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
      case "bakim_kontrol_listesi":
        bakimKontrolContainer.style.display = "block";
        santralTakipContainer.style.display = "none";
        arizaTakipContainer.style.display = "none";
        inventorContainer.style.display = "none";
        break;
      case "santral_takip":
        bakimKontrolContainer.style.display = "none";
        santralTakipContainer.style.display = "flex";
        arizaTakipContainer.style.display = "none";
        inventorContainer.style.display = "none";
        break;
      case "ariza_takip":
        bakimKontrolContainer.style.display = "none";
        santralTakipContainer.style.display = "none";
        arizaTakipContainer.style.display = "flex";
        inventorContainer.style.display = "none";
        break;   
      case "inventör":
        bakimKontrolContainer.style.display = "none";
        santralTakipContainer.style.display = "none";
        arizaTakipContainer.style.display = "none";
        inventorContainer.style.display = "block";
        break;      
      default:
        break;
    }
  }