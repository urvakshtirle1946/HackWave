const config = {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    newsApiKey: process.env.NEWS_API_KEY || "" ,
    rapidApiKey: process.env.RAPIDAPI_KEY || "",
    port: process.env.PORT || 3000,
};

export default config;