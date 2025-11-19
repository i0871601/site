// Змінні для елементів DOM
const loginForm = document.getElementById('loginForm');
const lastNameInput = document.getElementById('lastName');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const buttonText = loginButton.querySelector('.default-text');
const buttonDots = loginButton.querySelector('.dots');

//1. Функція "кодування" (для навчальної демонстрації)
//Використовує Base64 для перетворення рядка.
function codePassword(password) {
    try {
        return btoa(password); // btoa() - це стандартна функція JS для кодування в Base64.
    } catch (e) {
        console.error("Помилка кодування Base64:", e);
        return password;
    }
}

//2. Функція для управління станом кнопки (завантаження)
function setButtonLoading(isLoading) {
    loginButton.disabled = isLoading;
    if (isLoading) {
        buttonText.classList.add('hidden');
        buttonDots.classList.remove('hidden');
    } else {
        buttonText.classList.remove('hidden');
        buttonDots.classList.add('hidden');
    }
}

//3. Основна функція обробки авторизації
async function handleLogin(event) {
    // Запобігаємо стандартній відправці форми
    event.preventDefault();

    const surname = lastNameInput.value.trim();
    const rawPassword = passwordInput.value;

    if (!surname || !rawPassword) {
        alert('Будь ласка, заповніть обидва поля.');
        return;
    }
    //Кодування пароля перед відправленням
    const encodedPassword = codePassword(rawPassword); 

    setButtonLoading(true);

    try {
        //Відправлення запиту на Cloudflare Worker
        const response = await fetch('/auth', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Прізвище: surname, 
                КодованийПароль: encodedPassword
            })
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            const userData = result.data;
          
            alert(`Вхід успішний! Вітаємо, ${userData.Імя} ${userData.Прізвище} (${userData.Стать}).`);
            console.log("Дані користувача:", userData);

        } else {
            alert(`Помилка авторизації: ${result.message || 'Невідома помилка. Чи невірний пароль, не знайдено користувача'}`);
        }

    } catch (error) {
        console.error('Помилка підключення до воркера:', error);
        alert('Не вдалося з’єднатися з сервером. Перевірте з’єднання.');
    } finally {
        setButtonLoading(false);
    }
}
//4. Прив'язка обробника подій до форми
loginForm.addEventListener('submit', handleLogin);
