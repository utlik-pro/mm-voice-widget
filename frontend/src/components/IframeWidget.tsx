import React, { useEffect, useState } from 'react';
import { VoiceWidget } from './VoiceWidget';
import { VoiceWidgetConfig } from '../types';

interface IframeWidgetProps {
  config?: Partial<VoiceWidgetConfig>;
}

export const IframeWidget: React.FC<IframeWidgetProps> = ({ config = {} }) => {
  const [widgetConfig, setWidgetConfig] = useState<VoiceWidgetConfig>({
    tokenEndpoint: '/api/token',
    roomName: 'voice-agent-room',
    participantName: `user-${Date.now()}`,
    autoConnect: false,
    enableTranscription: true,
    theme: 'light',
    ...config
  });

  // Обработка сообщений от родительского окна
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Проверяем origin для безопасности
      const allowedOrigins = [
        'http://localhost:3000',
        'https://localhost:3000',
        window.location.origin
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.warn('Message from untrusted origin:', event.origin);
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'updateConfig':
          setWidgetConfig(prev => ({ ...prev, ...data }));
          break;
        case 'connect':
          // Родительское окно просит подключиться
          setWidgetConfig(prev => ({ ...prev, autoConnect: true }));
          break;
        case 'disconnect':
          // Родительское окно просит отключиться
          setWidgetConfig(prev => ({ ...prev, autoConnect: false }));
          break;
        default:
          console.log('Unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Уведомляем родительское окно о готовности
    window.parent.postMessage({
      type: 'widgetReady',
      data: { timestamp: Date.now() }
    }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Обработчики событий виджета
  const handleConnectionStateChange = (state: any) => {
    // Отправляем изменения состояния родительскому окну
    window.parent.postMessage({
      type: 'connectionStateChange',
      data: state
    }, '*');
  };

  const handleTranscription = (data: any) => {
    window.parent.postMessage({
      type: 'transcription',
      data
    }, '*');
  };

  const handleMessage = (message: any) => {
    window.parent.postMessage({
      type: 'message',
      data: message
    }, '*');
  };

  const handleError = (error: Error) => {
    window.parent.postMessage({
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack
      }
    }, '*');
  };

  return (
    <div className="w-full h-full">
      <VoiceWidget
        config={widgetConfig}
        onConnectionStateChange={handleConnectionStateChange}
        onTranscription={handleTranscription}
        onMessage={handleMessage}
        onError={handleError}
        className="h-full"
      />
    </div>
  );
}; 