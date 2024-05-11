const marginX = 50; 
const marginY = 50; 
const height = 400; 
const width = 800;  

let svg = d3.select("svg")             
.attr("height", height)             
.attr("width", width);

function drawGraph(data) {

    let graph_type = {
        "dot": createDotChart,
        "column": createColumnChart,
    }
    // Очищаем SVG
    svg.selectAll('*').remove();  
    // значения по оси ОХ         
    const keyX = data.ox.value;   
    // значения по оси ОУ     
    const isMin = data.oy[1].checked;     
    const isMax = data.oy[0].checked; 
    if (!(isMax || isMin)) {
        display_error();
        return
    }         
    // создаем массив для построения графика    
    const arrGraph = createArrGraph(buildings, keyX);                       
    // создаем шкалы преобразования и выводим оси  
    const [scX, scY] = createAxis(arrGraph, isMin, isMax);          
    // рисуем графики       
    if (isMin) {         
        graph_type[data.graph_type.value](arrGraph, scX, scY, 0, "blue");     
    }     
    if (isMax) {         
        graph_type[data.graph_type.value](arrGraph, scX, scY, 1, "red");        
    }      
} 

function display_error() {
    svg.append("text")
    .attr("x", 0)
    .attr("y", width/10)
    .style("fill", "red") // Устанавливаем цвет
    .style("font-size", `${width/10}px`) // Устанавливаем размер шрифта
    .text("ERROR");
}

function createAxis(data, isFirst, isSecond){      
    // в зависимости от выбранных пользователем данных по OY      
    // находим интервал значений по оси OY     
    let firstRange = d3.extent(data.map(d => d.values[0]));     
    let secondRange = d3.extent(data.map(d => d.values[1]));
    let min;
    let max;
    if (isFirst && !isSecond) {
        alert(1);
        min = firstRange[0];     
        max = firstRange[firstRange.length - 1]; 
    } else if (isSecond && !isFirst) {
        alert(2);
        min = secondRange[0];     
        max = secondRange[secondRange.length - 1];
    } else {
        alert(3);
        min = firstRange[0];     
        max = secondRange[1]; 
    }    
    // функция интерполяции значений на оси      
    let scaleX = d3.scaleBand()                     
    .domain(data.map(d => d.labelX))                     
    .range([0, width - 2 * marginX]);                           
    let scaleY = d3.scaleLinear()                     
    .domain([min * 0.85, max * 1.1 ])                     
    .range([height - 2 * marginY, 0]);                           
    // создание осей     
    let axisX = d3.axisBottom(scaleX); 
    // горизонтальная      
    let axisY = d3.axisLeft(scaleY); 
    // вертикальная      
    // отрисовка осей в SVG-элементе     
    svg.append("g")         
    .attr("transform", `translate(${marginX}, ${height - marginY})`)         
    .call(axisX)         
    .selectAll("text") // подписи на оси - наклонные         
    .style("text-anchor", "end")         
    .attr("dx", "-.8em")         
    .attr("dy", ".15em")         
    .attr("transform", d => "rotate(-45)");          
    svg.append("g")         
    .attr("transform", `translate(${marginX}, ${marginY})`)         
    .call(axisY);              
    return [scaleX, scaleY] 
}


function createDotChart(data, scaleX, scaleY, index, color) {  
    const r = 4     
    // чтобы точки не накладывались, сдвинем их по вертикали     
    let ident = (index == 0)? -r / 2 : r / 2;          
    svg.selectAll(".dot")         
    .data(data)         
    .enter()         
    .append("circle")         
    .attr("r", r) 
    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2) 
    .attr("cy", d => scaleY(d.values[index]) + ident) 
    .attr("transform", `translate(${marginX}, ${marginY})`) 
    .style("fill", color) 
}


function createColumnChart(data, scaleX, scaleY, index, color) {  
    const w = 8     
    // чтобы столбцы не накладывались, сдвинем их по горизонтали     
    let ident = (index == 0)? -w / 4 : w / 4;          
    svg.selectAll(".dot")         
    .data(data)         
    .enter()         
    .append("rect")         
    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + ident) 
    .attr("y", d => scaleY(d.values[index]))
    .attr("width", w)
    .attr("height", d => (height - scaleY(d.values[index]) - marginY*2))
    .attr("transform", `translate(${marginX}, ${marginY})`) 
    .style("fill", color) 
}

function createArrGraph(data, key) {
    return d3.groups(data, d => d[key])
    .map(([labelX, entry]) => ({labelX, values: d3.extent(entry.map(d => d.Высота))}));
}


d3.select("#showTable") 
.on ('click', function() {     
    let buttonValue = d3.select(this);          
    if (buttonValue.property("value") === "Показать таблицу") {                  
        buttonValue.attr("value", "Скрыть таблицу");                              
        let table = d3.select("div.table")             
        .select("table")

        let thead = table.append("thead")
        let tr = thead.append("tr") 
        for(key in buildings[0]) { 
            tr.append('th').text(key); 
        } 

        let tbody = table.append("tbody")
        buildings.forEach((item) => { 
            let tr = tbody.append("tr"); 
            for(key in item) { 
                tr.append("td").text(item[key])
            } 
        });

     } else {          
        buttonValue.attr("value", "Показать таблицу");                  
        d3.select("div.table")         
        .select("table")
        .selectAll("tr, td, th")
        .remove()
    } 
});

d3.select(window).on("load", function() {
    console.log("DEBUG: Документ загружен")
    let form = d3.select("#graph_settings");
    drawGraph(form.node())
});