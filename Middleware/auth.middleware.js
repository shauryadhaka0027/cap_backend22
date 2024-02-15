const jwt = require("jsonwebtoken");
require("dotenv").config();

const access_token_key = process.env.access_token_key;
const refresh_token_key = process.env.refresh_token_key;

const authMiddleware = (req, res, next) => {

    const access_token = req.headers.authorization || req.cookies["access_token"]
    if (!access_token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    try {

        jwt.verify(access_token, access_token_key, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    
                    const refresh_token = req.cookies["refresh_token"];

                    jwt.verify(refresh_token, refresh_token_key, (err, decoded) => {
                        if (err) {
                            
                            return res.status(401).json({ message: "Refresh token is invalid or expired" });
                        } else {
                        
                            const new_access_token = jwt.sign({ email: decoded.email }, access_token_key, { expiresIn: "1h" });

                    
                            res.cookie("access_token", new_access_token, { httpOnly: true });

            
                            req.user = decoded;

                            next();
                        }
                    });
                } else {
                    
                    return res.status(401).json({ message: "Access token is invalid" });
                }
            } else {
                
                req.user = decoded;
                next(); 
            }
        });
    } catch (error) {
    
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {authMiddleware};
