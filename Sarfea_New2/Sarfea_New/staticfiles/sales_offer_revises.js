
var numericCells = document.querySelectorAll(
    "#table td:nth-child(5), #table td:nth-child(6), #table td:nth-child(7), #table td:nth-child(8), #table td:nth-child(9), #table td:nth-child(10), #table td:nth-child(12), #table td:nth-child(13), #table td:nth-child(14), #table td:nth-child(15)"
  );
  var textCells = document.querySelectorAll(
    "#table td:nth-child(1), #table td:nth-child(2), #table td:nth-child(3), #table td:nth-child(4), #table td:nth-child(11), #table td:nth-child(16)"
  );



//                  TABLO FORMATLAMA

tableFormat(numericCells, "numeric");
tableFormat(textCells, "text");