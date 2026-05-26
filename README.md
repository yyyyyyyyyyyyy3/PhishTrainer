# 🎯 PhishTrainer - Email Phishing Simulation Platform

Інтерактивна платформа для навчання розпізнавання фішингових електронних листів.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## 🌟 Особливості

-   🎓 **Інтерактивне навчання** - практика на реальних прикладах фішингових листів
-   📊 **Детальна статистика** - відстежування прогресу та результатів
-   🏆 **Система досягнень** - мотивація через досягнення та рівні
-   📧 **Різноманітні категорії** - фішинг різних типів та складності
-   🔐 **Безпечне середовище** - навчання без ризику для реальних даних
-   🎨 **Сучасний UI** - зручний інтерфейс на базі Next.js та Tailwind CSS

## 📸 Скріншоти

### 🏠 Головна сторінка (Landing)

_Сучасний інтерактивний лендінг з AI-функціоналом та демонстрацією можливостей_

![Landing Page Hero](./docs/screenshots/landing/image.png)
![Landing Features](./docs/screenshots/landing/image1.png)
![Landing Demo](./docs/screenshots/landing/image2.png)
![Landing Footer](./docs/screenshots/landing/image3.png)

### 🎯 Симуляція фішингу

_Інтерактивне навчання на реальних прикладах_

![Simulation View](./docs/screenshots/simulation/image.png)

### 📊 Дашборд

_Відстежування прогресу та статистики_

![Dashboard](./docs/screenshots/dashboard/image.png)
![Profile](./docs/screenshots/profile/image.png)

## 📚 Документація

### 🚀 Для користувачів

-   **[⚡ Швидкий старт (QUICK_START_UA.md)](./QUICK_START_UA.md)** - Запустити за 5 хвилин
-   **[📖 Повний посібник (USER_GUIDE_UA.md)](./USER_GUIDE_UA.md)** - Детальна інструкція для новачків
    -   Встановлення Docker на Windows
    -   Покрокове налаштування проекту
    -   Опис всіх функцій додатку
    -   Вирішення проблем
    -   Поради для навчання

### 👨‍💻 Для розробників

-   **[Backend README](./backend/README.md)** - API документація
-   **[Frontend Architecture](./frontend/ARCHITECTURE.md)** - Архітектура фронтенду
-   **[API Collection](./backend/PhishTrainer-API.postman_collection.json)** - Postman колекція

## 🏗️ Технології

### Backend

-   **Node.js** + **Express.js** - REST API
-   **TypeScript** - типізація
-   **PostgreSQL** - база даних
-   **Prisma** - ORM
-   **Redis** - кешування
-   **JWT** - автентифікація

### Frontend

-   **Next.js 15** - React фреймворк
-   **TypeScript** - типізація
-   **Tailwind CSS** - стилізація
-   **shadcn/ui** - UI компоненти
-   **Redux Toolkit** - управління станом
-   **React Hook Form** - форми

### Infrastructure

-   **Docker** + **Docker Compose** - контейнеризація
-   **GitHub Actions** - CI/CD (опціонально)

## 🚀 Швидкий старт

### Передумови

-   ✅ Docker Desktop для Windows
-   ✅ Git (опціонально)

### Встановлення за 3 кроки

#### 1️⃣ Клонуйте репозиторій

```bash
git clone https://github.com/Mksvt/PhishTrainer.git
cd PhishTrainer
```

#### 2️⃣ Налаштуйте змінні середовища

```bash
# Windows PowerShell
cd backend
@"
DATABASE_URL="postgresql://phishtrainer:phishtrainer123@localhost:5432/phishtrainer?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
"@ | Out-File -FilePath .env -Encoding UTF8
cd ..
```

#### 3️⃣ Запустіть проект

```bash
# Запуск всіх сервісів
docker-compose up -d

# Ініціалізація бази даних
docker exec -it phishtrainer-backend npm run prisma:migrate:deploy
```

### 🎉 Готово!

Відкрийте браузер: **http://localhost:3000**

## 📋 Основні команди

```bash
# Запуск проекту
docker-compose up -d

# Зупинка проекту
docker-compose down

# Перегляд логів
docker-compose logs -f

# Перезапуск сервісу
docker-compose restart [service-name]

# Перебудова образів
docker-compose up -d --build

# Очистка та повний перезапуск
docker-compose down -v
docker-compose up -d --build
```

## 🏗️ Структура проекту

```
PhishTrainer/
├── 📄 README.md                    # Цей файл
├── 📄 USER_GUIDE_UA.md            # Повний посібник користувача
├── 📄 QUICK_START_UA.md           # Швидкий старт
├── 🐳 docker-compose.yml          # Docker конфігурація
│
├── 🔧 backend/                    # Backend API
│   ├── src/
│   │   ├── controllers/          # Контролери API
│   │   ├── routes/               # Маршрути API
│   │   ├── middleware/           # Middleware (auth, validation)
│   │   ├── data/                 # Дані фішингових листів
│   │   ├── config/               # Конфігурація (DB, Redis)
│   │   └── utils/                # Утиліти (JWT, email)
│   ├── prisma/
│   │   └── schema.prisma         # Схема бази даних
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
└── 🎨 frontend/                   # Frontend додаток
    ├── app/                       # Next.js App Router
    │   ├── dashboard/            # Головна панель
    │   ├── simulation/           # Симуляція фішингу
    │   ├── profile/              # Профіль користувача
    │   └── login/                # Автентифікація
    ├── components/               # UI компоненти
    │   └── ui/                   # shadcn/ui компоненти
    ├── features/                 # Feature-based модулі
    │   ├── auth/                 # Автентифікація
    │   ├── simulation/           # Симуляція
    │   ├── profile/              # Профіль
    │   └── shared/               # Спільні компоненти
    ├── lib/                      # Утиліти та API
    ├── Dockerfile
    ├── package.json
    └── ARCHITECTURE.md
```

