


getAndRenderList();

async function getAndRenderList(){
    try{
        const response = await fetch('/get_operation_care/');
        
        const data = await response.json();
        const inventors = data.operation_care;
        inventors.forEach(inventor => {
            console.log(inventor)
            if(inventor.id == 5){
                console.log("inventor")
                const tbody = document.querySelector('.inventor_table_body');
                tbody.innerHTML = '';
                for(let i=0; i < inventor.Operation_Care_Number_Str; i++){                  
                    
                        const row = '<tr>' +
                            '<td>' + (i+1) + '</td>' +
                            '<td>' + inventor.Operation_Care_Panel_Power + '</td>' +
                            '<td>' + inventor.Operation_Care_VOC + '</td>' +
                            '<td>' + inventor.Operation_Care_Panel_Brand + '</td>' +
                            '<td>' + inventor.Operation_Care_Panel_Number_Str + '</td>' +
                            '<td>   </td>' +
                            `<td>
                                <select>
                                    <option value="ok">OK</option>
                                    <option value="FAULT">FAULT</option>
                                </select>
                            </td>` +
                            `<td><input type="text" value="${inventor.Operation_Care_Capacity}"></td>` +
                            `<td><input type="text" value="${inventor.Operation_Care_AC_Power}"></td>` +
                            `<td><input type="text" value="${inventor.Operation_Care_DC_Power}"></td>` +
                            '</tr>';
                        tbody.insertAdjacentHTML('beforeend', row);
                                   
                }                
            }
        });
       
    }catch(event){
        console.log(event)
    }
}