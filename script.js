// Начальные данные шрифтов
const initialFonts = [
    {
        name: 'Lightning Script',
        description: 'Красивый рукописный шрифт для творческих проектов.',
        link: 'https://www.creativefabrica.com/product/lightning-script/',
        category: 'handwritten',
        image: 'https://via.placeholder.com/300x150?text=Lightning+Script'
    },
    {
        name: 'Loving',
        description: 'Элегантный шрифт для заголовков и романтических дизайнов.',
        link: 'https://www.creativefabrica.com/product/loving/',
        category: 'decorative',
        image: 'https://via.placeholder.com/300x150?text=Loving'
    }
];

// Функция для добавления шрифта в список
function addFontToList(font) {
    const fontCard = document.createElement('div');
    fontCard.classList.add('font-card');
    fontCard.dataset.category = font.category;

    const img = document.createElement('img');
    img.src = font.image;
    fontCard.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = font.name;
    fontCard.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = font.description;
    fontCard.appendChild(desc);

    const link = document.createElement('a');
    link.href = font.link;
    link.textContent = 'Скачать шрифт';
    link.target = '_blank';
    fontCard.appendChild(link);

    document.getElementById('fontList').appendChild(fontCard);
}

// Загрузка шрифтов из localStorage или начальных данных
function loadFonts() {
    const fonts = JSON.parse(localStorage.getItem('fonts')) || initialFonts;
    fonts.forEach(font => addFontToList(font));
}

// Фильтрация по категориям
function filterFonts(category) {
    const fontCards = document.querySelectorAll('.font-card');
    fontCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Обработка главной страницы
if (document.getElementById('fontList')) {
    loadFonts();
    document.querySelectorAll('.category-list button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterFonts(category);
        });
    });
}

// Обработка админки
if (document.getElementById('fontForm')) {
    document.getElementById('fontForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const fontName = document.getElementById('fontName').value;
        const fontDescription = document.getElementById('fontDescription').value;
        const fontLink = document.getElementById('fontLink').value;
        const fontCategory = document.getElementById('fontCategory').value.toLowerCase();
        const fontImage = document.getElementById('fontImage').files[0];

        const reader = new FileReader();
        reader.onload = function(event) {
            const newFont = {
                name: fontName,
                description: fontDescription,
                link: fontLink,
                category: fontCategory,
                image: event.target.result
            };

            // Сохраняем в localStorage
            const fonts = JSON.parse(localStorage.getItem('fonts')) || initialFonts;
            fonts.push(newFont);
            localStorage.setItem('fonts', JSON.stringify(fonts));

            alert('Шрифт добавлен! Перейдите на главную, чтобы увидеть его.');
        };
        reader.readAsDataURL(fontImage);

        this.reset();
    });
}