# Cursor Rules

```
You are an expert in creating audio-only voice assistant widgets with LiveKit integration for real estate websites, specifically for selling apartments in residential complex "Минск Мир". Here are your guidelines:

1. **Technology Stack Recommendations:**
   - For the frontend, ensure React components are optimized for performance. Use React.memo and useCallback to avoid unnecessary re-renders.
   - Utilize TypeScript for type safety. Regularly update types and interfaces to reflect changes in data structures.
   - With Vite, configure build optimizations like minification and tree shaking to enhance load times.
   - Employ TailwindCSS for rapid UI development, but ensure that unused styles are purged in production builds.
   - Integrate LiveKit Client SDK properly by managing connection states and errors gracefully to enhance user experience.

2. **Architecture Best Practices:**
   - Implement clean architecture in the backend, separating concerns and making the system more maintainable.
   - Use serverless functions efficiently to handle spikes in load, especially during high traffic on real estate websites.
   - For state management in React, consider using Context API or Redux for managing states related to voice interactions.
   - Secure iframe communication using postMessage and validate messages rigorously to prevent XSS attacks.

3. **Security Measures:**
   - Ensure all data exchanges between the iframe and the main website are secured and authenticated.
   - Implement robust error handling and input validation both on client and server sides to prevent injection attacks.
   - Use PyJWT securely by validating and verifying all tokens to protect against CSRF and other token-based attacks.
   - Configure CORS properly to restrict resources to be accessed only by specified origins.

4. **Performance Optimization:**
   - Optimize audio-only streaming by using LiveKit's capabilities for adaptive bitrate streaming based on network conditions.
   - Implement noise cancellation effectively to improve voice interaction quality, especially in noisy environments.
   - Use Web Workers in the frontend if computational heavy tasks are needed, to avoid blocking the UI thread.
   - Focus on audio processing optimization since no video stream is required.

5. **Testing and Quality Assurance:**
   - Implement unit tests for both frontend and backend components using appropriate frameworks like Jest for React and PyTest for Python.
   - Use integration tests to cover the end-to-end functionality of the voice interactions.
   - Perform load testing to ensure the system can handle the expected number of simultaneous users, particularly important for high-traffic real estate websites.

6. **Deployment and Monitoring:**
   - Automate deployments using Vercel along with additional tools like Dokploy to ensure smooth, repeatable builds.
   - Set up comprehensive monitoring and logging to track the performance and usage of the voice assistant. Use tools like Sentry for real-time error tracking and Google Analytics for usage statistics.

7. **User Experience Enhancements:**
   - Design the widget to be mobile-responsive, ensuring it adapts seamlessly across devices.
   - Support touch events to enhance mobile user interaction.
   - Implement user feedback mechanisms, such as visual indicators when the assistant is listening or processing.

By adhering to these guidelines, you will develop a robust, efficient, and user-friendly audio-only voice assistant widget for ЖК Минск Мир apartment sales.

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
- Use appropriate embedding models for real estate domain, specifically for ЖК Минск Мир
- Implement proper metadata management for retrieved documents (apartments, prices, amenities)
- Use vector database indexing for fast similarity search
- Implement data versioning and update strategies for knowledge bases
- Focus on apartment sales data: floor plans, pricing, amenities, location benefits

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
- Include example configurations for different use cases

## ЖК Минск Мир Domain Specific
- Implement ЖК Минск Мир specific knowledge base for apartment sales
- Create embeddings for apartment descriptions, pricing, floor plans, and amenities
- Use domain-specific chunking strategies for real estate documents
- Implement apartment search and recommendation features through RAG
- Handle real estate terminology and jargon appropriately in responses
- Focus on specific residential complex features: location, infrastructure, apartment types
- Support lead generation and CRM integration for appointment booking

# LlamaIndex RAG Implementation Patterns

## Three RAG Engine Types
Based on the kno2gether-webrtc-agent implementation, use these three distinct RAG approaches:

### 1. ChatEngine RAG Agent (LlamaIndexChatEngineRAGAgent.py)
- Use `index.as_chat_engine(chat_mode="chat")` for conversational RAG
- Maintains conversation context and memory across multiple turns
- Best for: Interactive customer service scenarios where context matters
- Limitations: Cannot perform function calling while using chat engine
- Implementation: Create vector index from documents, then use as_chat_engine method

### 2. QueryEngine RAG Agent (LlamaIndexQueryEngineRAGAgent.py)
- Use `index.as_query_engine()` for single-query RAG operations
- Optimized for one-shot question answering without conversation memory
- Best for: FAQ systems, quick information retrieval
- Supports: Better integration with function calling capabilities
- Implementation: Direct query processing against vector index

### 3. RetrievalEngine RAG Agent (LlamaIndexRetrievalEngineRAGAgent.py)
- Use retrieval engine for document ranking and selection
- Provides more control over document retrieval process
- Best for: Advanced filtering, custom ranking algorithms
- Supports: Custom retrieval strategies and post-processing
- Implementation: Manual control over retrieval and generation steps

## Vector Store Management
- Check for existing vector store directory before creating new embeddings
- Store embeddings locally for development, use vector databases for production
- Implement simple caching: if embeddings exist, load them; otherwise create new ones
- Use persistent storage to avoid re-embedding documents on every restart

## Hybrid LLM Implementation
- Create combined LLM that can fallback between RAG and standard models
- Use RAG-enabled LLM as primary, OpenAI GPT-4o-mini as fallback
- Implement error handling for when RAG system fails
- Example: `combined_llm = CombinedLLM(chat_engine, fallback_model)`
- Configure GPT-4o-mini for cost-effective operation while maintaining quality

## Document Processing Pipeline
- Load documents from markdown files in data directory
- Support multiple document types: apartment descriptions, pricing, amenities, location info
- Implement domain-specific document chunking for ЖК Минск Мир apartment sales
- Create metadata for each document chunk for better retrieval
- Focus on apartment-specific data: square meters, floor, price, amenities, availability

## Function Calling Limitations
- ChatEngine RAG cannot perform function calls (booking appointments, CRM lead submission)
- Use QueryEngine or standard LLM for function calling scenarios
- Implement intelligent routing: RAG for apartment questions, standard LLM for lead generation
- Design conversation flow to handle both apartment information retrieval and CRM lead submission
- Focus on lead capture: name, phone, email, preferred apartment type, viewing appointment

## Production Considerations
- This is "almost production ready" - additional engineering needed
- Implement proper vector database instead of local storage
- Add comprehensive error handling and retry logic
- Create monitoring for RAG performance and accuracy
- Implement proper authentication and rate limiting

## Business Use Case Integration
- Handle dynamic conversations where users may ask questions OR provide contact information
- Implement intelligent routing between RAG (for apartment questions) and function calling (for lead submission)
- Support audio-only interactions for apartment sales inquiries
- Integrate with CRM systems for lead capture and appointment booking
- Enable human handoff when AI agent needs assistance
- Focus on converting website visitors into qualified leads for ЖК Минск Мир

## Testing and Evaluation
- Create test datasets with domain-specific questions
- Measure retrieval accuracy and response relevance
- Test conversation flow between RAG and function calling modes
- Validate document chunking and embedding quality
- Monitor response times and system performance

## WebRTC Agent Registration Pattern
- Agent registers as worker on LiveKit server when started
- LiveKit server automatically assigns worker to room when client joins
- Implement proper worker lifecycle management
- Handle multiple concurrent client connections
- Use room-based isolation for different conversations

## Audio-Only Voice Processing
- Implement audio-only streaming without video components
- Optimize for voice-first interactions in apartment sales context
- Use efficient audio codecs for better performance
- Implement proper audio buffering for real-time conversations
- Focus on speech clarity and noise reduction for apartment inquiries

## ЖК Минск Мир Apartment Sales Specific
- Implement apartment-specific knowledge base (floor plans, pricing, amenities)
- Create embeddings for apartment descriptions and residential complex features
- Handle apartment availability, pricing, and booking inquiries
- Implement GDPR compliance for lead data handling
- Support appointment booking and CRM lead submission
- Enable human agent handoff for complex sales questions
- Focus on GPT-4o-mini for cost-effective apartment sales conversations
```
