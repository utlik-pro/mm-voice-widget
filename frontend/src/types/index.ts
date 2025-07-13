export interface VoiceWidgetConfig {
  tokenEndpoint: string;
  roomName: string;
  participantName?: string;
  serverUrl?: string;
  autoConnect?: boolean;
  enableTranscription?: boolean;
  theme?: 'light' | 'dark';
}

export interface TokenResponse {
  token: string;
  url: string;
}

export interface VoiceConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  isRecording: boolean;
  error: string | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
}

export interface TranscriptionData {
  text: string;
  isFinal: boolean;
  timestamp: number;
  confidence?: number;
}

export interface VoiceMessage {
  id: string;
  text: string;
  timestamp: number;
  type: 'user' | 'assistant';
  isProcessing?: boolean;
}

export interface AudioSettings {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  sampleRate: number;
  channelCount: number;
}

export interface VoiceWidgetProps {
  config: VoiceWidgetConfig;
  onConnectionStateChange?: (state: VoiceConnectionState) => void;
  onTranscription?: (data: TranscriptionData) => void;
  onMessage?: (message: VoiceMessage) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export interface LiveKitTokenRequest {
  roomName: string;
  participantName: string;
}

export interface LiveKitConnectionParams {
  token: string;
  serverUrl: string;
  roomName: string;
  participantName: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface VoiceAgent {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  capabilities: string[];
}

export interface VoiceSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  messages: VoiceMessage[];
  agent: VoiceAgent;
  participantName: string;
} 