import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const db = require("../models");
const User = db.User;
const Plan = db.Plan;
const Purchase = db.Purchase;

const jwtSecret: string = process.env.JWT_KEY!;

const app: Express = express();

app.use(bodyParser.json({ limit: "100mb" }));

const authenticateToken = (req: any, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token is missing' });

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        req.user = user;
        next();
    });
}

app.get("/", (req: Request, res: Response) => {
    res.send("This is working");
});

app.get("/plans", async (req: Request, res: Response) => {
    try {
        const plans = await Plan.findAll();
        res.json({ plans });
    } catch (error) {
        console.error("Get Plans error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400).send("Please enter both email and password");
        } else {
            const user = await User.findOne({ where: { email, password } });
            if (user) {
                const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
                res.status(200).json({ token });
            } else {
                res.status(401).send("Incorrect email or password");
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/purchase", authenticateToken, async (req: any, res: Response) => {
    const userToken = req.user;
    const userId = userToken.userId;
    const { planId } = req.body;

    try {
        if (!userId || !planId) {
            res.status(400).send("UserId or PlanId is missing");
        } else {
            const [user, plan] = await Promise.all([
                User.findOne({ where: { id: userId } }),
                Plan.findOne({ where: { id: planId } })
            ]);

            if (user && plan) {
                const purchase = await Purchase.create({ userId, planId });
                res.status(201).json(purchase);
            } else {
                res.status(400).send("User or Plan is missing");
            }
        }
    } catch (error) {
        console.error("Purchase error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/purchases", authenticateToken, async (req: any, res: Response) => {
    const userToken = req.user;
    const userId = userToken.userId;

    try {
        const purchases = await Purchase.findAll({ where: { userId }, include: [Plan] });
        res.json({ purchases });
    } catch (error) {
        console.error("Get Purchases error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
