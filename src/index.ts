import express, { Express, Request, Response, NextFunction } from "express";
import 'dotenv/config'
import bodyParser from "body-parser";
const jwt = require('jsonwebtoken');

const db = require("../models");
const User = db.User;
const Plan = db.Plan;

const jwtSecret = process.env.JWT_KEY

const app: Express = express();
app.use(bodyParser.json({limit: "100mb"}))

const port = process.env.PORT;

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token is missing' });

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        (req as any).user = user;
        next();
    });
}

app.get("/", (req: Request, res: Response) => {
  res.send("this is working");
});

app.get("/plans", async (req: Request, res: Response) => {
  const plans = await Plan.findAll();
  res.json({plans});
});

app.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password){
      res.status(400)
      res.send("Please enter both email and password");
   }else{
      const user = await User.findOne({where: { email: email, password: password}})
      if (user){
          const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
          res.status(200)
          res.json({ token });
      }else{
        res.status(401)
        res.send("Incorrect email or password");
      }
   }
});

app.post("/purchase",authenticateToken, async (req: any, res: Response) => {
  const userToken = req.user;
  const userId = userToken.userId;
  const planId = req.body.planId
  const user = await User.findOne({where: { id: userToken.userId}})
  if(!userId || !planId){
      res.status(400)
      res.send("User or Plan is missing");
   }
   else{
    res.json(user)
   }
  
});



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});