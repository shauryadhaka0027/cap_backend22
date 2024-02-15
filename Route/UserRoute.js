const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { UserModel } = require("../Model/UserModel");
const access_token_key = process.env.access_token_key;
const refresh_token_key = process.env.refresh_token_key;

userRouter.post("/register", async (req, res) => {
    const { email,  password } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(400).send({ "msg": err });
            } else {
                const data = new UserModel({ email, password:hash});
                await data.save();
                res.status(200).send("User is created");
            }
        });
    } catch (error) {
        res.status(400).send({ "msg": error });
    }
});
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const data = await UserModel.findOne({ email });
        if (data) {
            bcrypt.compare(password, data.password, (err, result) => {
                if (err) {
                    res.status(400).send({ "msg": err });
                } else {
                    if (result) {
                        const access_token = jwt.sign({ email: data.email }, access_token_key, { expiresIn: "1h" });
                        const refresh_token = jwt.sign({ email: data.email }, refresh_token_key, { expiresIn: "7h" });

                        res.cookie("access_token", access_token, {
                            maxAge: 1000 * 60 * 60, 
                            httpOnly: false, 
                            sameSite: 'none',
                            secure: false
                          });
                          res.cookie("refresh_token", refresh_token, {
                            maxAge: 1000 * 60 * 60 * 2, 
                            httpOnly: false,
                            sameSite: 'none',
                            secure: false
                          });


                       return res.status(200).send({ "msg": "Login successful" });
                    } else {
                       return res.status(401).send({ "msg": "Incorrect email or password" });
                    }
                }
            });
        } else {
          return  res.status(404).send({ "msg": "User not found" });
        }
    } catch (error) {
       return res.status(500).send({ "msg": error });
    }
});

module.exports = { userRouter };