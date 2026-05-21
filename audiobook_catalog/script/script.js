// ==================== БАЗА ДАННЫХ АУДИОКНИГ ====================
const booksDatabase = {
    book1: {
        id: 'book1',
        title: 'Малыш и Карлсон',
        author: 'Астрид Линдгрен',
        narrator: 'Алексей Багдасаров',
        cover: 'static/img/book_clover/book1.jpg',
        audioUrl: 'audio/book1.mp3',
        duration: '2ч 15мин',
        durationSeconds: 8100,
        rating: 4.5,
        year: 1955,
        description: 'История о мальчике и его друге Карлсоне, который живёт на крыше. Весёлые приключения, мудрые мысли и настоящее тепло семейных ценностей в знаменитой сказке Астрид Линдгрен.'
    },
    book2: {
        id: 'book2',
        title: 'Винни-Пух',
        author: 'Алан Милн',
        narrator: 'Евгений Леонов',
        cover: 'static/img/book_clover/book2.jpg',
        audioUrl: 'audio/book2.mp3',
        duration: '2ч 45мин',
        durationSeconds: 9900,
        rating: 4.8,
        year: 1926,
        description: 'Приключения медвежонка Винни-Пуха и его друзей. Добрая и мудрая сказка о дружбе, которая покорила сердца миллионов детей и взрослых.'
    },
    book3: {
        id: 'book3',
        title: 'Приключения Незнайки',
        author: 'Николай Носов',
        narrator: 'Сергей Гармаш',
        cover: 'static/img/book_clover/book3.jpg',
        audioUrl: 'audio/book3.mp3',
        duration: '3ч 30мин',
        durationSeconds: 12600,
        rating: 4.6,
        year: 1953,
        description: 'Весёлые и поучительные приключения Незнайки и его друзей в Цветочном городе. Классика детской литературы в прекрасном озвучании.'
    },
    book4: {
        id: 'book4',
        title: 'Алиса в Стране чудес',
        author: 'Льюис Кэрролл',
        narrator: 'Алиса Фрейндлих',
        cover: 'static/img/book_clover/book4.jpg',
        audioUrl: 'audio/book4.mp3',
        duration: '2ч 30мин',
        durationSeconds: 9000,
        rating: 4.7,
        year: 1865,
        description: 'Приключения Алисы в волшебной стране. Удивительная сказка, полная фантазии и неожиданных поворотов.'
    }
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function getCurrentUsername() {
    const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData).username : null;
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function getUserBooks() {
    const username = getCurrentUsername();
    if (!username) return { favorites: [], loved: [], read: [] };
    const userBooks = localStorage.getItem(`userBooks_${username}`);
    return userBooks ? JSON.parse(userBooks) : { favorites: [], loved: [], read: [] };
}

function saveUserBooks(books) {
    const username = getCurrentUsername();
    if (username) localStorage.setItem(`userBooks_${username}`, JSON.stringify(books));
}

function showMessage(element, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-${type}`;
    msgDiv.style.cssText = `position: fixed; bottom: 80px; left: 20px; right: 20px; background: ${type === 'error' ? '#ef4444' : '#10b981'}; color: white; padding: 12px; border-radius: 12px; text-align: center; z-index: 2000;`;
    msgDiv.textContent = text;
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
}

function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// ==================== АВТОРИЗАЦИЯ ====================
function checkAuth() {
    const authPages = ['login.html', 'register.html'];
    const isAuthPage = authPages.some(page => window.location.pathname.includes(page));
    const currentUser = getCurrentUser();
    
    if (isAuthPage && currentUser) window.location.href = 'index.html';
    else if (!isAuthPage && !currentUser && !window.location.pathname.includes('profile.html')) {
        window.location.href = 'login.html';
    }
}

// Регистрация
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const username = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const passwordConfirm = form.passwordConfirm.value;
        
        if (password !== passwordConfirm) {
            showMessage(form, 'Пароли не совпадают', 'error');
            return;
        }
        if (password.length < 6) {
            showMessage(form, 'Пароль должен быть минимум 6 символов', 'error');
            return;
        }
        
        const users = getUsers();
        if (users.some(u => u.username === username)) {
            showMessage(form, 'Пользователь уже существует', 'error');
            return;
        }
        if (users.some(u => u.email === email)) {
            showMessage(form, 'Email уже используется', 'error');
            return;
        }
        
        const newUser = { id: Date.now(), username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem(`userBooks_${username}`, JSON.stringify({ favorites: [], loved: [], read: [] }));
        
        showMessage(form, 'Регистрация успешна!', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
    });
}

// Вход
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;
        const rememberMe = form.rememberMe.checked;
        
        const user = getUsers().find(u => u.username === username && u.password === password);
        
        if (user) {
            if (rememberMe) localStorage.setItem('currentUser', JSON.stringify(user));
            else sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            showMessage(form, 'Вход выполнен!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            showMessage(form, 'Неверное имя или пароль', 'error');
        }
    });
}

// Профиль
if (document.querySelector('.profile-container')) {
    const currentUser = getCurrentUser();
    if (!currentUser) window.location.href = 'login.html';
    else {
        document.querySelector('.profile-title').textContent = currentUser.username;
        document.querySelector('.profile-email').textContent = currentUser.email;
        
        const userBooks = getUserBooks();
        document.getElementById('favoriteCount').textContent = userBooks.favorites.length;
        document.getElementById('lovedCount').textContent = userBooks.loved.length;
        document.getElementById('listenedCount').textContent = userBooks.read.length;
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
}

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
function displayBooks(containerId, books) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <div class="second-name">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <button onclick="window.location.href='book_info.html?id=${book.id}'">🎧 Слушать</button>
        `;
        container.appendChild(bookDiv);
    });
}

