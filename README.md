# Голосовой виджет с LiveKit

Встраиваемый голосовой виджет с интеграцией LiveKit для веб-сайтов. Позволяет легко добавить голосовое взаимодействие с ИИ-агентом на любой сайт через iframe.

## Возможности

- 🎤 **Голосовой интерфейс** - общение с ИИ-помощником через микрофон
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🖼️ **iframe виджет** - легко встраивается на любой сайт
- ⚡ **Быстрое развертывание** - готов к деплою на Vercel
- 🔒 **Безопасность** - HTTPS и правильная обработка разрешений
- 📝 **Транскрипция** - поддержка преобразования речи в текст
- 🎨 **Настраиваемый дизайн** - TailwindCSS для стилизации

## Быстрый старт

### Локальная разработка

```bash
# Клонирование
git clone https://github.com/utlik-pro/BBOSsystem.git
cd BBOSsystem

# Установка зависимостей
npm install
npm run install-frontend

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env и добавьте ваши LiveKit креды

# Запуск в режиме разработки
npm run dev
```

### Развертывание на Vercel

```bash
# Установка Vercel CLI
npm install -g vercel

# Авторизация
vercel login

# Развертывание
npm run deploy:vercel
```

## Использование

После развертывания встройте виджет на ваш сайт:

```html
<iframe
  src="https://your-project.vercel.app/widget"
  style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 80px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9999;
  "
  allow="microphone"
  title="Голосовой помощник"
></iframe>
```

### Настройка виджета

Вы можете настроить виджет через URL параметры:

```html
<iframe
  src="https://your-project.vercel.app/widget?roomName=my-room&enableTranscription=true&theme=dark"
  ...
></iframe>
```

Доступные параметры:
- `roomName` - название комнаты (по умолчанию: voice-agent-room)
- `participantName` - имя участника (по умолчанию: user-timestamp)
- `enableTranscription` - включить транскрипцию (true/false)
- `theme` - тема (light/dark)
- `autoConnect` - автоматическое подключение (true/false) 