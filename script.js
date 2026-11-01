document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input, textarea');
    const bioTextarea = document.getElementById('bio');
    const charCount = document.getElementById('charCount');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // счётчик символов для textarea
    if (bioTextarea && charCount) {
        bioTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        // очистка ошибки при вводе
        input.addEventListener('input', (e) => clearError(e.target));
    });

    // валидация совпадения паролей при вводе
    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
        password.addEventListener('input', validatePasswordMatch);
    }

    // обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // проверка всех полей
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        // дополнительная проверка паролей
        if (password && confirmPassword) {
            if (!validatePasswordMatch()) {
                isValid = false;
            }
        }

        if (isValid) {
            showSuccessMessage();
        } else {
            const firstError = form.querySelector('.error');
            if (firstError) firstError.focus();
            alert('Пожалуйста, исправьте ошибки в форме');
        }
    });

    // Сброс формы
    form.addEventListener('reset', () => {
        clearAllErrors();
        if (charCount) charCount.textContent = '0';
    });


    function validateField(e) {
    const field = e.target;
    
    if (field.id === 'phone') {
        // Оставляем только цифры из введенной строки
        const digits = field.value.replace(/\D/g, ''); 
        
        // Если поле пустое и необязательное — пропускаем
        if (!field.required && digits.length === 0) {
            clearError(field);
            return true;
        }

        if (digits.length < 10 || digits.length > 11) {
            showError(field, 'Введите номер телефона (от 10 до 11 цифр)');
            return false;
        } else {
            clearError(field);
            return true;
        }
    }

    if (!field.required && !field.value.trim()) {
        clearError(field);
        return true;
    }

    if (!field.checkValidity()) {
        showError(field, getErrorMessage(field));
        return false;
    } else {
        clearError(field);
        return true;
    }
}

    function validatePasswordMatch() {
        if (!password || !confirmPassword) return true;

        const errorElement = document.getElementById('confirmPasswordError');
        
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.classList.add('error');
            if (errorElement) errorElement.textContent = 'Пароли не совпадают';
            return false;
        } else {
            confirmPassword.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
            return true;
        }
    }

    function getErrorMessage(field) {
        const validity = field.validity;

        if (validity.valueMissing) {
            return 'Это поле обязательно для заполнения';
        }
        if (validity.typeMismatch && field.type === 'email') {
            return 'Введите корректный email адрес';
        }
        if (validity.tooShort) {
            return `Минимальная длина: ${field.minLength} символов`;
        }
        if (validity.tooLong) {
            return `Максимальная длина: ${field.maxLength} символов`;
        }
        if (validity.patternMismatch) {
            if (field.type === 'password') {
                return 'Пароль должен содержать заглавные и строчные буквы, цифры';
            }
        }
        return 'Некорректное значение';
    }

    function showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    function showSuccessMessage() {
        alert('Форма успешно отправлена!');
        form.reset();
        clearAllErrors();
        if (charCount) charCount.textContent = '0';
    }
});