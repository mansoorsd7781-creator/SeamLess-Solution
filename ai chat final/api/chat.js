export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }


    // Get API key from Vercel environment variable
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({
            error: "Gemini API key is not configured on the server."
        });
    }


    try {

        // Get conversation from frontend
        const { contents } = req.body;


        if (!contents || !Array.isArray(contents)) {
            return res.status(400).json({
                error: "Invalid conversation data."
            });
        }


        // Send request to Gemini
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY
                },

                body: JSON.stringify({
                    contents: contents
                })
            }
        );


        const data = await response.json();


        // Gemini returned an error
        if (!response.ok) {

            return res.status(response.status).json({
                error:
                    data?.error?.message ||
                    "Gemini API request failed."
            });
        }


        // Get AI response
        const answer =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("")
                .trim();


        if (!answer) {

            return res.status(500).json({
                error: "Gemini returned an empty response."
            });
        }


        // Send answer back to frontend
        return res.status(200).json({
            answer: answer
        });

    } catch (error) {

        console.error("Backend error:", error);

        return res.status(500).json({
            error: "Server error. Please try again."
        });
    }
}