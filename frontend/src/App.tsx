import React from 'react';
import { VoiceWidget } from './components/VoiceWidget';
import { VoiceWidgetConfig } from './types';

const App: React.FC = () => {
  // Конфигурация виджета
  const config: VoiceWidgetConfig = {
    tokenEndpoint: '/api/token',
    roomName: 'voice-agent-room',
    participantName: `user-${Date.now()}`,
    autoConnect: false,
    enableTranscription: true,
    theme: 'light'
  };

  // Обработчики событий
  const handleConnectionStateChange = (state: any) => {
    console.log('Connection state changed:', state);
  };

  const handleTranscription = (data: any) => {
    console.log('Transcription:', data);
  };

  const handleMessage = (message: any) => {
    console.log('Message:', message);
  };

  const handleError = (error: Error) => {
    console.error('Widget error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Голосовой помощник
        </h1>
        
        <VoiceWidget
          config={config}
          onConnectionStateChange={handleConnectionStateChange}
          onTranscription={handleTranscription}
          onMessage={handleMessage}
          onError={handleError}
          className="shadow-lg"
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Нажмите кнопку микрофона для начала общения с голосовым помощником
          </p>
        </div>
      </div>
    </div>
  );
};

export default App; 