## 🎮 Використання

### 1. Реєстрація

-   Натисніть **"Sign Up"**
-   Заповніть форму (ім'я, email, пароль)
-   Підтвердіть реєстрацію

### 2. Симуляція фішингу

-   Перейдіть у розділ **"Simulation"**
-   Уважно вивчіть показаний лист
-   Визначте чи це фішинг: **Trust** або **Phishing**
-   Отримайте миттєвий зворотний зв'язок

### 3. Відстежування прогресу

-   Розділ **"Profile"** - ваша статистика
-   Графіки та діаграми прогресу
-   Система досягнень та рівнів

### 4. Історія

-   Переглядайте попередні відповіді
-   Аналізуйте помилки
-   Вчіться на досвіді

## 🎯 Категорії фішингу

-   📧 **Email Spoofing** - підробка відправника
-   🎣 **Spear Phishing** - цільовий фішинг
-   🐋 **Whaling** - атаки на керівництво
-   🔗 **Link Manipulation** - підроблені посилання
-   📎 **Attachment Phishing** - шкідливі вкладення
-   ⏰ **Urgent Request** - термінові запити

## 🔧 API Endpoints

### Автентифікація

```
POST   /api/auth/register    # Реєстрація
POST   /api/auth/login        # Вхід
GET    /api/auth/profile      # Профіль (захищено)
```

### Листи

```
GET    /api/emails            # Всі листи
GET    /api/emails/random     # Випадковий лист
GET    /api/emails/:id        # Конкретний лист
```

### Симуляція

```
POST   /api/simulation/check  # Перевірка відповіді
GET    /api/simulation/stats  # Статистика
GET    /api/simulation/history # Історія
```

## 🌐 Порти

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:3001
-   **PostgreSQL**: localhost:5432
-   **Redis**: localhost:6379
-   **Prisma Studio**: http://localhost:5555 (якщо запущено)

## 🔒 Безпека

-   🔐 Паролі хешуються за допомогою **bcrypt**
-   🎫 JWT токени для автентифікації
-   🛡️ CORS налаштування
-   🔒 Валідація даних на backend
-   🚫 Захист від SQL injection (Prisma ORM)
-   ⏱️ Rate limiting (опціонально)

## 🐛 Вирішення проблем

### Docker не запускається

```bash
# Перезапустіть Docker Desktop
# Або перезавантажте комп'ютер
```

### Порт зайнятий

```powershell
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### База даних не працює

```bash
docker-compose restart postgres
docker exec -it phishtrainer-backend npm run prisma:migrate:deploy
```

### Проблеми з frontend

```bash
docker-compose logs frontend
docker-compose restart frontend
```

### Повна очистка

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📊 Розробка

### Backend (режим розробки)

```bash
cd backend
npm install
npm run dev  # Запуск з nodemon
```

### Frontend (режим розробки)

```bash
cd frontend
npm install
npm run dev  # Next.js dev server
```

### Prisma Studio

```bash
docker exec -it phishtrainer-backend npm run prisma:studio
# Відкрийте: http://localhost:5555
```

## 🤝 Внесок

Вітаються pull requests! Для великих змін спочатку створіть issue.

1. Fork репозиторій
2. Створіть гілку (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push до гілки (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📝 TODO / Майбутні функції

-   [ ] 🌍 Багатомовність (EN, UA, PL)
-   [ ] 🌙 Темна/світла тема
-   [ ] 📈 Розширена аналітика
-   [ ] 🏅 Турніри та змагання
-   [ ] 👥 Командний режим
-   [ ] 📱 Мобільний додаток
-   [ ] 🔔 Push-нотифікації
-   [ ] 🎓 Сертифікати про навчання
-   [ ] 🤖 AI-генерація фішингу
-   [ ] 📊 Експорт статистики

## 📄 Ліцензія

Цей проект ліцензовано під [MIT License](LICENSE).

## 👥 Автори

-   **PhishTrainer Team** - _Initial work_ - [Mksvt](https://github.com/Mksvt)

## 🙏 Подяки

-   [Next.js](https://nextjs.org/) - React фреймворк
-   [shadcn/ui](https://ui.shadcn.com/) - UI компоненти
-   [Prisma](https://www.prisma.io/) - Database ORM
-   [Docker](https://www.docker.com/) - Контейнеризація

## 📞 Контакти

-   **GitHub**: [https://github.com/Mksvt/PhishTrainer](https://github.com/Mksvt/PhishTrainer)
-   **Issues**: [https://github.com/Mksvt/PhishTrainer/issues](https://github.com/Mksvt/PhishTrainer/issues)

---

## ⭐ Star History

Якщо проект вам сподобався - поставте зірку! ⭐

---

**🎉 Дякуємо за використання PhishTrainer! Будьте обережні в мережі! 🎉**
