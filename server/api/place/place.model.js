'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: "User"},
   date: { type: Date, default: Date.now },
   location: String,
   text: String,
   latitude : String,
   longitude : String,
   instagramLink: String
});

module.exports = mongoose.model('Place', PlaceSchema);