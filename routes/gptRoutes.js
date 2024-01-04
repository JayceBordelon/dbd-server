const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// http://localhost:3000/gpt/generate
router.post('/generate', async (req, res) => {
    console.log("Making a request to gpt");

    // Access 'prompt' from 'req.body'
    const userPrompt = req.body.prompt;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: userPrompt }],
            model: process.env.GPT_MODEL,
        });
        console.log(completion.choices[0].message.content);
        res.json(completion.choices[0].message.content);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request');
    }
});

module.exports = router;
