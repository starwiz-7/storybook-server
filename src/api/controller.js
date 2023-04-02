const Story = require('../models/Story');
const { Configuration, OpenAIApi } = require("openai");
const config = require('../config');

const configuration = new Configuration({
    apiKey: config.openAPIKey,
});
const openai = new OpenAIApi(configuration);

const createStory = async (req, res) => {
    try {
        const { title, description, genre } = req.body;
        const story = new Story({
            title, description, genre
        });

        await story.save();

        return res.status(200).send(story);
    }
    catch (error) {
        throw error;
    }
}

const routeGPT = async (req, res) => {
    try {
        const { id, sceneNo } = req.body;

        const story = await Story.findById(id);

        const result = await promptGPT(id, story.title, story.description, story.genre, sceneNo);

        return res.status(200).send(result);
    }
    catch (error) {
        throw error;
    }
}


const promptGPT = async (id, title, description, genre, sceneNo, directionNo = 1) => {
    try {
        let prompt;

        let response = {};
        const currStory = await Story.findById(id);
        if (sceneNo === 1) {
            prompt = `Create a story in 5 scenes with the title '${title}' and the description of the story is '${description}'. Let the ID for this story be 3 for further reference. Build a background around these description in this story and write a descriptive scene in 500-600 words for a comic book. Write story only for scene ${sceneNo} and the summary in the last paragraph`;
        }
        else {
            prompt = currStory.summary + ` In reference to story with the id ${id}, write the story for scene ${sceneNo} in direction ${directionNo}, write a descriptive scene in 500-600 words for a comic book. Write story only for scene ${sceneNo} and the summary in the last paragraph`;
        }

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const resp = completion.data.choices[0].message.content.split('Summary:');
        response.description = resp[0];

        const directionCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: resp[1] + " " + "Give 2 directions in which story can proceed" }]
        })

        response.directions = directionCompletion.data.choices[0].message.content;

        const imgUrl = await promptStableDiffusion(id, sceneNo, resp[1], genre);

        await Story.findByIdAndUpdate(id, {
            summary: currStory.summary + " " + resp[1], story: currStory.story + "\n" + resp[0], $push: {
                image: imgUrl
            }
        });

        return response;
    }
    catch (error) {
        throw error;
    }
}

const promptStableDiffusion = async (id, scene, description, genre) => {
    try {
        const prompt = `Create an image as ${genre} retrowork. The scene is as ${description}. It is a page in the ${genre} book`;

        const response = await openai.createImage({
            prompt,
            n: 1,
            size: "1024x1024",
        });

        return response.data.data[0].url;
    }
    catch (error) {
        throw error;
    }
}

const getStory = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(422).send("Id not found");
        }
        const result = await Story.findById(id);

        return res.status(200).send(result);
    }
    catch (error) {
        throw error;
    }
};

module.exports = { createStory, routeGPT, getStory };