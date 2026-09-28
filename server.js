const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3000;


/* =========================
   GEMINI AI
========================= */

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(express.static(__dirname));


/* =========================
   GEMINI RECOMMENDATION
========================= */

app.post("/api/recommendation", async (req, res) => {

    try {

        const {
            income,
            expense,
            budget,
            balance
        } = req.body;


        const prompt = `
You are PocketSmart AI, a smart personal budget assistant.

Analyze the user's financial information.

Income: ₹${income}
Expenses: ₹${expense}
Monthly Budget: ₹${budget}
Current Balance: ₹${balance}

Give the user:

1. A short analysis of their financial situation.
2. One practical spending suggestion.
3. One useful savings tip.

Keep the response simple and easy to understand.

Do not use complicated financial terms.

Keep the answer concise and suitable for a student.
`;


        console.log("🤖 Sending request to Gemini...");


        const response = await ai.models.generateContent({

            model: "gemini-3.7-flash",

            contents: prompt

        });


        console.log("✅ Gemini response received");


        res.json({

            recommendation: response.text

        });

    }


    catch (error) {

        console.error(
            "Gemini error:",
            error
        );


        if (error.status === 503) {

            return res.status(503).json({

                error:
                    "Gemini is temporarily busy. Please try again later."

            });

        }


        res.status(500).json({

            error:
                "Unable to generate AI recommendation."

        });

    }

});


/* =========================
   HOME PAGE
========================= */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `PocketSmart AI running at http://localhost:${PORT}`
    );

});