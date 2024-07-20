var phoneNumberInput = document.querySelector("#id_PhoneNumber");
var reqInputs = document.querySelectorAll("#id_CompanyName_Supplier_New");
var reqLabels = document.querySelectorAll("#firma_adi_span");
var amountInputReformatBtn = document.querySelector("#kaydet_btn");
var form = document.querySelector("#myForm");

//                  TELEFON NUMARASI FORMATLAMA

var contryNumber = "+90";
phoneNumberInput.value = formatPhoneNumberByCountryCode(
  phoneNumberInput.value,
  contryNumber
);
phoneNumberInput.addEventListener("input", function (event) {
  if (event.inputType !== "deleteContentBackward") {
    phoneNumberInput.value = formatPhoneNumberByCountryCode(
      phoneNumberInput.value,
      contryNumber
    );
  }
});

//                  ZORUNLU İNPUTLAR

amountInputReformatBtn.addEventListener("click", function (event) {
  event.preventDefault();
  console.log(requiredInputs(reqInputs, reqLabels));
  if (requiredInputs(reqInputs, reqLabels)) {
    form.submit();
  }
});
