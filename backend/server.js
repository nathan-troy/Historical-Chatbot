const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { predefinedResponses } = require('./responses');

const app = express();
app.use(cors());
app.use(express.json());

function matchesKeyword(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

app.get('/', (req, res) => {
  res.json({ status: 'online' });
});

app.post('/api/chat', async (req, res) => {
  const {
    message = '',
    userName = 'Citizen',
    courtTitle = '',
    imperialFavour = 50,
    nortonDollars = 0
  } = req.body;

  const fullTitle = courtTitle ? `${courtTitle} ${userName}` : userName;
  let updatedFavour = imperialFavour;
  let updatedDollars = nortonDollars;

  if (updatedFavour <= 0) {
    return res.json({
      reply: `Silence! You are BANISHED from the Empire, ${fullTitle}. Pay $30 Norton Dollars for a Royal Pardon or reset your audience.`,
      imperialFavour: 0,
      nortonDollars: updatedDollars,
      banished: true
    });
  }

  const match = predefinedResponses.find((entry) =>
    entry.keywords.some((word) => matchesKeyword(message, word))
  );

  if (match) {
    updatedFavour = Math.max(0, Math.min(100, updatedFavour + (match.favourChange || 0)));
    updatedDollars = Math.max(0, updatedDollars + (match.dollarChange || 0));

    if (updatedFavour === 0) {
  const banishedReply = `${match.reply} ENOUGH! Your Imperial Favour has fallen to zero. You are hereby BANISHED from San Francisco!`.replaceAll('{name}', fullTitle);
  return res.json({
    reply: banishedReply,
    imperialFavour: 0,
    nortonDollars: updatedDollars,
    banished: true
    });
    }

    let chosenReply = match.reply;
    if (updatedFavour >= 75 && match.highFavourReply) {
      chosenReply = match.highFavourReply;
    } else if (updatedFavour <= 30 && match.lowFavourReply) {
      chosenReply = match.lowFavourReply;
    }

    chosenReply = chosenReply.replaceAll('{name}', fullTitle);

    return res.json({
      reply: chosenReply,
      imperialFavour: updatedFavour,
      nortonDollars: updatedDollars,
      banished: false
    });
  }

  const fallbackReply =
    updatedFavour >= 75
      ? `An intriguing thought, dear ${fullTitle}, though the Royal Archives hold no decree on "${message}". Ask me of the Bay Bridge, Congress, or my noble hounds!`
      : updatedFavour <= 30
      ? `The Emperor grows weary of riddles like "${message}", ${fullTitle}. Speak plainly or risk banishment.`
      : `The Emperor is... UNSURE of what to say in response to "${message}", ${fullTitle}. Try asking about the Bay Bridge, Congress, or Queen Victoria!`;

  res.json({
    reply: fallbackReply,
    imperialFavour: updatedFavour,
    nortonDollars: updatedDollars,
    banished: false
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
