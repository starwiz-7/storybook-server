const mongoose = require('mongoose');

const StorySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    summary:{
        type: String,
        required: false
    },
    story:{
        type: String,
        required:false
    },
    image:[
        {
            type:String,
        }
    ]
});


const Story = mongoose.model('Story', StorySchema);
module.exports = Story;