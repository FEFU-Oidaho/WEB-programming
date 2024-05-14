function calculate(data) {
    /* читаем данные */
    let a = data.input_base_big; /* Высота */
    let b = data.input_base_small; /* Высота */
    let optional = data.input_optional; /* Основание\высота */
    let optional_name = data.input_optional_name;  /* Что выбрано */

    filled = is_filled(a, b, optional);
    valid = is_valid(a, b);
    is_checked(data.calc_angles, data.calc_perimeter,data.calc_square);

    if (!valid || !filled) {
        return;
    }
    
    /* создаем ссылку на результирующее поле */
    let output = document.getElementById('output');
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    } 

    /* Вычислять углы? */
    calc_angles(
        data.calc_angles,
        output,
        parseInt(a.value),
        parseInt(b.value),
        parseInt(optional.value),
        String(optional_name.value)
    );

    /* Вычислять периметр? */
    calc_perimeter(
        data.calc_perimeter,
        output,
        parseInt(a.value),
        parseInt(b.value),
        parseInt(optional.value),
        String(optional_name.value)
    );

    /* Вычислять площадь? */
    calc_square(
        data.calc_square,
        output,
        parseInt(a.value),
        parseInt(b.value),
        parseInt(optional.value),
        String(optional_name.value)
    );
}

function change_color(element, color, property) {
    style_string = property + ':' + color + ';';
    element.setAttribute('style', style_string);
}

function change_visibility(...ids) {
    ids.forEach((id) => {
        let element = document.getElementById(id);
        if (element.hasAttribute("hidden")) {
            element.removeAttribute("hidden")
        } else {
            element.setAttribute("hidden", "")
        }
    })
}

function reset_visibility(...ids) {
    ids.forEach((id) => {
        if (id == "with_c") {
            element.setAttribute("hidden", "")
        }
        if (id == "with_h") {
            element.removeAttribute("hidden")
        }
    })
}

function is_checked(...elements) {
    let find_settings = document.getElementById("find_settings");
    if (!elements.some((element) => element.checked)) {
        change_color(find_settings, "red", "color");
    } else {
        change_color(find_settings, "black", "color");
    }
}

function is_filled(...elements) {
    var counter = 0;
    elements.forEach( element => {
        let color;
        if (!element.value) {
            color = "red";
            counter++;
        } else {
            color = "light-dark";
        }
        change_color(element, color, "border-color");
    })

    return !counter;
}

function is_valid(big_base, small_base) {
    let flag;
    let color;
    let a = parseInt(big_base.value);
    let b = parseInt(small_base.value);
    if (a >= b) {
        color = "light-dark";
        flag = true;
    } else {
        color = "red";
        flag = false;
    }

    change_color(big_base, color, "border-color");
    change_color(small_base, color, "border-color");

    return flag;
}

function calc_angles(checkbox, output, a, b, optional, optional_name) {
    if (checkbox.checked) {
        let answer_paragraph = document.createElement('p');
        let answer1 = 0;
        let answer2 = 0;
        if (optional_name === "height") {
            let c = (Math.sqrt((a-b)**2 + optional**2))
            answer1 = Math.asin(optional/c) * 180/Math.PI;
            answer2 = 180 - answer1;
        } else if (optional_name === "side") {
            let h = (Math.sqrt(optional**2 - (a-b)**2))
            answer1 = Math.asin(h/optional) * 180/Math.PI;
            answer2 = 180 - answer1;
        }
        answer_paragraph.innerHTML = "Угл AC: " + Math.round(answer1) + "<br>";
        answer_paragraph.innerHTML += "Угл BC: " + Math.round(answer2) + "<br>";
        answer_paragraph.innerHTML += "Углы HB и HA: 90";
        output.appendChild(answer_paragraph);
    }
}

function calc_perimeter(checkbox, output, a, b, optional, optional_name) {
    if (checkbox.checked) {
        let answer_paragraph = document.createElement('p');
        let answer = 0;
        if (optional_name === "height") {
            answer = a + b + (Math.sqrt((a-b)**2 + optional**2)) + optional;
        } else if (optional_name === "side") {
            answer = a + b + (Math.sqrt(optional**2 - (a-b)**2)) + optional;
        }
        answer_paragraph.innerHTML = "Периметр: " + Math.round(answer);
        output.appendChild(answer_paragraph);
    }
}

function calc_square(checkbox, output, a, b, optional, optional_name) {
    if (checkbox.checked) {
        let answer_paragraph = document.createElement('p');
        let answer = 0;
        if (optional_name === "height") {
            answer = a * optional - ((a-b)*optional/2);
        } else if (optional_name === "side") {
            let h = (Math.sqrt(optional**2 - (a-b)**2));
            answer = a * h - ((a-b)*h/2);
        }
        answer_paragraph.innerHTML = "Площадь: " + Math.round(answer);
        output.appendChild(answer_paragraph);
    }
}