import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Loader2, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { LiveKitVoiceClient, isWebRTCSupported, checkMicrophonePermission } from '../lib/livekit';
import { 
  VoiceWidgetProps, 
  VoiceConnectionState, 
  TranscriptionData, 
  VoiceMessage 
} from '../types';

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({
  config,
  onConnectionStateChange,
  onTranscription,
  onMessage,
  onError,
  className = ''
}) => {
  const [connectionState, setConnectionState] = useState<VoiceConnectionState>({
    isConnected: false,
    isConnecting: false,
    isRecording: false,
    error: null,
    connectionQuality: 'unknown'
  });
  
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isWebRTCAvailable, setIsWebRTCAvailable] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(false);
  
  const clientRef = useRef<LiveKitVoiceClient | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Инициализация
  useEffect(() => {
    const initializeWidget = async () => {
      // Проверяем поддержку WebRTC
      const webRTCSupported = isWebRTCSupported();
      setIsWebRTCAvailable(webRTCSupported);
      
      if (!webRTCSupported) {
        const error = new Error('WebRTC is not supported in this browser');
        onError?.(error);
        return;
      }

      // Проверяем разрешения микрофона
      const micPermission = await checkMicrophonePermission();
      setHasPermission(micPermission);
      
      // Создаем клиент
      clientRef.current = new LiveKitVoiceClient(config);
      
      // Настраиваем обработчики
      clientRef.current.setOnStateChange(handleConnectionStateChange);
      clientRef.current.setOnError(handleError);
      
      // Автоподключение если включено
      if (config.autoConnect && micPermission) {
        await handleConnect();
      }
    };

    initializeWidget();
    
    // Cleanup
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [config]);

  // Обработчики событий
  const handleConnectionStateChange = (state: VoiceConnectionState) => {
    setConnectionState(state);
    onConnectionStateChange?.(state);
    
    if (state.isConnected) {
      setIsMicrophoneEnabled(clientRef.current?.isMicrophoneEnabled() || false);
    }
  };

  const handleError = (error: Error) => {
    console.error('Voice widget error:', error);
    onError?.(error);
  };

  const handleConnect = async () => {
    if (!clientRef.current) return;
    
    try {
      await clientRef.current.connect();
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleDisconnect = async () => {
    if (!clientRef.current) return;
    
    try {
      await clientRef.current.disconnect();
      setIsMicrophoneEnabled(false);
      setTranscript('');
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleToggleMicrophone = async () => {
    if (!clientRef.current) return;
    
    try {
      const enabled = await clientRef.current.toggleMicrophone();
      setIsMicrophoneEnabled(enabled);
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handlePermissionRequest = async () => {
    const permission = await checkMicrophonePermission();
    setHasPermission(permission);
    
    if (permission && config.autoConnect) {
      await handleConnect();
    }
  };

  // Вспомогательные функции
  const getConnectionStatusIcon = () => {
    if (connectionState.isConnecting) {
      return <Loader2 className="w-3 h-3 animate-spin" />;
    }
    
    if (connectionState.isConnected) {
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    }
    
    if (connectionState.error) {
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
    
    return <WifiOff className="w-3 h-3 text-gray-400" />;
  };

  const getConnectionStatusText = () => {
    if (connectionState.isConnecting) return 'Подключение...';
    if (connectionState.isConnected) return 'Подключен';
    if (connectionState.error) return 'Ошибка подключения';
    return 'Не подключен';
  };

  const getConnectionQualityIcon = () => {
    switch (connectionState.connectionQuality) {
      case 'excellent':
        return <Wifi className="w-3 h-3 text-green-500" />;
      case 'good':
        return <Wifi className="w-3 h-3 text-yellow-500" />;
      case 'poor':
        return <Wifi className="w-3 h-3 text-red-500" />;
      default:
        return <WifiOff className="w-3 h-3 text-gray-400" />;
    }
  };

  // Если WebRTC не поддерживается
  if (!isWebRTCAvailable) {
    return (
      <div className={`widget-container ${className}`}>
        <div className="flex items-center justify-center p-4">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-sm text-red-600">
            WebRTC не поддерживается в этом браузере
          </span>
        </div>
      </div>
    );
  }

  // Если нет разрешений микрофона
  if (!hasPermission) {
    return (
      <div className={`widget-container ${className}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <MicOff className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm text-gray-600">
              Нужны разрешения микрофона
            </span>
          </div>
          <button
            onClick={handlePermissionRequest}
            className="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 transition-colors"
          >
            Разрешить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`widget-container ${className}`}>
      {/* Компактный режим */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          {/* Кнопка микрофона */}
          <button
            onClick={handleToggleMicrophone}
            disabled={!connectionState.isConnected}
            className={`voice-button ${
              isMicrophoneEnabled ? 'active' : ''
            } ${!connectionState.isConnected ? 'disabled' : ''}`}
          >
            {isMicrophoneEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
            
            {isMicrophoneEnabled && (
              <div className="pulse-ring"></div>
            )}
          </button>

          {/* Статус подключения */}
          <div className="flex items-center space-x-2">
            {getConnectionStatusIcon()}
            <span className="text-xs text-gray-600">
              {getConnectionStatusText()}
            </span>
            {connectionState.isConnected && getConnectionQualityIcon()}
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex items-center space-x-2">
          {!connectionState.isConnected ? (
            <button
              onClick={handleConnect}
              disabled={connectionState.isConnecting}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {connectionState.isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Phone className="w-4 h-4" />
              )}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => setIsWidgetExpanded(!isWidgetExpanded)}
            className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            {isWidgetExpanded ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Расширенный режим */}
      {isWidgetExpanded && (
        <div className="border-t border-gray-200 animate-slide-up">
          {/* Транскрипция */}
          {config.enableTranscription && (
            <div className="p-3 border-b border-gray-200">
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                Транскрипция
              </h4>
              <div 
                ref={transcriptRef}
                className="transcript-container"
              >
                <div className="transcript-text">
                  {transcript || 'Начните говорить...'}
                </div>
              </div>
            </div>
          )}

          {/* Сообщения */}
          <div className="p-3 max-h-48 overflow-y-auto">
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Сообщения
            </h4>
            <div className="space-y-2">
              {messages.length === 0 ? (
                <div className="text-xs text-gray-500 italic">
                  Нет сообщений
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`text-xs p-2 rounded ${
                      message.type === 'user'
                        ? 'bg-primary-50 text-primary-700 ml-4'
                        : 'bg-gray-50 text-gray-700 mr-4'
                    }`}
                  >
                    <div className="font-medium mb-1">
                      {message.type === 'user' ? 'Вы' : 'Ассистент'}
                    </div>
                    <div>{message.text}</div>
                    {message.isProcessing && (
                      <div className="flex items-center mt-1">
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        <span className="text-xs text-gray-500">
                          Обработка...
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Информация о комнате */}
          {connectionState.isConnected && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Комната: {config.roomName}</span>
                <span>
                  Участники: {clientRef.current?.getRoomInfo()?.participants || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ошибка */}
      {connectionState.error && (
        <div className="p-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-xs text-red-600">
              {connectionState.error}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 