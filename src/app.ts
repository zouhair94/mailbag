import path from "path";
import express, {Express, NextFunction, Request, Response} from "express";
import {Serverinfo } from "./serverInfo";
import * as IMAP from "./IMAP";
import * as smtp from "./SMTP";
import * as contact from "./contatcs";
import {IContact} from "./contatcs";
import SMTPTransport from "nodemailer/lib/smtp-transport";


const app: Express = express();
app.use(express.json());

app.use("/",express.static(__dirname,"../../client/dist"));

app.get("/mailbox",async (req: Request, res: Response) =>{
    try {
        const imapworker: IMAP.Worker = new IMAP.Worker(Serverinfo);
        const mailboxes: IMAP.IMailbox[]= await imapworker.listMailboxes();
        res.json(mailboxes);
    } catch (error) {
        res.send(error)
    }
});

app.get("/mailboxes/:mailbox",async(req: Request, res: Response) => {
    try {
        const imapworker: IMAP.Worker = new IMAP.Worker(Serverinfo);
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
        const imapworker: IMAP.Worker = new IMAP.Worker(Serverinfo);
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
        const imapWorker: IMAP.Worker = new IMAP.Worker(Serverinfo);
        await imapWorker.deleteMessage({
            mailbox,id
        });
        res.send("ok");
    } catch (error) {
        res.send(error);
    }
});

app.post("/message",async (req: Request,res: Response) => {
    try {
        const stmpWorker: smtp.Worker = new smtp.Worker(Serverinfo);
        await stmpWorker.sendMessage(req.body);
        res.send("ok");
    } catch (error) {
        res.json(error);
    }
});
 
app.get("/contacts",async (req:Request,res:Response) => {
    try {
        const contactsWorker: contact.Worker = new contact.Worker();
        const contacts: IContact[] = await contactsWorker.listContacts();
        res.json(contacts) ;
    } catch (error) {
        res.send(error);
    }
});

app.post("/contacts",async (req: Request,res:Response) => {
    try {
        const contactsWorker: contact.Worker = new contact.Worker();
        const contact: IContact = await contactsWorker.addContact(req.body);
        res.json(contact) ;
    } catch (error) {
        res.send(error);
    }
});

app.delete("/contacts/:id",async (req: Request,res: Response) => {
    try {
        const contactsWorker: contact.Worker = new contact.Worker();
        await contactsWorker.deleteContact(req.params.id);
        res.json("ok") ;
    } catch (error) {
        res.send(error);
    }
});