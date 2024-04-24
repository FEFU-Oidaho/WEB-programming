function calculate(data) {
    /* Проверяем, заполнены ли поля */
    if (!is_filled("input_optional", "input_base")) {
        return;
    }

    /* Валидируем данные */
    if (!is_valid("input_optional", "input_base")) {
        return;
    }

    /* Проверяем, выбрано ли желаемое */
    if (!is_smt_checked("calc_angles", "calc_perimeter", "calc_square")) {
        return;
    }

    /* читаем данные */
    let a = data.input_base.value; /* Высота */
    let optional_name = data.input_optional.value;  /* Что выбрано */
    let optional = data.input_optional.value; /* Основание\высота */

    /* создаем ссылку на результирующее поле */
    let output = document.getElementById('output');

    /* Вычислять углы? */
    calc_angles(
        data.calc_angles,
        output,
        a,
        optional,
        optional_name
    );

    /* Вычислять периметр? */
    calc_perimeter(
        data.calc_perimeter,
        output,
        a,
        optional,
        optional_name
    );

    /* Вычислять площадь? */
    calc_square(
        data.calc_square,
        output,
        a,
        optional,
        optional_name
    );
}

function change_border_color(element, color) {
    style_string = 'border-color:' + color + ';';
    element.setAttribute('style', style_string);
}

function is_filled(...field_ids) {
    var counter = 0;
    field_ids.forEach( field_id => {
        let content = document.getElementById(field_id);
        let color;
        if (!content.value) {
            color = "red";
            counter++;
        } else {
            color = "light-dark";
        }
        change_border_color(content, color);
    })

    return !counter;
}

function is_valid(...field_ids) {
    var counter = 0;
    field_ids.forEach( field_id => {
        let content = document.getElementById(field_id);
        let color;
        if (!(parseInt(content.value) || parseFloat(content.value))) {
            color = "red";
            counter++;
        } else {
            color = "light-dark";
        }
        change_border_color(content, color);
    })

    return !counter;
}

/* TODO: Неработает, фикс */
function is_smt_checked(...field_ids) {
    var counter = field_ids.length();
    field_ids.forEach( field_id => {
        let checkbox = document.getElementById(field_id);
        if (!checkbox.checked) { counter--; }
    })

    field_ids.forEach( field_id => {
        let checkbox = document.getElementById(field_id);
        let color;
        if (!counter) {
            color = "red";
        } else {
            color = "light-dark";
        }
        change_border_color(checkbox, color);
    })

    return counter;
}

function calc_angles(checkbox, output, a, optional, optional_name) {
    if (checkbox.checked) {
        let answer = document.createElement('p');
        answer.innerHTML = "1";
        output.appendChild(answer);
    }

    return false;
}

function calc_perimeter(checkbox, output, a, optional, optional_name) {
    if (checkbox.checked) {
        let answer = document.createElement('p');
        answer.innerHTML = "2";
        output.appendChild(answer);
    }

    return false;
}

function calc_square(checkbox, output, a, optional, optional_name) {
    if (checkbox.checked) {
        let answer = document.createElement('p');
        answer.innerHTML = "3";
        output.appendChild(answer);
    }

    return false;
}