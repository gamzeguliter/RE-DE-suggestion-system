const mongoose = require('mongoose');
const User = require ('./user');

const Suggestion = require ('./suggestion');
const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
        ,
    suggestionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Suggestion',
            required: false
        },
  
    comment: {    
                type: String,
             
            }
        }

)

module.exports = mongoose.model('Comment', commentSchema);