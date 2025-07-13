import os
from typing import List, Dict, Optional, Tuple
from openai import OpenAI

class CursorRulesGenerator:
    def __init__(self, api_key: Optional[str] = None):
        """
        Инициализация генератора с OpenAI API ключом.
        Если api_key не передан, пытается взять из переменной окружения OPENAI_API_KEY.
        """
        if api_key:
            self.client = OpenAI(api_key=api_key)
        else:
            # Попытка взять из переменной окружения
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OpenAI API key не найден. Передайте api_key или установите переменную окружения OPENAI_API_KEY")
            self.client = OpenAI(api_key=api_key)
    
    def generate_cursorrules(self, user_query: str, clarifications: Optional[Dict[str, str]] = None) -> str:
        """
        Генерирует .cursorrules с помощью OpenAI GPT-4.1.
        """
        # Создаем контекст для LLM
        context = f"Пользователь описал свой проект: {user_query}"
        
        if clarifications:
            context += "\n\nДополнительные уточнения:"
            for question, answer in clarifications.items():
                if answer.strip():
                    context += f"\n- {question}: {answer}"
        
        # Промпт для генерации .cursorrules
        system_prompt = """Ты эксперт по написанию .cursorrules файлов для IDE Cursor.

.cursorrules файлы - это инструкции для AI-ассистента в Cursor IDE, которые определяют как он должен действовать при работе с кодом.

Твоя задача:
1. Проанализировать описание проекта пользователя
2. Создать качественный .cursorrules файл, который будет максимально полезен для разработки этого проекта
3. ВСЕГДА начинать с "You are an expert in..."
4. Включить релевантные рекомендации по:
   - Технологиям и фреймворкам
   - Стилю кода и архитектуре
   - Лучшим практикам
   - Безопасности
   - Производительности
   - Тестированию
   - Документации

Формат ответа: только текст .cursorrules, без дополнительных пояснений.

Примеры хороших .cursorrules:

```
You are an expert in React, Next.js, TypeScript, and modern web development.

Code Style and Structure
- Use functional components with hooks over class components
- Implement proper TypeScript types for all props and state
- Use descriptive variable and function names
- Prefer named exports over default exports
- Use kebab-case for file and folder names

Performance and Optimization
- Implement code splitting and lazy loading
- Use React.memo for expensive components
- Optimize images and assets
- Use proper caching strategies

Testing and Quality
- Write unit tests for all components
- Use React Testing Library for component tests
- Implement proper error boundaries
- Use ESLint and Prettier for code formatting
```

```
You are an expert in Python, Django, and web development best practices.

Code Organization
- Follow Django project structure conventions
- Use class-based views for complex logic, function-based for simple cases
- Implement proper model relationships and migrations
- Use Django REST Framework for APIs

Security and Performance
- Always validate user input
- Use Django's built-in security features
- Implement proper authentication and authorization
- Use database indexing for performance
- Cache expensive operations

Testing and Documentation
- Write comprehensive unit and integration tests
- Use Django's testing framework
- Document all API endpoints
- Follow PEP 8 coding standards
```"""

        user_prompt = f"""Создай .cursorrules файл для следующего проекта:

{context}

Сгенерируй максимально релевантные и полезные правила для этого проекта."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1",  # Используем GPT-4.1 как в примере
                messages=[
                    {"role": "developer", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Ошибка при генерации правил: {str(e)}"

    def get_clarifying_questions(self, user_query: str) -> List[str]:
        """
        Генерирует уточняющие вопросы с помощью OpenAI GPT-4.1.
        """
        system_prompt = """Ты помощник, который задает уточняющие вопросы для лучшего понимания проекта разработки.

Твоя задача:
1. Проанализировать описание проекта пользователя
2. Сгенерировать 2-4 самых важных уточняющих вопроса
3. Вопросы должны помочь лучше понять технические требования, архитектуру, стиль кода и особенности проекта
4. Избегать слишком общих или очевидных вопросов

Формат ответа: каждый вопрос на новой строке, без нумерации."""

        user_prompt = f"""Пользователь описал свой проект: {user_query}

Какие уточняющие вопросы помогут лучше понять проект для создания качественных правил разработки?"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4.1",  # Используем GPT-4.1 как в примере
                messages=[
                    {"role": "developer", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=500,
                temperature=0.8
            )
            
            questions = response.choices[0].message.content.strip().split('\n')
            return [q.strip() for q in questions if q.strip()]
            
        except Exception as e:
            return [f"Ошибка при генерации вопросов: {str(e)}"]

def save_rules_md(rules_text: str, filename: str = 'rules.md'):
    """
    Сохраняет итоговые правила в .md-файл.
    """
    # Создаем директорию если не существует
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# Cursor Rules\n\n```\n{rules_text}\n```\n")

def main():
    try:
        generator = CursorRulesGenerator()
        
        user_query = input('Опишите ваш проект или пожелания: ')
        
        # Генерируем уточняющие вопросы
        questions = generator.get_clarifying_questions(user_query)
        
        if questions and not any("Ошибка" in q for q in questions):
            print('\nУточняющие вопросы:')
            for i, q in enumerate(questions, 1):
                print(f"{i}. {q}")
            print("\nПожалуйста, введите ответы на вопросы по одному на строку, затем нажмите Enter дважды:")
            answers = []
            while True:
                line = input()
                if line == "":
                    break
                answers.append(line)
            clarifications = {q: (answers[i] if i < len(answers) else "") for i, q in enumerate(questions)}
        else:
            clarifications = {}
            if questions and any("Ошибка" in q for q in questions):
                print(f"\nОшибка при генерации вопросов: {questions[0]}")
        
        # Генерируем правила
        rules = generator.generate_cursorrules(user_query, clarifications)
        print('\nСгенерированные правила:\n')
        print(rules)
        
        # Сохраняем файл
        while True:
            answer = input('\nСохранить в rules.md? (y/n): ').strip().lower()
            if answer == 'y':
                rules_path = os.path.join('cursorrules_lib', 'rules', 'rules.md')
                save_rules_md(rules, filename=rules_path)
                print(f'Сохранено в {rules_path}')
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