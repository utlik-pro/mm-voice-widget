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

## 🚀 Быстрое развертывание

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/utlik-pro/mm-voice-widget)

**Подробная инструкция**: см. [DEPLOYMENT.md](./DEPLOYMENT.md)

## Быстрый старт

### Локальная разработка

```bash
# Клонирование
git clone https://github.com/utlik-pro/mm-voice-widget.git
cd mm-voice-widget

# Установка зависимостей
npm install
npm run install-frontend

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env и добавьте ваши LiveKit креды
```

### Запуск проекта

```bash
# Запуск фронтенда
cd frontend && npm run dev

# Или запуск полного стека (в отдельном терминале)
npm run dev
```

**Доступные URL:**
- Основное приложение: http://localhost:3001/
- Iframe виджет: http://localhost:3001/widget
- Тестовая страница: http://localhost:3001/test-integration.html

## Использование

### Встраивание через iframe

```html
<iframe 
  src="https://your-project.vercel.app/widget?theme=light"
  width="400" 
  height="500"
  frameborder="0"
  allow="microphone">
</iframe>
```

### Настройка темы

```javascript
// Поддерживаемые параметры URL
?theme=light|dark          // Светлая или тёмная тема
?autoConnect=true|false    // Автоматическое подключение
?transcription=true|false  // Включить транскрипцию
```

## Архитектура

```
├── api/                    # Python serverless функции
│   ├── token.py           # Генерация LiveKit токенов
│   └── requirements.txt   # Python зависимости
├── frontend/              # React + TypeScript фронтенд
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── lib/          # Библиотеки и утилиты
│   │   └── types/        # TypeScript типы
│   └── dist/             # Build артефакты
├── vercel.json           # Конфигурация Vercel
└── DEPLOYMENT.md         # Инструкция по развертыванию
```

## Технологии

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Python, FastAPI (serverless)
- **Voice**: LiveKit WebRTC, Deepgram STT, OpenAI TTS
- **Deployment**: Vercel, GitHub Actions

## Настройка переменных окружения

```bash
# LiveKit (обязательно)
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
LIVEKIT_URL=wss://your-project.livekit.cloud

# Voice API (опционально)
OPENAI_API_KEY=your_openai_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Виджет (опционально)
WIDGET_THEME=light
WIDGET_AUTO_CONNECT=false
WIDGET_ENABLE_TRANSCRIPTION=true
```

## Разработка

### Структура проекта

- `frontend/src/components/VoiceWidget.tsx` - основной компонент виджета
- `frontend/src/lib/livekit.ts` - LiveKit интеграция
- `api/token.py` - генерация JWT токенов для LiveKit
- `test-integration.html` - тестовая страница

### Тестирование

```bash
# Запуск тестов
npm run test

# Линтинг
npm run lint

# Сборка
npm run build
```

## Поддержка

- **GitHub Issues**: https://github.com/utlik-pro/mm-voice-widget/issues
- **LiveKit документация**: https://docs.livekit.io
- **Vercel документация**: https://vercel.com/docs

## Лицензия

MIT License - см. [LICENSE](LICENSE) для деталей. 