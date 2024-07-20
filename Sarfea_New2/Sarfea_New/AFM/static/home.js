document.addEventListener("DOMContentLoaded", async function () {




await getIncome();
await getExpenses();
await akisChart()
await karZararChart()
await gelirAylikChart(totalIncome, fullIncome)
await giderAylikChart(totalExpenses, fullExpenses)
await giderDetayFunction()
await giderDetayChart()
});

const giderDetayArray = [
"Diğer",
"AC Kablo",
"Aydınlatma",
"Beton",
"Bobcat",
"Danışman",
"Data Kablosu",
"Data Logger",
"DC Kablo",
"Direkler",
"EKK",
"GES Panosu",
"Güvenlik",
"Hafriyatçı",
"Harçlar (Belediye vs.)",
"Haritacı",
"Hücre",
"Inverter",
"İmarcı",
"İnşaat Malzemesi",
"İzole Halı",
"Kablo Bağı",
"Kamera",
"Kepçe",
"Klemens",
"Komisyon",
"Konaklama",
"Konnektör",
"Konteyner",
"Kök",
"Kum, Çakıl Taş Vb.",
"Manitou",
"Mod Binası",
"Montaj Ayağı",
"Montajcı",
"Nakliye",
"Panel",
"Paratoner",
"Rok Makinesi",
"Scada Panosu",
"Sigorta",
"Spiral Hortum",
"Su Deposu",
"Şalt Malzeme",
"Tava",
"Tel Çit",
"Teras Montaj Taşı",
"Topraklama Şeridi",
"Trafo",
"UPS",
"Vinç",
"Yakıt (İş Makineleri İçin)",
"Yol Masrafı (Personel)",
"Muhtelif Elektrik Malzemesi",
"Muhtelif Hırdavat"
]
let enYuksek4, digerToplam; 

var giderDetayArrayForChart = [];
async function giderDetayFunction(){
  const response = await apiFunctions("expense", "GET");
  
  const giderDetayları = {};

  response.forEach((expense) => {
    const expenseDetail = expense.ExpensDetails_Expenses;
    const amount = parseFloat(expense.Amount_USD_Expenses);

    if (!giderDetayları[expenseDetail]) {
      giderDetayları[expenseDetail] = amount;
    } else {
      giderDetayları[expenseDetail] += amount;
    }
  });
  const sortedGiderDetayları = Object.entries(giderDetayları).sort((a, b) => b[1] - a[1]);
  enYuksek4 = sortedGiderDetayları.slice(0, 4);
  digerToplam = sortedGiderDetayları.slice(4).reduce((acc, [key, value]) => acc + value, 0);

  enYuksek4.forEach((item, index) => {
    const className1 = `.gider_detay${index + 1}-1`;
    const className2 = `.gider_detay${index + 1}-2`;
    document.querySelector(className1).textContent = item[0];
    document.querySelector(className2).textContent = formatNumber(item[1],2);
});
document.querySelector(".gider_detay5-2").textContent = formatNumber(digerToplam,2); 
}
 
//                  LİSTE ÇEKME
let incomeArray = [];
let expensesArray = [];
let totalIncome = 0;
let totalExpenses = 0;
let fullIncome = 0;
let fullExpenses = 0;
let totalProjectExpenses = 0;

