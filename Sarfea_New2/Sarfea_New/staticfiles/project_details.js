
var konumDiv = document.querySelector("#konum_div");
var konumSpan = document.querySelector("#Konum_span");
var typeDiv = document.querySelector("#type_div");
var typeSpan = document.querySelector("#type_span");

var acPowerSpan = document.querySelector("#ac-power-span");
var dcPowerSpan = document.querySelector("#dc-power-span");
var realizedCostSpan = document.querySelector("#realized_cost_span");
var realizedCostSpan2 = document.querySelector("#realized_cost_span2");
var dateSpans = document.querySelectorAll(".date-span")

dateSpans.forEach(span =>{
    span.textContent = formatDate(span.textContent);
})



