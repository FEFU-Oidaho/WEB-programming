function CheckPage(languages) {
    const menuDiv = d3.select('.menu');
    const existingLangs = menuDiv.selectAll('a').nodes().map(link => link.textContent);
    const newLanguages = languages.filter(language => !existingLangs.includes(language));

    menuDiv.selectAll('a.new')
        .data(newLanguages)
        .enter()
        .append('a')
        .attr('href', '#') // Можно заменить на реальные ссылки
        .text(d => d)
}