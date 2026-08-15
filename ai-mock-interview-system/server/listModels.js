const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const result = await genAI.listModels();

    console.log("Available Models:\n");

    result.models.forEach((model) => {
      console.log(model.name);
      console.log("Supported Methods:", model.supportedGenerationMethods);
      console.log("---------------------------");
    });

  } catch (error) {
    console.log("ERROR OCCURRED:");
    console.log(error);
  }
}

run();