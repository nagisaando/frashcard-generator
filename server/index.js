const express = require('express')
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express()
app.use(express.json())

app.post('translate-to-english', (req, res) => {

    const animal = req.body.animal || '';
    if (animal.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid animal",
            }
        });
        return;
    }

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(animal),
            temperature: 0.6,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
})



const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('server started')
})

