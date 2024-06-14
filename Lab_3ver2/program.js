var table = document.getElementById("tth");
var local_data;

let clear_table = () => {
    while (table.rows.length) {
        table.deleteRow(0);
    }
}

let create_table_header = (data) => {
    let thead = document.createElement('thead')
    let tr = document.createElement('tr');
    tr.classList.add("tth-content-table-hat");
    for(key in data[0]) { 
        let th = document.createElement('th'); 
        th.innerHTML = key; 
        tr.append(th); 
    } 
    thead.append(tr);
    table.append(thead)
}

let create_table = (data) => {
    create_table_header(data);
    let tbody = document.createElement('tbody')
    data.forEach((item) => { 
        let tr = document.createElement('tr'); 
        for(key in item) { 
            let td = document.createElement('td'); 
            td.innerHTML = item[key]; 
            tr.append(td); 
        } 
        tbody.append(tr);
    });
    table.append(tbody)
}

let rebuild_table = (data) => {
    clear_table();
    create_table(data);
}

document.addEventListener("DOMContentLoaded", function() {
    local_data = technique;
    rebuild_table(local_data); 
}) 

let correspond = {     
    "Год выпуска": ["year_min", "year_max"],
    "Макс. скорость (км/ч)": ["speed_min", "speed_max"],
    "Боекомплект (шт.)":  ["ammo_min", "ammo_max"],
    "Экипаж (чел.)":  ["crew_min", "crew_max"],
} 

// ФИЛЬТР ДАННЫХ ----------------------------------------------------

let filter_data = (dataForm) => {          
    let dictFilter = {};     
    // перебираем все элементы формы с фильтрами          
    for(let j = 0; j < dataForm.elements.length; j++) {                
        let item = dataForm.elements[j];                          
        let valInput = item.value;               

        if (valInput) {
            valInput = parseFloat(valInput)
        } else {
            if (item.id.includes("min")){
                valInput = -9e15
            } else if (item.id.includes("max")) {
                valInput = 9e15
            }
        }          
       dictFilter[item.id] = valInput;     
    }            
    return dictFilter; 
}

let filter_table = (dataForm) =>{           
    let data_filter = filter_data(dataForm); 
    local_data = technique.filter(item => {                 
        let result = true;                          
        for(let key in item) {  
            if (Object.keys(correspond).includes(key)){                       
                let val = item[key];                                       
                let interval = correspond[key];
                result &&= data_filter[interval[0]] < val && val < data_filter[interval[1]];
            }
        }          
        return result;     
    });           

    rebuild_table(local_data);   
} 


let cancel_filter_table = (dataForm) => {
    dataForm.reset();
    local_data = technique;
    rebuild_table(local_data);
}

// СОРТИРОВКА ----------------------------------------------------

let sort_data = (data, keys) => {
    return data.sort((a, b) => {
        for (let key of keys) {
            let {name, direction} = key;
            let comparison = 0;
            if (typeof a[name] === 'string' && typeof b[name] === 'string') {
                comparison = a[name].localeCompare(b[name]);
            } else {
                comparison = a[name] - b[name];
            }

            if (direction === 'desc') {
                comparison *= -1;
            }

            if (comparison !== 0) {
                return comparison;
            }
        }
        return 0;
    });
}

let sort_table = (dataForm) => {
    let sort_keys = [];

    let I_key = dataForm.I_name.value;
    let I_direction = dataForm.I_reverse.checked ? 'desc' : 'asc';
    if (I_key !== "НЕТ") {
        sort_keys.push({name: I_key, direction: I_direction});
    }

    let II_key = dataForm.II_name.value;
    let II_direction = dataForm.II_reverse.checked ? 'desc' : 'asc';
    if (II_key !== "НЕТ") {
        sort_keys.push({name: II_key, direction: II_direction});
    }

    let III_key = dataForm.III_name.value;
    let III_direction = dataForm.III_reverse.checked ? 'desc' : 'asc';
    if (III_key !== "НЕТ") {
        sort_keys.push({name: III_key, direction: III_direction});
    }

    if (sort_keys.length > 0) {
        local_data = sort_data(local_data, sort_keys);
    }

    rebuild_table(local_data);
}