import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   AI ROUTE
========================= */

app.post("/api/ai", async (req, res) => {

  const message = req.body.message;

  try {

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "gemma:2b",

          prompt: `
You are Study AI.

Rules:
- Never say you are Google, Gemini, ChatGPT, or any company AI.
- Your name is Study AI.
- You are a smart student tutor.
- Give short clear answers unless asked long.
- Explain maths and physics step-by-step.
- Be modern and friendly.
- Use simple language.
- If asked "who are you" reply:
"I am Study AI, your personal study assistant."

Question:
${message}
          `,

          stream: false

        })

      }
    );

    const data =
      await response.json();

    let finalReply =
      data.response || "No response.";

    /* CLEAN WEIRD SPACES */

    finalReply =
      finalReply.replace(/\n{3,}/g, "\n\n");

    /* SEND */

    res.json({
      reply: finalReply
    });

  }

  catch (error) {

    console.log(error);

    res.json({

      reply:
        "⚠️ Ollama backend not running."

    });

  }

});

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {

  console.log(
    "🚀 Study AI running on http://localhost:3000"
  );

});
console.log("NEW BACKEND ACTIVE");