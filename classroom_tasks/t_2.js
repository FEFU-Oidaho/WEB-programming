function change_page(element_id) {
    var element = document.getElementById(element_id);
    var tag = element.nodeName;

    var target_elements = document.getElementsByTagName(tag);
    for (let i = 0; i < target_elements.length; i++) {
        if (target_elements[i] != element) {
            if (target_elements[i].firstElementChild == null) {
                let neighbor = target_elements[i].previousElementSibling || target_elements[i].nextElementSibling;
                if (neighbor) {
                    target_elements[i].innerHTML += " - " + neighbor.innerHTML;
                }
            }
        }
    }
}

change_page("test")