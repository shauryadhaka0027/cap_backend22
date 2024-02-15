const express = require("express");
const app = express();
const connection = require("./db");
require("dotenv").config();
const PORT = process.env.PORT
const cors=require("cors")
const{userRouter}= require("./Route/UserRoute");
const { productRouter } = require("./Route/productRoute");
const axios = require("axios");
// const {authMiddleware}=require("./Middleware/auth.middleware");
const cookieParser = require('cookie-parser');





app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true
  }));
 
  
app.use("/user", userRouter);
app.use("/product",productRouter)

app.get('/api/search', async (req, res) => {
    const { q, engine, api_key } = req.query;

    if (!q || !engine || !api_key) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                q,
                engine,
                api_key,
                
            
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(PORT, async () => {
    try {
        await connection;
        console.log("db is connected");
        console.log("server is connected");
    } catch (error) {
        console.error("Error connecting to database:", error);
        
    }
});
