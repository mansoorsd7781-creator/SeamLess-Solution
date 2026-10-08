// ===============================
// DOM Elements
// ===============================

const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");


// ===============================
// Conversation History
// ===============================

let conversation = [];


// ===============================
// Remove Welcome Screen
// ===============================

function removeWelcome() {

    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }
}


// ===============================
// Add Message to Chat
// ===============================

function addMessage(text, sender) {

    removeWelcome();

    const messageContainer = document.createElement("div");

    messageContainer.classList.add(
        "message",
        sender === "user"
            ? "user-message"
            : "ai-message"
    );

    const messageContent =
        document.createElement("div");

    messageContent.classList.add(
        "message-content"
    );

    messageContent.textContent = text;

    messageContainer.appendChild(
        messageContent
    );

    chatArea.appendChild(
        messageContainer
    );

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


// ===============================
// Get AI Response
// ===============================

async function getAIResponse(userMessage) {

    // Add user message to conversation

    conversation.push({
        role: "user",
        parts: [
            {
                text: userMessage
            }
        ]
    });


    try {

        // Send conversation to backend

        const response = await fetch(
            "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    contents: conversation
                })
            }
        );


        // Read response

        const data =
            await response.json();


        // Check for backend error

        if (!response.ok) {

            throw new Error(
                data?.error ||
                "AI request failed."
            );
        }


        // Get AI answer

        const answer =
            data?.answer;


        if (!answer) {

            throw new Error(
                "The AI returned an empty response."
            );
        }


        // Add AI response to conversation

        conversation.push({
            role: "model",
            parts: [
                {
                    text: answer
                }
            ]
        });


        return answer;


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        throw error;
    }
}


// ===============================
// Send Message
// ===============================

async function sendMessage() {

    const userMessage =
        messageInput.value.trim();


    // Don't send empty messages

    if (!userMessage) {
        return;
    }


    // Clear input

    messageInput.value = "";

    messageInput.style.height =
        "auto";


    // Show user message

    addMessage(
        userMessage,
        "user"
    );


    // Disable send button

    sendBtn.disabled = true;

    sendBtn.textContent =
        "Sending...";


    try {

        // Get AI response

        const answer =
            await getAIResponse(
                userMessage
            );


        // Display AI response

        addMessage(
            answer,
            "ai"
        );


    } catch (error) {

        console.error(
            error
        );


        // Display error

        addMessage(
            `Error: ${error.message}`,
            "ai"
        );


    } finally {

        // Enable send button

        sendBtn.disabled = false;

        sendBtn.textContent =
            "Send";

        messageInput.focus();
    }
}


// ===============================
// Send Button
// ===============================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ===============================
// Enter Key
// ===============================

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);


// ===============================
// Auto Resize Textarea
// ===============================

messageInput.addEventListener(
    "input",
    function () {

        this.style.height =
            "auto";

        this.style.height =
            this.scrollHeight + "px";
    }
);


// ===============================
// Suggestion Buttons
// ===============================

function setupSuggestionButtons() {

    const suggestionButtons =
        document.querySelectorAll(
            ".suggestion"
        );


    suggestionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const text =
                        this.textContent.trim();


                    messageInput.value =
                        text;


                    messageInput.focus();


                    messageInput.style.height =
                        "auto";


                    messageInput.style.height =
                        messageInput.scrollHeight +
                        "px";
                }
            );

        }
    );
}


// Setup suggestions when page loads

setupSuggestionButtons();


// ===============================
// New Chat
// ===============================

newChatBtn.addEventListener(
    "click",
    function () {

        // Clear conversation

        conversation = [];


        // Clear input

        messageInput.value = "";

        messageInput.style.height =
            "auto";


        // Restore welcome screen

        chatArea.innerHTML = `

            <div class="welcome">

                <div class="welcome-icon">
                    ✨
                </div>

                <h1>
                    How can I help you today?
                </h1>

                <p>
                    Ask me anything and I'll do my best
                    to help you.
                </p>


                <div class="suggestions">

                    <button class="suggestion">
                        Explain quantum computing
                    </button>

                    <button class="suggestion">
                        Write a Python program
                    </button>

                    <button class="suggestion">
                        Give me study tips
                    </button>

                    <button class="suggestion">
                        Help me plan my day
                    </button>

                </div>

            </div>

        `;


        // Setup new suggestion buttons

        setupSuggestionButtons();


        // Focus input

        messageInput.focus();
    }
);