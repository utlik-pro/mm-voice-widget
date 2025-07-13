import os
from typing import Dict, Optional
from openai import OpenAI

class ChatRulesGenerator:
    def __init__(self, api_key: Optional[str] = None):
        """
        Инициализация генератора с OpenAI API ключом.
        """
        if api_key:
            self.client = OpenAI(api_key=api_key)
        else:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OpenAI API key не найден. Передайте api_key или установите переменную окружения OPENAI_API_KEY")
            self.client = OpenAI(api_key=api_key)
    
    def generate_rag_livekit_rules(self, project_description: str, additional_context: str = "") -> str:
        """
        Генерирует специализированные .cursorrules для RAG проекта с LiveKit.
        """
        system_prompt = """Ты эксперт по созданию .cursorrules файлов для IDE Cursor, специализирующийся на RAG (Retrieval-Augmented Generation) системах с LiveKit.

Твоя задача - создать максимально полезный .cursorrules файл для проекта RAG с LiveKit, основываясь на:
1. Архитектуре из примера: https://github.com/avijeett007/kno2gether-webrtc-agent/tree/develop/RAG
2. Документации LiveKit: https://docs.livekit.io/agents/build/external-data/
3. Использовании LlamaIndex для RAG функциональности
4. Интеграции с WebRTC для голосовых агентов

ВСЕГДА начинай с "You are an expert in..." и включай:
- Специфичные практики для RAG с LiveKit
- Работу с LlamaIndex (ChatEngine, QueryEngine, RetrievalEngine)
- Интеграцию с OpenAI и Deepgram
- Управление векторными базами данных
- Обработку голосовых данных через WebRTC
- Паттерны для агентов реального времени
- Безопасность и производительность для RAG систем

Формат ответа: только текст .cursorrules, без дополнительных пояснений."""

        user_prompt = f"""Создай .cursorrules для RAG проекта с LiveKit:

Описание проекта: {project_description}

Дополнительный контекст:
{additional_context}

Архитектура проекта включает:
- Python Voice Agent с LiveKit
- RAG система с LlamaIndex
- Различные RAG движки: ChatEngine, QueryEngine, RetrievalEngine
- Интеграция с OpenAI API
- Deepgram для распознавания речи
- WebRTC для реального времени
- Векторные базы данных для хранения знаний

Создай максимально релевантные правила для эффективной разработки такой системы."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "developer", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=2500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Ошибка при генерации правил: {str(e)}"

def save_rules_md(rules_text: str, filename: str = 'rag_livekit_rules.md'):
    """
    Сохраняет итоговые правила в .md-файл.
    """
    os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else '.', exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# RAG LiveKit Cursor Rules\n\n```\n{rules_text}\n```\n")

def main():
    try:
        generator = ChatRulesGenerator()
        
        # Описание проекта RAG с LiveKit
        project_description = """
        RAG (Retrieval-Augmented Generation) система с LiveKit для создания голосовых агентов.
        Используется архитектура из https://github.com/avijeett007/kno2gether-webrtc-agent/tree/develop/RAG
        с документацией LiveKit https://docs.livekit.io/agents/build/external-data/
        """
        
        additional_context = """
        Проект включает:
        - LlamaIndexChatEngineRAGAgent.py - чат-движок для RAG
        - LlamaIndexQueryEngineRAGAgent.py - поисковый движок для RAG  
        - LlamaIndexRetrievalEngineRAGAgent.py - движок извлечения для RAG
        - dental_data/ - пример данных для RAG
        - testQuestions - тестовые вопросы
        - Интеграция с OpenAI, Deepgram
        - WebRTC для реального времени
        - Векторные базы данных
        """
        
        print("Генерирую .cursorrules для RAG проекта с LiveKit...")
        
        # Генерируем правила
        rules = generator.generate_rag_livekit_rules(project_description, additional_context)
        print('\nСгенерированные правила для RAG + LiveKit проекта:\n')
        print(rules)
        
        # Сохраняем файл
        while True:
            answer = input('\nСохранить в rag_livekit_rules.md? (y/n): ').strip().lower()
            if answer == 'y':
                save_rules_md(rules, 'rag_livekit_rules.md')
                print('Сохранено в rag_livekit_rules.md')
                break
            elif answer == 'n':
                print('Файл не сохранён.')
                break
            else:
                print("Пожалуйста, введите 'y' для сохранения или 'n' для отмены.")
                
    except Exception as e:
        print(f"Ошибка: {str(e)}")
        print("Убедитесь, что установлена переменная окружения OPENAI_API_KEY")

if __name__ == '__main__':
    main() 