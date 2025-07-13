# 🚀 Развертывание на Vercel

## Быстрое развертывание

### 1. Деплой одним кликом

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/utlik-pro/mm-voice-widget)

### 2. Ручное развертывание

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте репозиторий: `https://github.com/utlik-pro/mm-voice-widget`
4. Настройте переменные окружения (см. ниже)
5. Нажмите "Deploy"

## Настройка переменных окружения

В настройках проекта Vercel добавьте следующие переменные:

### Обязательные переменные:
```bash
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Опциональные переменные:
```bash
OPENAI_API_KEY=your_openai_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here
WIDGET_THEME=light
WIDGET_AUTO_CONNECT=false
WIDGET_ENABLE_TRANSCRIPTION=true
```

## Получение LiveKit credentials

1. Зарегистрируйтесь на [livekit.io](https://livekit.io)
2. Создайте новый проект
3. Скопируйте API Key, Secret и URL
4. Добавьте их в переменные окружения Vercel

## Проверка развертывания

После деплоя проект будет доступен по адресу:
- **Основное приложение**: `https://your-project.vercel.app/`
- **Iframe виджет**: `https://your-project.vercel.app/widget`
- **API токенов**: `https://your-project.vercel.app/api/token`

## Интеграция в HTML

```html
<iframe 
  src="https://your-project.vercel.app/widget?theme=light"
  width="400" 
  height="500"
  frameborder="0"
  allow="microphone">
</iframe>
```

## Устранение неполадок

### Проблема: "Project already exists"
- Измените имя проекта в `vercel.json`:
```json
{
  "name": "your-unique-project-name",
  ...
}
```

### Проблема: API токены не работают
- Проверьте переменные окружения в настройках Vercel
- Убедитесь, что LiveKit credentials правильные

### Проблема: Iframe блокируется
- Проверьте CSP заголовки родительского сайта
- Убедитесь, что iframe разрешен для вашего домена

## Локальное тестирование

```bash
# Запуск фронтенда
cd frontend && npm run dev

# Запуск полного стека
npm run dev

# Тестирование API
curl -X POST http://localhost:3001/api/token \
  -H "Content-Type: application/json" \
  -d '{"roomName": "test-room", "participantName": "test-user"}'
```

## Поддержка

- GitHub Issues: https://github.com/utlik-pro/mm-voice-widget/issues
- LiveKit документация: https://docs.livekit.io
- Vercel документация: https://vercel.com/docs 