async function getIncome(){
    try{
        let data = await apiFunctions('income', "GET");
        console.log(data)
        let bugununTarihi = new Date();
         let results = {};
        data.forEach((income) => {
          const gelirler = parseFloat(income.Amount_Usd_Incomes) || 0;
          fullIncome += gelirler;
            if(income.ChekDate_Incomes){
                const parcalar = income.ChekDate_Incomes.split("-");
                const hedefTarih = new Date(income.ChekDate_Incomes);
                const zamanFarki = bugununTarihi - hedefTarih;
                const gunFarki = zamanFarki / (1000 * 60 * 60 * 24);
                const ay = parseInt(parcalar[1]);

                //console.log(bugununTarihi.getMonth())
                if(parcalar[0] ==  bugununTarihi.getFullYear()){
                    const gelirMiktari = parseFloat(income.Amount_Usd_Incomes) || 0;
                    if (!results[ay]) {
                        
                        results[ay] = gelirMiktari;
                    } else {
                        results[ay] += gelirMiktari;
                    }                    
                }      
                if(gunFarki <= 30){                        
                  totalIncome += gelirler;
                }          
            }         
        });
        for (let i = 1; i <= 12; i++) {
            incomeArray.push(results[i] || 0);
        }
    }catch(error) {
        console.log(error);
    }
}
async function getExpenses(){
    try{
        let data = await apiFunctions('expense', "GET");
        //console.log(data)
        let bugununTarihi = new Date();
         let results = {};
        data.forEach((expense) => {
          const giderler = parseFloat(expense.Amount_USD_Expenses) || 0;
          fullExpenses += giderler;
            if(expense.Date_Expenses){
                const parcalar = expense.Date_Expenses.split("-");
                const hedefTarih = new Date(expense.Date_Expenses);
                const zamanFarki = bugununTarihi - hedefTarih;
                const gunFarki = zamanFarki / (1000 * 60 * 60 * 24);
                const ay = parseInt(parcalar[1]);
                if(parcalar[0] ==  bugununTarihi.getFullYear()){
                    const giderMiktari = parseFloat(expense.Amount_USD_Expenses) || 0;
                    if (!results[ay]) {
                        results[ay] = giderMiktari;
                    } else {
                        results[ay] += giderMiktari;
                    }
                }
                if(gunFarki <= 30){                        
                  totalExpenses += giderler;
                }  
            }            
        });
        for (let i = 1; i <= 12; i++) {
            expensesArray.push(results[i] || 0);
        }
       
    }catch(error) {
        console.log(error);
    }
}




