
const reportTable = document.querySelector("#report_table")
const reportTableBody = reportTable.querySelector("tbody")


getReports()
async function getReports() {
    try {
      let currentRows = reportTableBody.querySelectorAll("tr");
      var projectData = await apiFunctions("project", "GET");
      console.log("projeler");
      console.log(projectData);
      let rows = "";
      for (const project of projectData) {
        let totalIncome = 0;
        let totalExpense = 0;
        project.project_expenses.forEach(element => {
            totalExpense += parseFloat(element.Amount_USD_Expenses);           
        });
        project.project_incomes.forEach(element => {
            totalIncome += parseFloat(element.Amount_Usd_Incomes);           
        });
        console.log(totalExpense);
        console.log("----");
        const row = `
                  <tr>                      
                      <td data-label="Projeler">${project.ProjectName}</td>
                      <td data-label="Anlaşılan">${formatNumber(project.Cost_NotIncludingKDV, 2)}</td>
                      <td data-label="Alınan">${formatNumber(totalIncome, 2)}</td>
                      <td data-label="Ödenen">${formatNumber(totalExpense, 2)}</td>
                      <td data-label="Ödenmesi Gerekn Borç">${formatNumber(project.CalculatedCost_NotIncludingKDV - totalExpense, 2)}</td>
                      <td data-label="Genel Kalan">${formatNumber(project.Cost_NotIncludingKDV - totalIncome, 2)}</td>
                      <td data-label="Harcama Cari Durum">${formatNumber(totalIncome - totalExpense)}</td>
                      <td data-label="KDV İadesi">${formatNumber(project.Cost_NotIncludingKDV * 0.2 * 0.75 , 2)}</td>
                      <td data-label="KDV İadesi Hariç Kar">${formatNumber(project.Cost_NotIncludingKDV - totalExpense)}</td>
                      <td data-label="KDV İadesi Dahil Kar">${formatNumber((project.Cost_NotIncludingKDV - totalExpense) + (project.Cost_NotIncludingKDV * 0.2 * 0.75))}</td>
                  </tr>
              `;
        rows += row;
      }
      if (projectData.length > currentRows.length) {
        reportTableBody.innerHTML = "";
        reportTableBody.insertAdjacentHTML("beforeend", rows);        
        sortTableForStart(reportTable, 1);
        sortingTable(reportTable);
      }
    } catch (error) {
      console.error("Error fetching and rendering clients:", error);
    }
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