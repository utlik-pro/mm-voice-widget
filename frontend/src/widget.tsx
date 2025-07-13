import React from 'react';
import ReactDOM from 'react-dom/client';
import { IframeWidget } from './components/IframeWidget';
import './index.css';

// Получаем конфигурацию из URL параметров
const urlParams = new URLSearchParams(window.location.search);
const config = {
  roomName: urlParams.get('roomName') || 'voice-agent-room',
  participantName: urlParams.get('participantName') || `user-${Date.now()}`,
  enableTranscription: urlParams.get('enableTranscription') === 'true',
  theme: (urlParams.get('theme') as 'light' | 'dark') || 'light',
  autoConnect: urlParams.get('autoConnect') === 'true'
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IframeWidget config={config} />
  </React.StrictMode>
); 