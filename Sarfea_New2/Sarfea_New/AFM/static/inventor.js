


getAndRenderList();

async function getAndRenderList(){
    try{
        const data = await apiFunctions("inventor", "GET")
        console.log(data)
        //const inventors = data.operation_care;
        data.forEach(inventor => {
            console.log(inventor)
            let invIzolasyon ;
            if(inventor.id == 5){
                if(inventor.Inventor_Izolasion == "OK"){
                    invIzolasyon = "FAULT";
                }else{
                    invIzolasyon = "OK";
                }
                const tbody = document.querySelector('.inventor_table_body');
                tbody.innerHTML = '';
                for(let i=0; i < inventor.Inventor_Number_Str; i++){                  
                    
                        const row = '<tr>' +
                            '<td>' + (i+1) + '</td>' +
                            '<td>' + inventor.Inventor_Panel_Power + '</td>' +
                            '<td>' + inventor.Inventor_VOC + '</td>' +
                            '<td>' + inventor.Inventor_Panel_Brand + '</td>' +
                            '<td>' + inventor.Inventor_Number_Str + '</td>' +
                            '<td>   </td>' +
                            `<td>
                                <select>                                    
                                    <option value="${inventor.Inventor_Izolasion}">${inventor.Inventor_Izolasion}</option>
                                    <option value="${invIzolasyon}">${invIzolasyon}</option>
                                </select>
                            </td>` +
                            `<td><input type="text" value="${inventor.Inventor_Capacity}"></td>` +
                            `<td><input type="text" value="${inventor.Inventor_AC_Power}"></td>` +
                            `<td><input type="text" value="${inventor.Inventor_DC_Power}"></td>` +
                            '</tr>';
                        tbody.insertAdjacentHTML('beforeend', row);
                                   
                }                
            }
        });
       
    }catch(event){
        console.log(event)
    }
}