document.getElementById('fontForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Получаем данные из формы
    const fontName = document.getElementById('fontName').value;
    const fontDescription = document.getElementById('fontDescription').value;
    const fontLink = document.getElementById('fontLink').value;
    const fontImage = document.getElementById('fontImage').files[0];

    // Создаем карточку шрифта
    const fontCard = document.createElement('div');
    fontCard.classList.add('font-card');

    // Добавляем изображение
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        fontCard.appendChild(img);

        // Добавляем название
        const title = document.createElement('h3');
        title.textContent = fontName;
        fontCard.appendChild(title);

        // Добавляем описание
        const description = document.createElement('p');
        description.textContent = fontDescription;
        fontCard.appendChild(description);

        // Добавляем ссылку
        const link = document.createElement('a');
        link.href = fontLink;
        link.textContent = 'Скачать шрифт';
        link.target = '_blank';
        fontCard.appendChild(link);

        // Добавляем карточку в список
        document.getElementById('fontList').appendChild(fontCard);
    };
    reader.readAsDataURL(fontImage);

    // Очищаем форму
    this.reset();
});