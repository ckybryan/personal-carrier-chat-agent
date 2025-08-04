/**
 * Career Chat Application
 * Handles the frontend chat interface functionality
 */

class ChatApp {
    constructor() {
        this.messagesDiv = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.history = [];
        
        this.init();
    }

    /**
     * Initialize the chat application
     */
    init() {
        this.bindEvents();
        this.messageInput.focus();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    /**
     * Add a message to the chat interface
     * @param {string} content - The message content
     * @param {boolean} isUser - Whether the message is from the user
     */
    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        
        // Add to history
        this.history.push({
            role: isUser ? 'user' : 'assistant',
            content: content
        });
    }

    /**
     * Show typing indicator
     */
    showTyping() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        messageDiv.id = 'typing';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content typing';
        
        const typingText = document.createElement('span');
        typingText.textContent = 'Thinking';
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'typing-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            dotsContainer.appendChild(dot);
        }
        
        messageContent.appendChild(typingText);
        messageContent.appendChild(dotsContainer);
        messageDiv.appendChild(messageContent);
        this.messagesDiv.appendChild(messageDiv);
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }

    /**
     * Hide typing indicator
     */
    hideTyping() {
        const typingDiv = document.getElementById('typing');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    /**
     * Hide welcome message
     */
    hideWelcomeMessage() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
    }

    /**
     * Enable/disable input controls
     * @param {boolean} enabled - Whether to enable the controls
     */
    toggleInputs(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
    }

    /**
     * Send a message to the chat API
     */
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Hide welcome message if it exists
        this.hideWelcomeMessage();

        // Disable input
        this.toggleInputs(false);

        // Add user message
        this.addMessage(message, true);
        this.messageInput.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.history.slice(-10) // Keep last 10 messages for context
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.hideTyping();
            this.addMessage(data.response, false);

        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error. Please try again.', false);
            console.error('Error:', error);
        } finally {
            // Re-enable input
            this.toggleInputs(true);
            this.messageInput.focus();
        }
    }
}

// Initialize the chat app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
