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

let sort_data = (data, key, direction) => {
    let sorted = data.sort((a, b) => {
        if (direction === 'asc') {
            return a[key] - b[key];
        } else if (direction === 'desc') {
            return b[key] - a[key];
        }
    });

    return sorted;
}

let sort_table = (dataForm) => {

    I_key = dataForm.I_name.value
    I_direction = dataForm.I_reverse.checked ? 'desc' : 'asc';
    alert(I_key)
    alert(I_direction)
    if (I_key != "НЕТ") {
        local_data = sort_data(local_data, I_key, I_direction);
    }

    II_key = dataForm.II_name.value
    II_direction = dataForm.II_reverse.checked ? 'desc' : 'asc';
    if (I_key != "НЕТ") {
        local_data = sort_data(local_data, II_key, II_direction);
    }

    III_key = dataForm.III_name.value
    III_direction = dataForm.III_reverse.checked ? 'desc' : 'asc';
    if (I_key != "НЕТ") {
        local_data = sort_data(local_data, III_key, III_direction);
    }

    rebuild_table(local_data);
}


// ГРАФИК ---------------------------------------

function create_popup() {
    // Создаем элемент для выплывающего окна
    let popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '900';
    popup.style.height = '600';
    popup.style.backgroundColor = 'white';
    popup.style.border = '3px solid black'
    popup.style.borderRadius = '20px';
    popup.style.zIndex = '1000';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

    // Создаем элемент для закрытия окна
    let closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'Закрыть';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.onclick = () => document.body.removeChild(popup);

    // Создаем SVG элемент для графика
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // Добавляем SVG элемент и кнопку закрытия в окно
    popup.appendChild(closeBtn);
    popup.appendChild(svg);

    return [popup, svg]
}

function draw_graph(dataForm) {
    var [popup_window, popup_svg] = create_popup()

    popup_svg = d3.select(popup_svg)
        .attr("height", 600)             
        .attr("width", 900);
    popup_svg.selectAll('*').remove(); 

    // значения по оси ОХ         
    const keyX = dataForm.ox.value;

    // значения по оси ОУ     
    const keyYSpeed = dataForm.oy[0].checked;
    const keyYCaliber = dataForm.oy[1].checked;
    const keyYAmmo = dataForm.oy[2].checked;

    // создаем массив для построения графика    
    const arrGraph = createArrGraph(local_data, keyX);  

    // создаем шкалы преобразования и выводим оси  
    const [scX, scY] = createAxis(popup_svg, arrGraph, keyYSpeed, keyYCaliber, keyYAmmo); 

    if (keyYSpeed) {
        createChart(popup_svg, arrGraph, scX, scY, 0, "red"); 
    }

    if (keyYCaliber) {
        createChart(popup_svg, arrGraph, scX, scY, 1, "green");
    }

    if (keyYAmmo) {
        createChart(popup_svg, arrGraph, scX, scY, 2, "blue");
    } 

    document.body.appendChild(popup_window);
}

function createArrGraph(data, key) {
    return data.map(item => ({
        labelX: item[key],
        values: [
            item["Макс. скорость (км/ч)"],
            item["Калибр (мм)"],
            item["Боекомплект (шт.)"]
        ]
    }));
}

// ВАРИАНТ С ИСПОЛЬЗОВАНИЕМ D3
// function createArrGraph(data, key) {
//     return d3.groups(data, d => d[key])
//         .map(([labelX, entries]) => ({
//             labelX,
//             values: [
//                 entries[0]["Макс. скорость (км/ч)"],
//                 entries[0]["Калибр (мм)"],
//                 entries[0]["Боекомплект (шт.)"]
//             ]
//         }));
// }

function createAxis(svg, data, ...creds){      
    var min;
    var max;

    for (let i = 0; i < creds.length; i++) {
        if (creds[i]) {
            local = data.map(item => item["values"][i]);
            if (min && max) {
                local.push(min);
                local.push(max);
            }
            min = Math.min(...local);
            max = Math.max(...local);
        }
    }


    // функция интерполяции значений на оси      
    let scaleX = d3.scaleBand()                     
        .domain(data.map(d => d.labelX))                     
        .range([0, 900 - 2 * 50]);                           
    let scaleY = d3.scaleLinear()                     
        .domain([min * 0.85, max * 1.1 ])                     
        .range([600 - 2 * 50, 0]);

    // создание осей
    // горизонтальная   
    let axisX = d3.axisBottom(scaleX);
    // вертикальная      
    let axisY = d3.axisLeft(scaleY); 
    
    // отрисовка осей в SVG-элементе     
    svg.append("g")         
        .attr("transform", `translate(${50}, ${600 - 50})`)         
        .call(axisX)         
        .selectAll("text") // подписи на оси - наклонные         
        .style("text-anchor", "end")         
        .attr("dx", "-.8em")         
        .attr("dy", ".15em")         
        .attr("transform", d => "rotate(-45)");     

    svg.append("g")         
        .attr("transform", `translate(${50}, ${50})`)         
        .call(axisY);

    return [scaleX, scaleY] 
}


function createChart(svg, data, scaleX, scaleY, index, color) {  
    svg.selectAll(".dot")         
        .data(data)         
        .enter()         
        .append("circle")         
        .attr("r", 4) 
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2) 
        .attr("cy", d => scaleY(d.values[index])) 
        .attr("transform", `translate(${50}, ${50})`) 
        .style("fill", color) 
}
