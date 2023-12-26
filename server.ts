// server.js
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import SnippetModel from './SnippetsModel';
import mongoose from 'mongoose';

const app = express();

const server = http.createServer(app);
const io = new socketIO.Server(server, {
    cors: {
        origin: "*",
    }
});

const MONGODB_URL = "mongodb+srv://saad76:EKrYWkWPUSQHTLLn@cluster0.wgmqb0q.mongodb.net/";

if (MONGODB_URL === undefined) {
    // window.alert("Invalid Mongodb url !");
    console.log("invalid mogodburl : ", MONGODB_URL);
} else {
    mongoose.connect(MONGODB_URL, { dbName: "LabSnippets" });
}


io.on('connection', (socket: any) => {
    console.log('A user connected : ', socket.id);

    // Listen for chat snippets
    socket.on('snippets', async (snippet: any, room: any) => {
        // Broadcast the snippets to all connected members
        if (room == "") {
            const newSnippet = new SnippetModel({
                snippet: snippet.snippet,
                user: snippet.userId
            });

            try {
                await newSnippet.save();
                console.log("snippet succesfully saved in db !");
            } catch (err) {
                console.log('Error saving Snippets to Database !', err);
            }


            io.emit('snippets', snippet);
        } else {
            // Broadcast the snippets to only room members
            socket.to(room).emit('snippets', snippet);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});