//Создаем переменные главных действующих элементов
const svg_width = 600, svg_height = 600
const svg = init_svg(svg_width, svg_height);
const DOM_svg = document.getElementById('paint_feild');
const animate_checkbox = document.getElementById('toggle_animation');
const move_checkbox = document.getElementById('toggle_movement');

const animation_elements = [
    "draw_button",
    "animate_button",
    "animation_selector",
    "rd_to_label",
    "rd_to",
    "sx_to_label",
    "sx_to",
    "sy_to_label",
    "sy_to",
    "cx_to_label",
    "cx_to",
    "cy_to_label",
    "cy_to",
    "toggle_movement",
    "toggle_movement_label",
]

const movement_elements = [
    "movement",
    "coordinates",
    "scale",
    "rotate"
]

//Фунция инициализации svg окна для D3
function init_svg(width, height) {
    let feild = d3.select("svg")     
    .attr("width", width)     
    .attr("height", height);

    return feild
}


//Добавляем зарисовку смайлика по нажатию на SVG элемент
DOM_svg.addEventListener('click', function(event) {
    let rect = DOM_svg.getBoundingClientRect();
    let x = parseInt(event.clientX - rect.left);
    let y = parseInt(event.clientY - rect.top);
   
    let pict = drawSmile();
    pict.attr("transform", `translate(${x}, ${y})`);
});


//Функция изменения выидимости полей формы
function switch_visibility(element_ids) {
    element_ids.forEach(element_id => {
        let element = document.getElementById(element_id);
        if (element.hasAttribute('hidden')) {
            element.removeAttribute('hidden');
        } else {
            element.setAttribute('hidden', '');
        }
    })
}

function animation_visibility() {
    switch_visibility(animation_elements);
}

function movements_visibility() {
    switch_visibility(movement_elements);
}

//Добавляем сокрытие необходимых элементов в зависимости от состояния animate_checkbox
animate_checkbox.addEventListener("change", animation_visibility);
move_checkbox.addEventListener("change", movements_visibility)

//Функция рисования смайлика
function drawSmile() {     
    let smile = svg.append("g")         
    .style("stroke", "brown")         
    .style("stroke-width", 2)         
    .style("fill", "brown");  

    //лицо     
    smile.append("circle")          
    .attr("cx", 0)         
    .attr("cy", 0)         
    .attr("r", 50)         
    .style("fill", "yellow"); 

    //левый глаз        
    smile.append("circle")          
    .attr("cx", -20)         
    .attr("cy", -10)         
    .attr("r", 5);

    //правый глаз     
    smile.append("circle")          
    .attr("cx", 20)         
    .attr("cy", -10)         
    .attr("r", 5);     
    
    // улыбка     
    let arc = d3.arc()        
    .innerRadius(35)        
    .outerRadius(35);   

    smile.append("path")        
    .attr("d", arc({
        startAngle: Math.PI /3 * 2,                         
        endAngle: Math.PI/3 * 4
    }))        
    .style("stroke", "brown")       
    
    return smile   
}     


//Функция добавления нового смайлика в SVG, применяя к нему транфсформацию
function draw (dataForm) { 
    console.log("DEBUG: Создание нового изображения");
    let new_pict = drawSmile();
    let transform_string = `translate(
                                ${parseInt(dataForm.cx_from.value) + 300},
                                ${parseInt(dataForm.cy_from.value)*-1 + 300}
                            )  
                            scale(${dataForm.sx_from.value}, ${dataForm.sy_from.value})  
                            rotate(${dataForm.rd_from.value})`;
    console.log(transform_string);
    new_pict.attr("transform", transform_string); 
} 


//Функция очистки SVG и полей формы
function clear_svg(dataForm) {
    console.log("DEBUG: Очистка SVG элемента и формы");
    console.log(dataForm);
    dataForm.reset();
    let selector = document.getElementById("animation_selector");
    if (!selector.hasAttribute('hidden')) {
        animation_visibility();
    }
    let movement = document.getElementById("movement");
    if (!movement.hasAttribute("hidden")) {
        movements_visibility();
    }
    svg.selectAll("*").remove();
}


//Функция создает путь по букве Г
function createPathLetter() { 
    let data = []; 
    const padding = 150; 
    let posX = 150; 
    let posY = 450; 
    const h = 5; 
    while (posY > padding) { 
        data.push({x: posX, y: posY}); 
        posY -= h; 
    }        
    while (posX < svg_width - padding) {         
        data.push( {x: posX, y: posY});         
        posX += h;     
    }

    return data;
} 


//Функция создает путь по кругу
function createPathCircle() {     
    const data = [];
    for (let angle = 0; angle < 2 * Math.PI + 0.1; angle += 0.1) {
        const posX = 200 * Math.cos(angle);
        const posY = 200 * Math.sin(angle);
        data.push({x: posX + 300, y: posY + 300});
    }
    return data;
}


//функция рисует путь по точкам
function drawPath(points) {         
    const line = d3.line()         
    .x((d) => d.x)         
    .y((d) => d.y);      
   
    const path = svg.append('path')         
    .attr('d', line(points))         
    .attr('stroke', 'none')         
    .attr('fill', 'none'); 

    return path;     
} 


//Функция трансляции пути
function translateAlong(path_node) {
    const length = path_node.getTotalLength(); 
    return function() {
        return function(t) { 
            const {x, y} = path_node.getPointAtLength(t * length); 
            return `translate(${x},${y})`; 
        } 
    }
}
    

//Функция анимационной отрисовки
function run_animation(dataForm) {
    console.log("DEBUG: Создание новой анимации")
    let animations = {
        "linear": d3.easeLinear,
        "bounce": d3.easeBounce,
        "elastic": d3.easeElastic,
    }
    let path_points = {
        "letter": createPathLetter,
        "circle": createPathCircle,
    }
    let new_pict = drawSmile();

    if (move_checkbox.checked) {
        path = drawPath(path_points[dataForm.movement_selector.value]())
        new_pict.transition() 
        .duration(3000) 
        .ease(animations[dataForm.animation_selector.value]) 
        .attrTween('transform', translateAlong(path.node())); 
    } else {
        new_pict.attr(
            "transform", 
            `translate(
                ${parseInt(dataForm.cx_from.value) + 300},
                ${parseInt(dataForm.cy_from.value)*-1 + 300}
            ) 
            scale(${dataForm.sx_from.value}, ${dataForm.sy_from.value})  
            rotate(${dataForm.rd_from.value})`
        ) 
        .transition() 
        .duration(3000) 
        .ease(animations[dataForm.animation_selector.value]) 
        .attr(
            "transform",  
            `translate(
                ${parseInt(dataForm.cx_to.value) + 300},
                ${parseInt(dataForm.cy_to.value)*-1 + 300}
            ) 
            scale(${dataForm.sx_to.value}, ${dataForm.sy_to.value})  
            rotate(${dataForm.rd_to.value})`
        );
    }
}
