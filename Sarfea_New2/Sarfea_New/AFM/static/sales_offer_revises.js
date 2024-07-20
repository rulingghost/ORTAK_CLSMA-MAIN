
var numericCells = document.querySelectorAll(
    "#sales_revize_table td:nth-child(5), #sales_revize_table td:nth-child(6)"
  );
  var textCells = document.querySelectorAll(
    "#sales_revize_table td:nth-child(1), #sales_revize_table td:nth-child(2), #sales_revize_table td:nth-child(3), #table td:nth-child(4), #sales_revize_table td:nth-child(11), #sales_revize_table td:nth-child(16)"
  );
  var usdCells = document.querySelectorAll(
    "#sales_revize_table td:nth-child(7), #sales_revize_table td:nth-child(8), #sales_revize_table td:nth-child(9), #sales_revize_table td:nth-child(10), #sales_revize_table td:nth-child(12), #sales_revize_table td:nth-child(13), #sales_revize_table td:nth-child(14), #sales_revize_table td:nth-child(15)"
  );


//                  TABLO FORMATLAMA

tableFormat(numericCells, "numeric");
tableFormat(textCells, "text");
tableFormat(usdCells, "usd");