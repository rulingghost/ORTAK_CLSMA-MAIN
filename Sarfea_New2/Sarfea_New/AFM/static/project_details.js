
var konumDiv = document.querySelector("#konum_div");
var konumSpan = document.querySelector("#Konum_span");
var typeDiv = document.querySelector("#type_div");
var typeSpan = document.querySelector("#type_span");

var acPowerSpan = document.querySelector("#ac-power-span");
var dcPowerSpan = document.querySelector("#dc-power-span");
var realizedIncomeSpan = document.querySelector("#realized_income_span");
var realizedCostSpan2 = document.querySelector("#realized_cost_span2");
var dateSpans = document.querySelectorAll(".date-span")
const gerceklesenKarOraniSpan = document.querySelector("#gerceklesen_kar_orani");

const hesaplananIsBedeliSpan = document.querySelector("#hesaplanan_is_bedeli_span").textContent;
const hesaplananMaliyetSpan = document.querySelector("#hesaplanan_maliyet_span").textContent;


const gerceklesenKarZararSpan = document.querySelector("#gerceklesen_kar_zarar");
const hesaplananKarZararSpan = document.querySelector("#hesaplanan_kar_zarar");
let hesaplananIsBedeli = parseFloat(hesaplananIsBedeliSpan);
  let hesaplananMaliyet = parseFloat(hesaplananMaliyetSpan);
document.addEventListener("DOMContentLoaded", async () => {
  await getGelir();
  await getMaliyet();
  let gerceklesenKarOrani = (((totalGelir - totalMaliyet) * 100) / totalMaliyet);
  gerceklesenKarOraniSpan.textContent = formatNumber(gerceklesenKarOrani, 2) + "%";
  gerceklesenKarZararSpan.textContent = formatNumber(totalGelir - totalMaliyet, 2);
  hesaplananKarZararSpan.textContent = formatNumber(hesaplananIsBedeli - hesaplananMaliyet, 2)
  // document.querySelector("#hesaplanan_is_bedeli_span").textContent = formatNumber(hesaplananIsBedeli, 0)
  // document.querySelector("#hesaplanan_maliyet_span").textContent = formatNumber(hesaplananMaliyet, 0)
});

// function gerceklesenGrafikFunction(){
//   const ctxgeceklesen = document.getElementById('gerceklesen_grafik');
//   // ctxgeceklesen.width = "100px";
//   // ctxgeceklesen.height = "100px";
// new Chart(ctxgeceklesen, {
//   type: 'doughnut',
//   data: {
//     labels: [
//       'Kar: ' + formatNumber(totalGelir, 0),
//       'Zarar: ' + formatNumber(totalMaliyet, 0),
//     ],
//     datasets: [{
//       label: 'My First Dataset',
//       data: [totalGelir, totalMaliyet],
//       backgroundColor: [
//         '#3a4a71',
//         '#8b8b8b',
//       ],
//       hoverOffset: 4,
//       borderColor: 'transparent'
//     }]
//   },
//   options: {
//     responsive: false, 
//     maintainAspectRatio: false,
//     layout: {
//       padding: {
//       }
//     },
//     elements: {
//       point: {
//         pointStyle: 'circle',
//         radius: 1,
//         borderWidth: 1,
//         borderColor: 'red',
//         backgroundColor: 'yellow'
//       },
//       line: {
//         borderWidth: 5,
//         borderColor: 'blue',
//       }
//     },
//     plugins: {
//       title: {
//         display: false,
//         text: 'Nakit Akışı',
//         position: 'top',
//         color: 'black',
//         align: 'start',
//         font: {
//           family: 'Arial',
//           size: 18,
//           style: 'normal',
//           lineHeight: 1.2
//         }
//       },
//       legend: {
//         display: true,
//         position: 'bottom',
//       },      
//     },

//     scales: {
//       y: {
//         display: false,
//       },
//       x: {
//         display: false,
//       }
//     }
//   }
// });

// }
// function hesaplananGrafikFunction(){
//   let hesaplananIsBedeli = parseFloat(hesaplananIsBedeliSpan);
//   let hesaplananMaliyet = parseFloat(hesaplananMaliyetSpan);
//   console.log(hesaplananIsBedeli);
//   console.log(hesaplananMaliyet);
//   const ctxHesaplanan = document.getElementById('hesaplanan_grafik');
//   // ctxHarcama.width = "100%";
//   // ctxHarcama.height = "100%";
//   new Chart(ctxHesaplanan, {
//     type: 'doughnut',
//     data: {
//       labels: [
//         'Kar: ' + formatNumber(hesaplananIsBedeli, 0),
//         'Zarar: ' + formatNumber(hesaplananMaliyet, 0),
//       ],
//       datasets: [{
//         label: 'My First Dataset',
//         data: [hesaplananIsBedeli, hesaplananMaliyet],
//         backgroundColor: [
//           '#3a4a71',
//           '#8b8b8b',
//         ],
//         hoverOffset: 4,
//         borderColor: 'transparent'
//       }]
//     },
//     options: {
//       responsive: false, 
//       maintainAspectRatio: false,
//       layout: {
//         padding: {
//         }
//       },
//       elements: {
//         point: {
//           pointStyle: 'circle',
//           radius: 1,
//           borderWidth: 1,
//           borderColor: 'red',
//           backgroundColor: 'yellow'
//         },
//         line: {
//           borderWidth: 5,
//           borderColor: 'blue',
//         }
//       },
//       plugins: {
//         title: {
//           display: false,
//           text: 'Nakit Akışı',
//           position: 'top',
//           color: 'black',
//           align: 'start',
//           font: {
//             family: 'Arial',
//             size: 18,
//             style: 'normal',
//             lineHeight: 1.2
//           }
//         },
//         legend: {
//           display: true,
//           position: 'bottom',
//         },
//       },

//       scales: {
//         y: {
//           display: false,
//         },
//         x: {
//           display: false,
//         }
//       }
//     }
//   });

// }

dateSpans.forEach(span =>{
  span.textContent = formatDate(span.textContent);
})
getProjects(true)
async function getProjects(isEdit) {
  try {
    const data = await apiFunctions("project", "GET");
    //console.log(data)    
      
  } catch (error) {
    console.error("Error fetching and rendering clients:", error);
  }
}
let totalGelir = 0;
let totalMaliyet = 0;
const getMaliyet = async ()=>{
  const projectId = document.querySelector(".project_id").id;
  
  const respons = await apiFunctions("project", "GETID","ds",projectId);
  console.log(respons);
  respons.project_expenses.forEach((expense) =>{
    let expenseAmount = parseFloat(expense.Amount_USD_Expenses) || 0;
    totalMaliyet += expenseAmount;
  });
  realizedCostSpan2.textContent = formatNumber(totalMaliyet,2) + "$";
}
const getGelir = async ()=>{
  const projectId = document.querySelector(".project_id").id;
  
  const respons = await apiFunctions("project", "GETID","ds",projectId);
  console.log(respons);
  respons.project_incomes.forEach((income) =>{
    let incomeAmount = parseFloat(income.Amount_Usd_Incomes) || 0;
    totalGelir += incomeAmount;
  });
  realizedIncomeSpan.textContent = formatNumber(totalGelir,2) + "$";
}




