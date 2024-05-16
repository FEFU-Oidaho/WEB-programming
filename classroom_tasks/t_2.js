function change_page(element_id) {
    var element = document.getElementById(element_id);
    var save = element.innerHTML;
    var tag = element.nodeName;

    var target_elements = document.getElementsByTagName(tag);
    for (let i = 0; i < target_elements.length; i++) {
        alert(!target_elements[i].children)
        if (!target_elements[i].children) {
            alert(1)
            let neighbor = target_elements[i].previousSibling;
            if (neighbor) {
                target_elements[i].innerHTML += neighbor.innerHTML;
            } else {
                let neighbor = target_elements[i].nextsibling;
                if (neighbor) {
                    target_elements[i].innerHTML += neighbor.innerHTML;
                }
            }
        }
    }

    element.innerHTML = save;
}

change_page("test")