let func = (...strings) => {
    var result_string = "";
    strings.forEach((str) => {
        words_and_numbers = str.split(" ").forEach((part) => {
            if (!isNaN(part)) {
                if (part.length == 1) {
                    result_string += part + " ";
                }
                let numbers = part.split('').map(Number);
                numbers = new Set(numbers);
                if (numbers.size !== part.length) {
                    result_string += part + " ";
                }
            }
        })
    });
    return result_string;
}

alert(func(
    "124 111  2256 351 afwf 1 true false 6 a11b 11ab",
    "awfj wafgkmaw 22 1 99 667"
))

alert("1".split(""))