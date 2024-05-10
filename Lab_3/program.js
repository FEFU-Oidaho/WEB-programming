let correspond = {     
    "Название": "structure",     
    "Тип": "category",     
    "Страна": "country",     
    "Город": "city",     
    "Год": ["yearFrom", "yearTo"],     
    "Высота": ["heightFrom", "heightTo"] 
} 

let clearTable = (idTable) => {
    let table = document.getElementById(idTable);
    while (table.rows.length) {
        table.deleteRow(0);
    }
}

let createTable = (data, idTable) => { 
    let table = document.getElementById(idTable); 

    let tr = document.createElement('tr'); 
    for(key in data[0]) { 
        let th = document.createElement('th'); 
        th.innerHTML = key; 
        tr.append(th); 
    } 
    table.append(tr);  

    data.forEach((item) => { 
        let tr = document.createElement('tr'); 
        for(key in item) { 
            let td = document.createElement('td'); 
            td.innerHTML = item[key]; 
            tr.append(td); 
        } 
        table.append(tr);
    });  
}

document.addEventListener("DOMContentLoaded", function() {
    createTable(buildings, 'list'); 
}) 

let dataFilter = (dataForm) => {          
    let dictFilter = {};     
    // перебираем все элементы формы с фильтрами          
    for(let j = 0; j < dataForm.elements.length; j++) {                
        let item = dataForm.elements[j];                          
        let valInput = item.value;               
        if (item.type == "text") {             
            valInput = valInput.toLowerCase();         
        }
        
        if (item.type == "number") {
            if (valInput) {
                valInput = parseFloat(valInput)
            } else {
                if (item.id.includes("From")){
                    valInput = -9e15
                } else if (item.id.includes("To")) {
                    valInput = 9e15
                }
            }
        }            
       dictFilter[item.id] = valInput;     
    }            
    return dictFilter; 
}

let filterTable = (idTable, dataForm) =>{           
    let datafilter = dataFilter(dataForm);    
    let tableFilter = buildings.filter(item => {                  
        let result = true;                          
        for(let key in item) {                          
            let val = item[key];                                       
            if (typeof val == 'string') {                 
                val = val.toLowerCase()                  
                result &&= val.indexOf(datafilter[correspond[key]]) !== -1              
            } else if (typeof val == 'number') {
                let interval = correspond[key];
                result &&= datafilter[interval[0]] < val && val < datafilter[interval[1]];
            }         
        }          
        return result;     
    });           
    clearTable(idTable);    
    createTable(tableFilter, idTable);   
} 


let clearFilter = (idTable, dataForm) => {
    dataForm.reset();
    clearTable(idTable);    
    createTable(buildings, idTable)
}