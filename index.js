import express from "express";
import cors from "cors";
import "./config/db.js";
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import proyectRoutes from "./routes/proyectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import connectionDB from "./config/db.js";

const app = express();
app.use(express.json())
dotenv.config();
connectionDB()

const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/proyects', proyectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
});

// Socket.io
import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Conectado a Socket.io");

  socket.on("open proyect", (proyect) => {
    socket.join(proyect);
  });

  socket.on("new task", (task) => {
    const proyect = task.proyect
    socket.to(proyect).emit('added task', task)
  });

  socket.on('delete task',task => {
    const proyect =  task.proyect
    socket.to(proyect).emit('task deleted', task)
  })

  socket.on('edit task', task => {
    const proyect = task.proyect._id
    socket.to(proyect).emit("updated task", task)
  })

  socket.on('change state', task => {
    const proyect = task.proyect._id
    socket.to(proyect).emit('changed state', task)
  })
});