if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', () => {
        const allBooks = Object.values(booksDatabase);
        const featured = allBooks.slice(0, 2);
        displayBooks('featuredContainer', featured);
        displayBooks('allBooksContainer', allBooks);
    });
}

// ==================== МОИ КНИГИ ====================
function displayCategoryBooks(category) {
    const container = document.getElementById('booksContainer');
    if (!container) return;
    
    const userBooks = getUserBooks();
    const books = userBooks[category] || [];
    
    if (books.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>📭 Здесь пока ничего нет</p><p>Добавьте аудиокниги из каталога</p></div>';
        return;
    }
    
    container.innerHTML = '';
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        bookDiv.innerHTML = `
            <img src="${book.cover}" style="width: 100px; height: 100px; border-radius: 12px; object-fit: cover;">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button onclick="window.location.href='book_info.html?id=${book.id}'">🎧 Слушать</button>
        `;
        container.appendChild(bookDiv);
    });
}

if (document.querySelector('.book-categories')) {
    document.addEventListener('DOMContentLoaded', () => {
        const buttons = document.querySelectorAll('.book-categories button');
        let activeCategory = 'favorites';
        
        function setActive(category) {
            activeCategory = category;
            buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
            displayCategoryBooks(category);
        }
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => setActive(btn.dataset.category));
        });
        
        setActive('favorites');
    });
}

// ==================== СТРАНИЦА АУДИОКНИГИ ====================
function toggleBookCategory(category, book) {
    const user = getCurrentUser();
    if (!user) {
        alert('Войдите в аккаунт, чтобы добавлять книги');
        return;
    }
    
    const userBooks = getUserBooks();
    const categoryBooks = userBooks[category] || [];
    const index = categoryBooks.findIndex(b => b.id === book.id);
    
    if (index === -1) categoryBooks.push(book);
    else categoryBooks.splice(index, 1);
    
    userBooks[category] = categoryBooks;
    saveUserBooks(userBooks);
    return index === -1;
}