const akisChart = async () =>{
    const ctxNakitAkis = document.getElementById('nakit_akis_grafik');
// ctxNakitAkis.width = "100%";
// ctxNakitAkis.height = "100%";
new Chart(ctxNakitAkis, {
  type: 'line',
  data: {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Hazira', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    datasets: [{
      label: 'Giriş',
      borderColor: "#2aa5eb",
      data: incomeArray,
      borderWidth: 2,
      fill: true,
      backgroundColor: "#2aa4eb36"
    }, {
      label: 'Çıkış',
      borderColor: "#808080",
      data: expensesArray,
      borderWidth: 2,
      fill: true,
      backgroundColor: "#80808048"
    }
    ],
  },
  options: {
    responsive: false, 
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 5,
        left: 20 // Grafiğin sol kenarı ile başlık arasında 20 piksel boşluk bırakır
      }
    },
    elements: {
      point: {
        pointStyle: 'circle',
        radius: 1,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'yellow'
      },
      line: {
        borderWidth: 5,
        borderColor: 'blue',
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Nakit Akışı',
        position: 'top',
        color: 'black',
        align: 'start',
        font: {
          family: 'Arial',
          size: 18,
          style: 'normal',
          lineHeight: 1.2
        }
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
});
}
const karZararChart = async () =>{
    var karZarar = incomeArray.map((item, index) => item - expensesArray[index]);
    var ctx = document.getElementById('kar_zarar_grafik').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {

        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Hazira', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        datasets: [{
        label: 'Kar-Zarar',
        data: karZarar, // Kar-Zarar verileri
        backgroundColor: karZarar.map(value => value >= 0 ? '#005eff' : '#808080'),
        //borderColor: karZarar.map(value => value >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 10
        }]
    },
    options: {
      responsive: false, 
      maintainAspectRatio: false,
        layout: {
        padding: 20
        },
        plugins: {
        title: {
            display: true,
            text: 'Kar & Zarar',
            position: 'top',
            color: 'black',
            align: 'start',
            font: {
            family: 'Arial',
            size: 18,
            style: 'normal',
            lineHeight: 1.2
            }
        },
        legend: {
            display: true,
            position: 'bottom',
        },
        },
        scales: {

        }
    }
    });
}
const gelirAylikChart = async (incomeWidth, fullIncomes) =>{
    const response = await apiFunctions("project" , "GET");
    console.log(response)
    let totalWidth = 0;
    response.forEach((project) => {
        let projeGelir = project.Cost_NotIncludingKDV || 0;
        totalWidth += projeGelir;
    })
    const alisOdenenSpan = document.querySelector("#alis_odenen");
    alisOdenenSpan.textContent = formatNumber(incomeWidth,2);
    const alisKalanSpan = document.querySelector("#alis_kalan");
    alisKalanSpan.textContent = formatNumber((totalWidth - fullIncome),2);
    var counter = 0;
    if (counter == 0) {
      j = 1;
      var elem = document.querySelector(".progress-done2");
      var width = 0;
      let percent ;
      if(((incomeWidth / totalWidth) * 100)){
        percent = (incomeWidth / totalWidth) * 100;       
      }else{
        percent = 0;
      }
      var main = setInterval(frame, 1);
      function frame() {
        if (width >= percent) {
          clearInterval(main);
        } else {
          width++;
          elem.style.width = width + "%";
          elem.innerHTML = width + "%";
        }
      }
    }  
}
const giderAylikChart = async (expensesWidth, fullExpens) =>{
  const response = await apiFunctions("project" , "GET");
  //console.log(response)
  let totalWidth = 0;
  response.forEach((project) => {
      let projeGelir = project.CalculatedCost_NotIncludingKDV || 0;
      totalWidth += projeGelir;
  })
  const alisOdenenSpan = document.querySelector("#veris_odenen");
  alisOdenenSpan.textContent = formatNumber(expensesWidth,2);
  const alisKalanSpan = document.querySelector("#veris_kalan");
  alisKalanSpan.textContent = formatNumber((totalWidth - fullExpenses),2);
  var counter = 0;
  if (counter == 0) {
    j = 1;
    var elem = document.querySelector(".progress-done");
    var width = 0;
    let percent ;
      if(((expensesWidth / totalWidth) * 100)){
        percent = (expensesWidth / totalWidth) * 100;       
      }else{
        percent = 0;
      }
    var main = setInterval(frame, 1);
    function frame() {
      if (width >= percent) {
        clearInterval(main);
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
      }
    }
  }  
}
const giderDetayChart = async ()=>{
  
  const ctxHarcama = document.getElementById('harcama_grafik');
  new Chart(ctxHarcama, {
    type: 'doughnut',
    data: {     
      datasets: [{
        label: 'My First Dataset',
        data: [enYuksek4[0][1], enYuksek4[1][1], enYuksek4[2][1], enYuksek4[3][1], digerToplam],
        backgroundColor: [
          '#696969',
          '#808080',
          '#A9A9A9',
          '#C0C0C0',
          '#D3D3D3'
        ],
        hoverOffset: 4,
        borderColor: 'transparent'
      }]
    },
    options: {
      responsive: false, 
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 5,
          left: 20
        }
      },
      elements: {
        point: {
          pointStyle: 'circle',
          radius: 1,
          borderWidth: 1,
          borderColor: 'red',
          backgroundColor: 'yellow'
        },
        line: {
          borderWidth: 5,
          borderColor: 'blue',
        }
      },
      plugins: {
        title: {
          display: false,
          text: 'Nakit Akışı',
          position: 'top',
          color: 'black',
          align: 'start',
          font: {
            family: 'Arial',
            size: 18,
            style: 'normal',
            lineHeight: 1.2
          }
        },
        legend: {
          display: true,
          position: 'bottom',
        },
      },

      scales: {
        y: {
          display: false,
        },
        x: {
          display: false,
        }
      }
    }
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
    "#left-menu-nav"
  );
  if (window.innerWidth <= 767 && !leftMenuNav.contains(event.target)) {
    leftMenu.style.display = "none";
  }
});