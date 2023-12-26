import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
    userId: String,
    snippet: String,
    timestamp: { type: Date, default: new Date().toLocaleDateString('en-US') },
})

const SnippetModel = mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);

export default SnippetModel;