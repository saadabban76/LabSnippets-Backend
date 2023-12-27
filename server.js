// server.js
const express = require('express')();
const http = require('http');
const socketIO = require('socket.io');
const SnippetModel = require('./SnippetsModel');
const mongoose = require('mongoose');

const server = http.createServer(express);
const io = new socketIO.Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    },
    // secure: true,
});

const MONGODB_URL = "mongodb+srv://saad76:EKrYWkWPUSQHTLLn@cluster0.wgmqb0q.mongodb.net/";

if (MONGODB_URL === undefined) {
    // window.alert("Invalid Mongodb url !");
    console.log("invalid mogodburl : ", MONGODB_URL);
} else {
    mongoose.connect(MONGODB_URL, {
        dbName: "LabSnippets"
    });
    console.log("mongodb conencted with id : ", MONGODB_URL);
}


io.on('connection', (socket) => {
    console.log('A user connected : ', socket.id);
    console.log("working now ? ");

    // Listen for chat snippets
    socket.on('snippets', async (snippet, room) => {
        // Broadcast the snippets to all connected members
        if (room == "") {
            const newSnippet = new SnippetModel({
                snippet: snippet.snippet,
                userId: socket.userId
            });

            try {
                await newSnippet.save({
                    w: "majority",
                    wtimeout: 5000
                }); // Set the timeout to 5 seconds                
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

console.log("port : ", PORT);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});