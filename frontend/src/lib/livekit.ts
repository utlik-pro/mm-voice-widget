import { Room, RoomOptions, Track, LocalTrack, RemoteTrack, AudioTrack, VideoTrack, RoomEvent, TrackEvent, LocalParticipant, RemoteParticipant, ParticipantEvent, ConnectionState, DisconnectReason } from 'livekit-client';
import { 
  VoiceWidgetConfig, 
  TokenResponse, 
  VoiceConnectionState, 
  LiveKitTokenRequest, 
  LiveKitConnectionParams, 
  ConnectionStatus 
} from '../types';

export class LiveKitVoiceClient {
  private room: Room | null = null;
  private config: VoiceWidgetConfig;
  private connectionState: VoiceConnectionState;
  private onStateChange?: (state: VoiceConnectionState) => void;
  private onError?: (error: Error) => void;

  constructor(config: VoiceWidgetConfig) {
    this.config = config;
    this.connectionState = {
      isConnected: false,
      isConnecting: false,
      isRecording: false,
      error: null,
      connectionQuality: 'unknown'
    };
  }

  /**
   * Получает токен для подключения к LiveKit
   */
  async getToken(roomName: string, participantName: string): Promise<TokenResponse> {
    const requestData: LiveKitTokenRequest = {
      roomName,
      participantName
    };

    try {
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw new Error('Failed to get authentication token');
    }
  }

  /**
   * Подключается к LiveKit комнате
   */
  async connect(): Promise<void> {
    if (this.room && this.room.state === ConnectionState.Connected) {
      console.log('Already connected to room');
      return;
    }

    try {
      this.updateConnectionState({ isConnecting: true, error: null });

      const participantName = this.config.participantName || `user-${Date.now()}`;
      const tokenData = await this.getToken(this.config.roomName, participantName);

      // Создаем новую комнату
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000,
            priority: 'high'
          }
        },
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
            frameRate: 30
          }
        }
      });

      this.setupRoomEventHandlers();

      // Подключаемся к комнате
      await this.room.connect(tokenData.url, tokenData.token);

      // Включаем микрофон
      await this.room.localParticipant.setMicrophoneEnabled(true);

      this.updateConnectionState({ 
        isConnected: true, 
        isConnecting: false,
        error: null 
      });

      console.log('Successfully connected to LiveKit room');
    } catch (error) {
      console.error('Failed to connect to LiveKit:', error);
      this.updateConnectionState({ 
        isConnected: false, 
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
      throw error;
    }
  }

  /**
   * Отключается от LiveKit комнаты
   */
  async disconnect(): Promise<void> {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
    }

    this.updateConnectionState({
      isConnected: false,
      isConnecting: false,
      isRecording: false,
      error: null,
      connectionQuality: 'unknown'
    });
  }

  /**
   * Включает/выключает микрофон
   */
  async toggleMicrophone(): Promise<boolean> {
    if (!this.room) {
      throw new Error('Not connected to room');
    }

    const isEnabled = this.room.localParticipant.isMicrophoneEnabled;
    await this.room.localParticipant.setMicrophoneEnabled(!isEnabled);
    
    this.updateConnectionState({
      isRecording: !isEnabled
    });

    return !isEnabled;
  }

  /**
   * Получает текущее состояние микрофона
   */
  isMicrophoneEnabled(): boolean {
    return this.room?.localParticipant.isMicrophoneEnabled || false;
  }

  /**
   * Настраивает обработчики событий комнаты
   */
  private setupRoomEventHandlers(): void {
    if (!this.room) return;

    // Обработка подключения участников
    this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      console.log('Participant connected:', participant.identity);
      this.setupParticipantEventHandlers(participant);
    });

    // Обработка отключения участников
    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      console.log('Participant disconnected:', participant.identity);
    });

    // Обработка треков
    this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication, participant: RemoteParticipant) => {
      console.log('Track subscribed:', track.kind, 'from', participant.identity);
      
      if (track.kind === Track.Kind.Audio) {
        const audioTrack = track as AudioTrack;
        this.handleAudioTrack(audioTrack, participant);
      }
    });

    // Обработка качества соединения
    this.room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      if (participant === this.room?.localParticipant) {
        this.updateConnectionState({
          connectionQuality: this.mapConnectionQuality(quality)
        });
      }
    });

    // Обработка отключения
    this.room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
      console.log('Disconnected from room:', reason);
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        isRecording: false,
        error: reason ? `Disconnected: ${reason}` : null
      });
    });

    // Обработка ошибок
    this.room.on(RoomEvent.RoomMetadataChanged, (metadata) => {
      console.log('Room metadata changed:', metadata);
    });
  }

  /**
   * Настраивает обработчики событий участника
   */
  private setupParticipantEventHandlers(participant: RemoteParticipant): void {
    participant.on(ParticipantEvent.TrackPublished, (publication) => {
      console.log('Track published:', publication.kind, 'by', participant.identity);
    });

    participant.on(ParticipantEvent.TrackUnpublished, (publication) => {
      console.log('Track unpublished:', publication.kind, 'by', participant.identity);
    });
  }

  /**
   * Обрабатывает аудио трек
   */
  private handleAudioTrack(track: AudioTrack, participant: RemoteParticipant): void {
    // Создаем HTML audio элемент для воспроизведения
    const audioElement = track.attach();
    audioElement.autoplay = true;
    
    // Добавляем в DOM (скрытый)
    audioElement.style.display = 'none';
    document.body.appendChild(audioElement);
    
    // Удаляем при отключении трека
    track.on(TrackEvent.Ended, () => {
      track.detach();
      if (audioElement.parentNode) {
        audioElement.parentNode.removeChild(audioElement);
      }
    });
  }

  /**
   * Преобразует качество соединения LiveKit в наш формат
   */
  private mapConnectionQuality(quality: any): VoiceConnectionState['connectionQuality'] {
    switch (quality) {
      case 'excellent':
        return 'excellent';
      case 'good':
        return 'good';
      case 'poor':
        return 'poor';
      default:
        return 'unknown';
    }
  }

  /**
   * Обновляет состояние соединения
   */
  private updateConnectionState(updates: Partial<VoiceConnectionState>): void {
    this.connectionState = { ...this.connectionState, ...updates };
    
    if (this.onStateChange) {
      this.onStateChange(this.connectionState);
    }
  }

  /**
   * Устанавливает обработчик изменения состояния
   */
  setOnStateChange(handler: (state: VoiceConnectionState) => void): void {
    this.onStateChange = handler;
  }

  /**
   * Устанавливает обработчик ошибок
   */
  setOnError(handler: (error: Error) => void): void {
    this.onError = handler;
  }

  /**
   * Получает текущее состояние соединения
   */
  getConnectionState(): VoiceConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Получает информацию о комнате
   */
  getRoomInfo(): { name: string; participants: number } | null {
    if (!this.room) return null;
    
    return {
      name: this.room.name,
      participants: this.room.numParticipants
    };
  }
}

/**
 * Утилита для проверки поддержки WebRTC
 */
export function isWebRTCSupported(): boolean {
  return typeof RTCPeerConnection !== 'undefined';
}

/**
 * Утилита для проверки разрешений микрофона
 */
export async function checkMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return false;
  }
} 