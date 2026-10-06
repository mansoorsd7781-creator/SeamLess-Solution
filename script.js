// ================================
// GEMINI API SETTINGS
// ================================

const GEMINI_API_KEY = "";

const MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash"
];


// ================================
// HTML ELEMENTS
// ================================

const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");


// ================================
// CHAT HISTORY
// ================================

let conversation = [];


// ================================
// REMOVE WELCOME SCREEN
// ================================

function removeWelcome() {

    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }
}


// ================================
// ADD MESSAGE
// ================================

function addMessage(text, type) {

    removeWelcome();

    const row = document.createElement("div");

    row.className = `message-row ${type}`;

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.textContent = text;

    row.appendChild(message);

    chatArea.appendChild(row);

    chatArea.scrollTop = chatArea.scrollHeight;

    return message;
}


// ================================
// ASK GEMINI
// ================================

async function getAIResponse(userMessage) {

    if (
        !GEMINI_API_KEY ||
        GEMINI_API_KEY === "YOUR_NEW_API_KEY_HERE"
    ) {
        throw new Error(
            "Please add your Gemini API key in script.js"
        );
    }


    // Add user message once

    conversation.push({
        role: "user",
        parts: [
            {
                text: userMessage
            }
        ]
    });


    let lastError = null;


    // Try different models

    for (const model of MODELS) {

        try {

            const url =
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;


            const response = await fetch(url, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY
                },

                body: JSON.stringify({
                    contents: conversation
                })

            });


            const data = await response.json();


            // Model temporarily unavailable

            if (
                response.status === 503 ||
                response.status === 429
            ) {

                lastError =
                    data?.error?.message ||
                    `${model} is temporarily unavailable.`;

                console.log(
                    `${model} unavailable. Trying another model...`
                );

                continue;
            }


            // Other API error

            if (!response.ok) {

                throw new Error(
                    data?.error?.message ||
                    "Gemini API request failed."
                );
            }


            // Get AI answer

            const answer =
                data?.candidates?.[0]
                    ?.content
                    ?.parts
                    ?.map(part => part.text || "")
                    .join("")
                    .trim();


            if (!answer) {

                throw new Error(
                    "Gemini returned an empty response."
                );
            }


            // Save AI response

            conversation.push({

                role: "model",

                parts: [
                    {
                        text: answer
                    }
                ]

            });


            console.log(
                `Response received from ${model}`
            );


            return answer;

        }

        catch (error) {

            lastError = error;

            console.error(
                `${model} failed:`,
                error
            );
        }
    }


    // All models failed

    throw new Error(
        "All Gemini models are currently unavailable. Please try again in a few minutes."
    );
}


// ================================
// SEND MESSAGE
// ================================

async function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    // Display user message

    addMessage(text, "user");


    // Clear input

    messageInput.value = "";

    messageInput.style.height = "auto";


    // Disable button

    sendBtn.disabled = true;


    // Loading message

    const loadingMessage =
        addMessage("Thinking...", "ai");


    try {

        const answer =
            await getAIResponse(text);


        loadingMessage.textContent =
            answer;

    }

    catch (error) {

        console.error(error);

        loadingMessage.textContent =
            "Error: " + error.message;

    }

    finally {

        sendBtn.disabled = false;

        messageInput.focus();
    }
}


// ================================
// SEND BUTTON
// ================================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ================================
// ENTER KEY
// ================================

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


// ================================
// AUTO RESIZE
// ================================

messageInput.addEventListener(
    "input",
    function () {

        this.style.height = "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                150
            ) + "px";
    }
);


// ================================
// SUGGESTIONS
// ================================

function activateSuggestions() {

    const buttons =
        document.querySelectorAll(".suggestion");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                messageInput.value =
                    this.textContent.trim();

                sendMessage();

            }
        );

    });
}


activateSuggestions();


// ================================
// NEW CHAT
// ================================

newChatBtn.addEventListener(
    "click",
    function () {

        conversation = [];


        chatArea.innerHTML = `

            <div class="welcome">

                <div class="welcome-icon">
                    ✦
                </div>

                <h2>
                    How can I help you?
                </h2>

                <p>
                    Ask anything about coding,
                    mathematics, science,
                    study, writing and
                    general knowledge.
                </p>

                <div class="suggestions">

                    <button class="suggestion">
                        Explain artificial intelligence
                    </button>

                    <button class="suggestion">
                        Write a Python palindrome program
                    </button>

                    <button class="suggestion">
                        What is a database?
                    </button>

                    <button class="suggestion">
                        Explain recursion simply
                    </button>

                </div>

            </div>

        `;


        activateSuggestions();

        messageInput.focus();
    }
);