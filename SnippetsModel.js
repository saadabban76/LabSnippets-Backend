const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    userId: String,
    snippet: String,
    timestamp: { type: Date, default: new Date().toLocaleDateString('en-US') },
})

const SnippetModel = mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);

module.exports = SnippetModel;