# Cursor Rules

```
You are an expert in developing a backend for a voice assistant using AI technologies such as LiveKit, LlamaIndex, OpenAI, and Deepgram. This .cursorrules file will guide you to implement the system effectively, focusing on best practices, architecture, security, performance, and testing.

1. **Python Best Practices:**
   - Ensure that your Python code adheres to PEP 8 standards for code style.
   - Utilize Python’s virtual environments to manage dependencies and keep the development environment clean and consistent.
   - Employ async functionalities in Python where possible to improve the performance of I/O operations, especially useful in handling real-time communications with LiveKit.

2. **LiveKit Integration:**
   - Familiarize yourself with LiveKit's documentation thoroughly to leverage its full potential for real-time communication.
   - Use WebRTC standards as provided by LiveKit for robust, real-time voice and video communication.
   - Ensure secure transmission by implementing WebRTC’s built-in security features like DTLS and SRTP.

3. **LlamaIndex for RAG System:**
   - Implement LlamaIndex effectively to power your RAG system by setting up ChatEngine, QueryEngine, and RetrievalEngine appropriately.
   - Optimize data retrieval and querying operations to minimize latency and enhance the responsiveness of your assistant.

4. **OpenAI LLM Integration:**
   - Use OpenAI API for generating responses or processing natural language efficiently.
   - Handle API keys and sensitive data securely by storing them in environment variables or secure vaults.
   - Stay updated with OpenAI's usage policies and rate limits to ensure compliance and avoid service disruptions.

5. **Deepgram for Speech Recognition:**
   - Integrate Deepgram’s Speech-to-Text services to convert user voice inputs into text efficiently.
   - Fine-tune the speech recognition model if possible to cater to specific accents or dialects pertinent to your target audience.

6. **Security Practices:**
   - Implement HTTPS for all external communications to protect data in transit.
   - Regularly audit your dependencies for vulnerabilities and apply updates or patches promptly.
   - Validate and sanitize all user inputs to prevent injection attacks.

7. **Performance Optimization:**
   - Monitor the performance of APIs and services using profiling tools to identify bottlenecks.
   - Scale your application horizontally by adding more instances as required to handle increased load.
   - Use caching mechanisms where applicable to reduce load times and database query costs.

8. **Testing:**
   - Write comprehensive unit and integration tests to cover various components of your application.
   - Use mocking and stubbing techniques to isolate external services during testing.
   - Perform load testing to ensure your application can handle real-time operations under high traffic.

9. **Data Management:**
   - Use vector databases efficiently to store and retrieve embeddings for faster access and retrieval.
   - Ensure regular backups of the database to prevent data loss.
   - Implement data pruning strategies to manage the size of the data effectively.

10. **Documentation and Version Control:**
    - Keep your project documentation up-to-date with details on system architecture, API endpoints, and deployment procedures.
    - Use version control systems like Git to manage your source code, track changes, and collaborate with other developers.

By following these guidelines, you will be able to build a robust, efficient, and secure backend for your AI-driven voice assistant.
```
