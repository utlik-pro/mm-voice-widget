import os

def generate_rag_livekit_cursorrules() -> str:
    """
    Генерирует специализированные .cursorrules для RAG проекта с LiveKit
    на основе архитектуры из https://github.com/avijeett007/kno2gether-webrtc-agent/tree/develop/RAG
    и документации LiveKit https://docs.livekit.io/agents/build/external-data/
    """
    
    rules = """You are an expert in Python, LiveKit, RAG (Retrieval-Augmented Generation), LlamaIndex, OpenAI, Deepgram, and real-time voice agent development.

# RAG Architecture and Implementation

## Core RAG Components
- Use LlamaIndex for RAG functionality with multiple engine types:
  - ChatEngine for conversational RAG interactions
  - QueryEngine for single-query RAG operations  
  - RetrievalEngine for document retrieval and ranking
- Implement proper vector database integration for knowledge storage
- Use semantic search for document retrieval with relevance scoring
- Implement context-aware response generation with retrieved documents

## LiveKit Integration Patterns
- Follow LiveKit Agents framework for real-time voice processing
- Implement proper WebRTC connection handling for voice streams
- Use LiveKit's participant management for multi-user scenarios
- Integrate with LiveKit's audio processing pipeline
- Handle connection state changes and error recovery gracefully

## Voice Processing and STT/TTS
- Use Deepgram for speech-to-text with real-time streaming
- Implement OpenAI TTS for natural voice synthesis
- Handle audio buffer management for real-time processing
- Implement noise cancellation and audio quality optimization
- Use proper audio format conversion and sampling rates

## Code Organization and Structure
- Separate RAG agents into distinct classes (ChatEngine, QueryEngine, RetrievalEngine)
- Use dependency injection for LLM and embedding models
- Implement proper configuration management for API keys and settings
- Create modular data ingestion pipelines for different document types
- Use factory patterns for creating different RAG engine instances

## Data Management and Vector Stores
- Implement efficient document chunking strategies for RAG
- Use appropriate embedding models for your domain (e.g., medical, legal)
- Implement proper metadata management for retrieved documents
- Use vector database indexing for fast similarity search
- Implement data versioning and update strategies for knowledge bases

## Error Handling and Resilience
- Implement comprehensive error handling for API failures
- Use circuit breaker patterns for external service calls
- Implement proper retry logic with exponential backoff
- Handle WebRTC connection drops and reconnection
- Log all errors with proper context for debugging

## Performance Optimization
- Implement caching for frequently accessed documents
- Use async/await patterns for concurrent processing
- Optimize vector search with proper indexing strategies
- Implement connection pooling for database connections
- Use streaming for large document processing

## Security and Privacy
- Implement proper API key management and rotation
- Use secure token-based authentication for LiveKit
- Implement data encryption for sensitive documents
- Follow GDPR/privacy compliance for user data
- Sanitize user inputs to prevent injection attacks

## Testing and Quality Assurance
- Write comprehensive unit tests for RAG components
- Implement integration tests for LiveKit voice flows
- Create test datasets for RAG evaluation (precision, recall, relevance)
- Use mock services for external API dependencies
- Implement load testing for real-time voice processing

## Monitoring and Observability
- Implement proper logging for RAG retrieval and generation
- Monitor voice processing latency and quality metrics
- Track document retrieval accuracy and relevance scores
- Implement health checks for all external services
- Use structured logging with correlation IDs

## Development Best Practices
- Follow Python PEP 8 style guidelines
- Use type hints for all function signatures
- Implement proper dependency management with requirements.txt
- Use environment variables for configuration
- Document all RAG-specific parameters and thresholds
- Implement proper resource cleanup for audio streams

## Real-time Agent Patterns
- Use event-driven architecture for voice interactions
- Implement proper state management for conversation context
- Handle interruptions and speech overlap gracefully
- Use proper buffering strategies for audio processing
- Implement conversation memory and context preservation

## Documentation and Deployment
- Document RAG model performance and evaluation metrics
- Create deployment guides for different environments
- Document LiveKit configuration and setup procedures
- Provide troubleshooting guides for common issues
- Include example configurations for different use cases"""

    return rules

def save_rules_md(rules_text: str, filename: str = 'rag_livekit_cursorrules.md'):
    """
    Сохраняет итоговые правила в .md-файл.
    """
    os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else '.', exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# RAG LiveKit Cursor Rules\n\n")
        f.write(f"Специализированные правила для разработки RAG систем с LiveKit\n")
        f.write(f"на основе архитектуры из https://github.com/avijeett007/kno2gether-webrtc-agent/tree/develop/RAG\n\n")
        f.write(f"```\n{rules_text}\n```\n")

def main():
    print("Генерирую специализированные .cursorrules для RAG проекта с LiveKit...")
    print("Основано на архитектуре: https://github.com/avijeett007/kno2gether-webrtc-agent/tree/develop/RAG")
    print("Документация LiveKit: https://docs.livekit.io/agents/build/external-data/")
    print()
    
    # Генерируем правила
    rules = generate_rag_livekit_cursorrules()
    print('Сгенерированные правила для RAG + LiveKit проекта:\n')
    print(rules)
    
    # Сохраняем файл
    while True:
        answer = input('\nСохранить в rag_livekit_cursorrules.md? (y/n): ').strip().lower()
        if answer == 'y':
            save_rules_md(rules, 'rag_livekit_cursorrules.md')
            print('Сохранено в rag_livekit_cursorrules.md')
            
            # Также создаем .cursorrules файл для прямого использования
            with open('.cursorrules', 'w', encoding='utf-8') as f:
                f.write(rules)
            print('Также сохранено в .cursorrules для прямого использования в Cursor')
            break
        elif answer == 'n':
            print('Файл не сохранён.')
            break
        else:
            print("Пожалуйста, введите 'y' для сохранения или 'n' для отмены.")

if __name__ == '__main__':
    main() 