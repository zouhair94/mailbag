import path from "path";
import express, {Express, NextFunction, Request, Response} from "express";
import {Serverinfo } from "./serverInfo";
import * as IMAP from "./IMAP";
import * as smtp from "./SMTP";
import * as contact from "./contatcs";
import {IContact} from "./contatcs";


const app: Express = express();
app.use(express.json());

app.use("/",express.static(__dirname,"../../client/dist"));

app.get("/mailbox",async (req: Request, res: Response) =>{
    try {
        const imapworker: IMAP.worker = new IMAP.worker(Serverinfo);
        const mailboxes: IMAP.IMailbox[]= await imapworker.listMailboxes();
        res.json(mailboxes);
    } catch (error) {
        res.send(error)
    }
});