if (document.querySelector('.book-controls')) {
    document.addEventListener('DOMContentLoaded', () => {
        const bookId = getQueryParam('id');
        const book = booksDatabase[bookId];
        if (!book) {
            alert('Аудиокнига не найдена');
            window.location.href = 'index.html';
            return;
        }
        
        book.id = bookId;
        
        // Заполнение информации
        document.querySelector('.book-cover').src = book.cover;
        document.querySelector('.book-title').textContent = book.title;
        document.querySelector('.book-author').textContent = book.author;
        document.getElementById('narrator').textContent = book.narrator;
        document.getElementById('durationText').textContent = book.duration;
        document.getElementById('year').textContent = book.year;
        document.getElementById('rating').textContent = book.rating;
        document.getElementById('description').textContent = book.description;
        
        // Аудиоплеер
        const audio = document.getElementById('audioPlayer');
        audio.src = book.audioUrl;
        
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const currentTimeSpan = document.getElementById('currentTime');
        const durationSpan = document.getElementById('duration');
        
        audio.addEventListener('loadedmetadata', () => {
            durationSpan.textContent = formatTime(audio.duration);
            progressBar.max = audio.duration;
        });
        
        audio.addEventListener('timeupdate', () => {
            progressBar.value = audio.currentTime;
            currentTimeSpan.textContent = formatTime(audio.currentTime);
        });
        
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playPauseBtn.textContent = '⏸';
            } else {
                audio.pause();
                playPauseBtn.textContent = '▶';
            }
        });
        
        progressBar.addEventListener('input', () => {
            audio.currentTime = progressBar.value;
        });
        
        // Кнопки категорий
        function updateIcons() {
            const userBooks = getUserBooks();
            const isFavorite = userBooks.favorites.some(b => b.id === book.id);
            const isLoved = userBooks.loved.some(b => b.id === book.id);
            const isRead = userBooks.read.some(b => b.id === book.id);
            
            document.querySelector('#favoriteButton img').src = `static/img/${isFavorite ? 'favouritesBlue' : 'favourites'}.png`;
            document.querySelector('#loveButton img').src = `static/img/${isLoved ? 'loveRed' : 'love'}.png`;
            document.querySelector('#readButton img').src = `static/img/${isRead ? 'readGreen' : 'read'}.png`;
        }
        
        document.getElementById('favoriteButton').addEventListener('click', () => {
            toggleBookCategory('favorites', book);
            updateIcons();
        });
        document.getElementById('loveButton').addEventListener('click', () => {
            toggleBookCategory('loved', book);
            updateIcons();
        });
        document.getElementById('readButton').addEventListener('click', () => {
            toggleBookCategory('read', book);
            updateIcons();
        });
        
        updateIcons();
        
        // Рейтинг
        const stars = document.querySelectorAll('.star');
        let currentRating = parseInt(localStorage.getItem(`rating_${bookId}`)) || 0;
        
        function highlightStars(rating) {
            stars.forEach((star, i) => {
                if (i < rating) star.classList.add('highlighted');
                else star.classList.remove('highlighted');
            });
        }
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = currentRating === index + 1 ? 0 : index + 1;
                highlightStars(currentRating);
                if (currentRating === 0) localStorage.removeItem(`rating_${bookId}`);
                else localStorage.setItem(`rating_${bookId}`, currentRating);
            });
            star.addEventListener('mouseenter', () => highlightStars(index + 1));
            star.addEventListener('mouseleave', () => highlightStars(currentRating));
        });
        
        highlightStars(currentRating);
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==================== ОТЗЫВЫ ====================
if (document.querySelector('.review-section')) {
    function initReviews() {
        const bookId = getQueryParam('id');
        if (!bookId) return;
        
        function loadReviews() {
            const reviews = JSON.parse(localStorage.getItem(`reviews_${bookId}`)) || [];
            const container = document.querySelector('.comments-container');
            const currentUser = getCurrentUser();
            
            if (reviews.length === 0) {
                container.innerHTML = '<p class="no-reviews">✨ Будьте первым, кто оставит отзыв!</p>';
                return;
            }
            
            container.innerHTML = '';
            reviews.forEach(review => {
                const isOwner = currentUser && currentUser.id === review.userId;
                const div = document.createElement('div');
                div.className = 'review-item';
                div.innerHTML = `
                    <div class="review-header">
                        <span class="review-author">👤 ${review.username}</span>
                        <span class="review-date">${new Date(review.timestamp).toLocaleDateString('ru-RU')}</span>
                        ${isOwner ? '<button class="delete-review" data-id="'+review.id+'">🗑️</button>' : ''}
                    </div>
                    <div class="review-text">${escapeHtml(review.text)}</div>
                `;
                container.appendChild(div);
            });
            
            document.querySelectorAll('.delete-review').forEach(btn => {
                btn.addEventListener('click', () => {
                    const reviewId = parseInt(btn.dataset.id);
                    const newReviews = reviews.filter(r => r.id !== reviewId);
                    localStorage.setItem(`reviews_${bookId}`, JSON.stringify(newReviews));
                    loadReviews();
                    document.getElementById('reviews').textContent = newReviews.length;
                });
            });
        }
        
        document.getElementById('reviews').textContent = (JSON.parse(localStorage.getItem(`reviews_${bookId}`)) || []).length;
        
        document.querySelector('.submit-review').addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) {
                alert('Войдите в аккаунт, чтобы оставить отзыв');
                return;
            }
            
            const textarea = document.querySelector('.review-section textarea');
            const text = textarea.value.trim();
            if (!text) {
                alert('Введите текст отзыва');
                return;
            }
            
            const reviews = JSON.parse(localStorage.getItem(`reviews_${bookId}`)) || [];
            reviews.unshift({
                id: Date.now(),
                username: user.username,
                userId: user.id,
                text: escapeHtml(text),
                timestamp: Date.now()
            });
            localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));
            textarea.value = '';
            loadReviews();
            document.getElementById('reviews').textContent = reviews.length;
        });
        
        loadReviews();
    }
    
    initReviews();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ПОИСК ====================
if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const results = Object.values(booksDatabase).filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) ||
            (book.narrator && book.narrator.toLowerCase().includes(query))
        );
        
        const container = document.getElementById('searchResults');
        if (query.length === 0) {
            container.innerHTML = '<div class="empty-state">🔍 Начните вводить название или автора</div>';
            return;
        }
        
        if (results.length === 0) {
            container.innerHTML = '<div class="empty-state">😔 Ничего не найдено</div>';
            return;
        }
        
        container.innerHTML = '';
        results.forEach(book => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <img src="${book.cover}" alt="${book.title}">
                <div class="search-result-info">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>🎙️ ${book.narrator}</p>
                    <button onclick="window.location.href='book_info.html?id=${book.id}'">🎧 Слушать</button>
                </div>
            `;
            container.appendChild(div);
        });
    });
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', checkAuth);