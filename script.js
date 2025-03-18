// Initial font data
const initialFonts = [
    {
        name: 'Lightning Script',
        description: 'A beautiful handwritten font for creative projects.',
        link: 'https://www.creativefabrica.com/product/lightning-script/',
        category: 'handwritten',
        image: 'https://via.placeholder.com/300x150?text=Lightning+Script'
    },
    {
        name: 'Loving',
        description: 'An elegant font for headlines and romantic designs.',
        link: 'https://www.creativefabrica.com/product/loving/',
        category: 'decorative',
        image: 'https://via.placeholder.com/300x150?text=Loving'
    }
];

// Hardcoded admin password
const ADMIN_PASSWORD = '27228771010';

// Load fonts from localStorage or use initial data
function loadFonts() {
    return JSON.parse(localStorage.getItem('fonts')) || initialFonts;
}

// Save fonts to localStorage
function saveFonts(fonts) {
    localStorage.setItem('fonts', JSON.stringify(fonts));
}

// Add font to the list (for main page)
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
    link.textContent = 'Download Font';
    link.target = '_blank';
    fontCard.appendChild(link);

    document.getElementById('fontList').appendChild(fontCard);
}

// Load categories dynamically (for main page)
function loadCategoriesMain() {
    const fonts = loadFonts();
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '<button data-category="all">All</button>'; // Reset to "All" button
    const categories = [...new Set(fonts.map(font => font.category))];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.dataset.category = category;
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        button.addEventListener('click', () => filterFonts(category));
        categoryList.appendChild(button);
    });
}

// Filter fonts by category
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

// Main page logic
if (document.getElementById('fontList')) {
    function refreshMainPage() {
        document.getElementById('fontList').innerHTML = ''; // Clear current fonts
        const fonts = loadFonts();
        fonts.forEach(font => addFontToList(font));
        loadCategoriesMain();
    }

    // Initial load
    refreshMainPage();

    // Periodically check for updates every 5 seconds
    setInterval(() => {
        const currentFonts = JSON.stringify(loadFonts());
        const previousFonts = JSON.stringify(document.currentFonts || []);
        if (currentFonts !== previousFonts) {
            refreshMainPage();
            document.currentFonts = loadFonts(); // Store current state
        }
    }, 5000);

    document.querySelectorAll('.category-list button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterFonts(category);
        });
    });
}

// Admin page logic
if (document.getElementById('fontForm')) {
    // Password check
    window.checkPassword = function() {
        const password = document.getElementById('adminPassword').value;
        if (password === ADMIN_PASSWORD) {
            document.getElementById('passwordPrompt').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            loadCategories();
            loadDeleteList();
            loadCategoryDeleteList();
        } else {
            alert('Incorrect password!');
        }
    };

    // Load categories into select (admin)
    function loadCategories() {
        const fonts = loadFonts();
        const categorySelect = document.getElementById('fontCategory');
        const categories = [...new Set(fonts.map(font => font.category))];
        
        categorySelect.innerHTML = '<option value="" disabled selected>Select or Add Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Add font form
    document.getElementById('fontForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const fontName = document.getElementById('fontName').value;
        const fontDescription = document.getElementById('fontDescription').value;
        const fontLink = document.getElementById('fontLink').value;
        let fontCategory = document.getElementById('fontCategory').value;
        const newCategory = document.getElementById('newCategory').value;
        const fontImage = document.getElementById('fontImage').files[0];

        fontCategory = newCategory || fontCategory;

        const reader = new FileReader();
        reader.onload = function(event) {
            const newFont = {
                name: fontName,
                description: fontDescription,
                link: fontLink,
                category: fontCategory.toLowerCase(),
                image: event.target.result
            };

            const fonts = loadFonts();
            fonts.push(newFont);
            saveFonts(fonts);

            alert('Font added! Check the main page to see it.');
            loadCategories();
            loadDeleteList();
            loadCategoryDeleteList();
        };
        reader.readAsDataURL(fontImage);

        this.reset();
    });

    // Load fonts into delete list
    function loadDeleteList() {
        const deleteList = document.getElementById('fontDeleteList');
        deleteList.innerHTML = '';
        const fonts = loadFonts();

        fonts.forEach((font, index) => {
            const li = document.createElement('li');
            li.textContent = `${font.name} (${font.category})`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete "${font.name}"?`)) {
                    fonts.splice(index, 1);
                    saveFonts(fonts);
                    loadDeleteList();
                    loadCategories();
                    loadCategoryDeleteList();
                }
            });

            li.appendChild(deleteButton);
            deleteList.appendChild(li);
        });
    }

    // Load categories into delete list
    function loadCategoryDeleteList() {
        const deleteList = document.getElementById('categoryDeleteList');
        deleteList.innerHTML = '';
        const fonts = loadFonts();
        const categories = [...new Set(fonts.map(font => font.category))];

        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete category "${category}" and all its fonts?`)) {
                    const updatedFonts = fonts.filter(font => font.category !== category);
                    saveFonts(updatedFonts);
                    loadDeleteList();
                    loadCategories();
                    loadCategoryDeleteList();
                }
            });

            li.appendChild(deleteButton);
            deleteList.appendChild(li);
        });
    }
}