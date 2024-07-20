const garantiContainer = document.querySelector(".garanti-container");
const arizaContainer = document.querySelector(".ariza-container");
const garantiSelection = document.querySelector("#id_Fail_Guaranteed");
const garantiDivContainer = document.querySelector(".center2");


garantiSelection.addEventListener("change", function() {
  var selectedValue = garantiSelection.value;
  console.log(selectedValue == "Evet")
  
  if (selectedValue == "Evet") {
  } else if (selectedValue == "Hayır") {
    delayTimeout = setTimeout(function() {
        garantiContainer.style.display = "flex";
      }, 15);
  }  
});


document.addEventListener("click", function(event) {                 
    var isClickInsideDiv = garantiDivContainer.contains(event.target); 
    if(garantiContainer.style.display === "flex"){
        if(!isClickInsideDiv){                        
            garantiContainer.style.display = "none";    
            garantiSelection.value = "Belirsiz"    
        } 
    }                   
});


//                  DOSYA YÜKLEME

const fileInput = document.getElementById("id_Fail_Bill_File");
const fileNameSpan = document.querySelector("#fatura_file_span");

fileInput.addEventListener("change", function() {
  const fileName = this.files[0].name;
  fileNameSpan.textContent = fileName;
});

let arizaForm = document.querySelector("#my-form");
let faturaForm = document.querySelector("#fatura_form");
let arizaFormButton = document.querySelector("#ariza-create-btn");
let faturaFormButton = document.querySelector("#fatura-create-btn");

let faturaContainer = document.querySelector(".garanti-container");


faturaFormButton.addEventListener("click", () =>{
  faturaContainer.style.display = "none";
});

arizaFormButton.addEventListener("click", (event) =>{
  event.preventDefault();
  
  arizaForm.submit();
  faturaForm.submit();
});