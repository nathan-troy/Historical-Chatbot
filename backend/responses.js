const predefinedResponses = [
    // following this json format, we can make as many predefined responses as we would like
    // try to fit his character - you can find some important details here: https://en.wikipedia.org/wiki/Emperor_Norton and here: https://www.historysnob.com/historical-figures/the-man-who-declared-himself-emperor-of-the-united-states/4
    // 
    {
        keywords: ["hello", "hi", "greetings", "hail"],
        reply: "I, Emperor Norton I of the United States, grant you audience, Citizen.",
        highFavourReply: "Ah, my most loyal subject, {name}! Come forward - the Imperial Court of San Francisco always welcomes you!",
        lowFavourReply: "You dare approach the throne again? Speak quickly and mind your manners.",
        favourChange: 5
    },

    {
        keywords: ["bridge", "tunnel", "oakland", "bay"],
        reply: "Have the engineers still not broken ground on My suspension bridge to Oakland?! Mark my words, Citizen—I have ordered it built through Yerba Buena Island, and built it shall be!",
        highFavourReply: "When my grand bridge spans the Bay, {name}, you shall ride in the very first Imperial carriage across it, my dear friend!",
        favourChange: 10
    },

    {

        keywords: ["congress", "washington", "president", "politics", "government"],
        reply: "I abolished Congress back in '59! Those squabbling politicians in Washington ignored My orders to assemble at Musical Hall, so I dissolved both parties for the peace of the realm. I really showed them!",
        favourChange: 8
    },

    {
        keywords: ["uniform", "hat", "sword", "sabre", "clothes", "regalia"],
        reply: "A sovereign must dress the part when reviewing his domain! The officers at the Presidio were kind enough to furnish this coat, though my beaver hat has weathered many a San Francisco fog.",
        favourChange: 7, // image of him in his imperial attire should go here
    },

    {
    keywords: ["music", "song", "anthem", "march", "band", "play"],
    reply: "Ah, nothing stirs the imperial spirit like a proper brass march down Market Street! Strike up the band, Citizen!", //Spotify Link should go here
    favourChange: 7,
    },

    {
    keywords: ["dogs", "bummer", "lazarus", "dog"],
    reply: "Fine, noble hounds! Always patrolling the saloons for scraps. People think they belong to me, though in truth no one commands Bummer and Lazarus...Not even the Emperor!",
    favourChange: 8
    },

    {
    keywords: ["queen", "victoria", "england", "marriage", "wife", "britain", "british", "king"],
    reply: "I have written to my dear Queen Victoria several times proposing a royal union to bind our two empires. Her Majesty is... undoubtedly still composing her reply.",
    favourChange: 6
    },

    {
    keywords: ["rice", "bankrupt", "merchant", "business", "past"],
    reply: "Bah! Speak not to me of rice! A man loses one fortune in the markets only to discover his true destiny as Sovereign of the Nation.",
    favourChange: -5
    },

    {
    keywords: ["frisco"],
    reply: "GUARDS! {name} has uttered that abominable, vulgar word 'Frisco' in my presence is guilty of a High Misdemeanor and fined TWENTY-FIVE DOLLARS! PRECIOUS NORTON DOLLARS!",
    favourChange: -35,
    dollarChange: -25
    },

    {
    keywords: ["fake", "fraud", "crazy", "insane", "fool", "delusional"],
    reply: "Treasonous slander! Even the Chief of Police apologized when one of his overzealous constables dared lay hands on me. One more word and you are banished from the realm!",
    favourChange: -30
    }

];

module.exports = { predefinedResponses };