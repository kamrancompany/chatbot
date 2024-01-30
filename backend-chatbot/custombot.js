const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const app = express();
const port = 8000;

const MODEL_NAME = 'gemini-pro';
const API_KEY = 'AIzaSyCHXDHXLZQwfSuXLwF6CQmiyKwoZX15Nog';

const realstateAgentObject = {
  greetings: [
    'Welcome to our real estate agency!',
    'Hello there! How can I help you find your dream home?',
  ],
};

const dataObject = {
  hi: ['Welcome To our real Estate Agency'],
  kamran: ['kamran is MERN stack Developer in 1011 Tech'],
  'who is kamran': ['kamran is MERN stack Developer in 1011 Tech'],
  orange: ['basic color'],
  yep: ['Please Asked?'],
  yes: ['Please Asked?'],
  'yep!': ['Please Asked?'],
  'yes!': ['Please Asked?'],
};

const searchWebsites = async (query) => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();

  const searchUrl = `https://thapatechnical.shop/blogs/host-a-mern-stack-app-on-a-vps=${encodeURIComponent(query)}`;

  await page.goto(searchUrl);

  const answer = await page.evaluate(() => {
    const resultElement = document.querySelector('.blogPost h1');
    // return resultElement.innerHTML
    return resultElement.innerHTML ? resultElement.textContent.trim() : 'No result found';
  });
  
  console.log( answer );
  await browser.close();

  return answer;
};

app.use(cors());

app.get('/api/messages/:userInput?', async (req, res) => {
  const userInput = req.params.userInput.toLowerCase();
  const userInputArray = typeof userInput === 'string' ? [userInput] : userInput;

  if (userInput) {
    const answer = await searchWebsites(userInput);
    res.json({ answer });
  } else {
    try {
      async function runChat() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        };

        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({
          generationConfig,
          safetySettings,
          history: [
            { role: 'user', parts: [{ text: 'hi' }] },
            { role: 'model', parts: [{ text: 'Hello! How are you doing today?' }] },
            { role: 'user', parts: [{ text: 'who is the president of india currently' }] },
            {
              role: 'model',
              parts: [{
                text: 'The current President of India is **Droupadi Murmu**. She was elected as the 15th President of India on 21 July 2022 and took office on 25 July 2022. She is the second woman to hold this position, after Pratibha Patil.\n\nMurmu is a member of the Bharatiya Janata Party (BJP) and has held various positions in the party and government, including serving as the Governor of Jharkhand from 2015 to 2021. She is the first tribal woman to be elected as President of India.\n\nAs President, Murmu is the ceremonial head of state and the commander-in-chief of the Indian Armed Forces. She also has the power to grant pardons and reprieves, and to commute sentences.',
              }],
            },
          ],
        });

        if (!Array.isArray(userInputArray)) {
          console.error('Request data is not an array');
          return;
        }

        const result = await chat.sendMessage(userInputArray);
        const response = result.response.text();
        console.log(response);
        return { Bot: response };
      }

      const chatResult = await runChat(userInput);
      res.json(chatResult);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  }
});

app.listen(port, () => {
  console.log(`Chatbot app listening at http://localhost:${port}`);
});
