const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SudokufarmUser = new Schema({username: String, games: [], friends: [], followers: []});
module.exports = mongoose.model('SudokufarmUser', SudokufarmUser);