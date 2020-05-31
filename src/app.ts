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

app.get("/mailboxes/:mailbox",async(req: Request, res: Response) => {
    try {
        const imapworker: IMAP.worker = new IMAP.worker(Serverinfo);
        const messages: IMAP.IMessage[] = await imapworker.lisMessages({
            mailbox: req.params.mailbox
        });
        res.json(messages);
    } catch (error) {
        res.send(error);    
    }
});

app.get("/messages/:mailbox/:id",async (req: Request, res: Response)=>{
    try {
        const {mailbox, id} = req.params;
        const imapworker: IMAP.worker = new IMAP.worker(Serverinfo);
        const messageBody: string = await imapworker.getMessageBody({
            mailbox, id
        });
        res.send(messageBody);
    } catch (error) {
        res.send(error);
    }
});

app.delete("/messages/:mailbox/:id",async (req:Request, res: Response) => {
    try {
        const {mailbox, id} = req.params;
        const imapWorker: IMAP.worker = new IMAP.worker(Serverinfo);
        await imapWorker.deleteMessage({
            mailbox,id
        });
        res.send("ok");
    } catch (error) {
        res.send(error);
    }
});