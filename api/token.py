import os
import jwt
import time
from typing import Optional, Dict, Any
from http.server import BaseHTTPRequestHandler
import json

class TokenHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Обработка POST запросов для генерации токенов"""
        try:
            # Получаем переменные окружения
            api_key = os.getenv('LIVEKIT_API_KEY')
            api_secret = os.getenv('LIVEKIT_API_SECRET')
            
            if not api_key or not api_secret:
                self.send_error(500, "Missing LiveKit credentials")
                return
            
            # Читаем тело запроса
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            try:
                request_data = json.loads(body) if body else {}
            except json.JSONDecodeError:
                request_data = {}
            
            # Извлекаем параметры
            room_name = request_data.get('roomName', 'default-room')
            participant_name = request_data.get('participantName', f'user-{int(time.time())}')
            
            # Генерируем токен
            token = generate_livekit_token(
                api_key=api_key,
                api_secret=api_secret,
                room_name=room_name,
                participant_name=participant_name
            )
            
            # Отправляем ответ
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            response = {
                'token': token,
                'url': os.getenv('LIVEKIT_URL', 'wss://your-project.livekit.cloud')
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Error generating token: {str(e)}")
    
    def do_OPTIONS(self):
        """Обработка OPTIONS запросов для CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def generate_livekit_token(
    api_key: str,
    api_secret: str,
    room_name: str,
    participant_name: str,
    ttl: int = 3600
) -> str:
    """
    Генерирует JWT токен для LiveKit
    
    Args:
        api_key: LiveKit API ключ
        api_secret: LiveKit API секрет
        room_name: Название комнаты
        participant_name: Имя участника
        ttl: Время жизни токена в секундах (по умолчанию 1 час)
    
    Returns:
        JWT токен для подключения к LiveKit
    """
    now = int(time.time())
    
    # Полезная нагрузка JWT
    payload = {
        'iss': api_key,
        'sub': participant_name,
        'aud': 'livekit',
        'exp': now + ttl,
        'nbf': now,
        'iat': now,
        'room': room_name,
        'permissions': {
            'canPublish': True,
            'canSubscribe': True,
            'canPublishData': True,
            'canUpdateMetadata': True
        }
    }
    
    # Генерируем токен
    token = jwt.encode(payload, api_secret, algorithm='HS256')
    
    return token

# Для Vercel serverless функций
def handler(request, context):
    """Vercel serverless function handler"""
    
    # Проверяем метод запроса
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Получаем переменные окружения
        api_key = os.getenv('LIVEKIT_API_KEY')
        api_secret = os.getenv('LIVEKIT_API_SECRET')
        
        if not api_key or not api_secret:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Missing LiveKit credentials'})
            }
        
        # Парсим тело запроса
        body = request.get('body', '{}')
        if isinstance(body, str):
            request_data = json.loads(body) if body else {}
        else:
            request_data = body
        
        # Извлекаем параметры
        room_name = request_data.get('roomName', 'default-room')
        participant_name = request_data.get('participantName', f'user-{int(time.time())}')
        
        # Генерируем токен
        token = generate_livekit_token(
            api_key=api_key,
            api_secret=api_secret,
            room_name=room_name,
            participant_name=participant_name
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'token': token,
                'url': os.getenv('LIVEKIT_URL', 'wss://your-project.livekit.cloud')
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': f'Error generating token: {str(e)}'})
        } 