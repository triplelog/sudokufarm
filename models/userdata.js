const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SudokufarmUser = new Schema({username: String, friends: [], followers: []});
module.exports = mongoose.model('SudokufarmUser', SudokufarmUser);