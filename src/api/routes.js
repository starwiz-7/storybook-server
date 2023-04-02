const Router = require('express');
const {createStory, routeGPT, getStory} = require('./controller');

const storyRouter = Router();
storyRouter.route('/create').post(createStory);
storyRouter.route('/:id').get(getStory);
storyRouter.route('/newprompt').post(routeGPT);

module.exports = {storyRouter};