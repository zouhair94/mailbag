const ImapClient = require("emailjs-imap-client");
import {ParsedMail,simpleParser} from "mailparser";
import {IServerInfo} from "./serverInfo";
import { worker } from "cluster";



export interface ICallOptios {
    mailbox: string,
    id?: number
};

export interface IMessage{
    id: string, date: string,
    from:string,
    subject: string, body?: string
};

export interface IMailbox {name:string, path: string};



export class Worker{
    private static serverInfo: IServerInfo;
    constructor(inServerInfo: IServerInfo){
        Worker.serverInfo = inServerInfo;
    }

    private async connectToServer(): Promise<any> {
        const client: any = new ImapClient.default(
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            {auth: Worker.serverInfo.imap.auth}
        );
        client.logLevel = client.LOG_LEVEL_NONE;
        client.onerror = (err: Error) => {
            console.log("mailboxes list error",err);
        };
        await client.connect();
        return client();
    }

    public async listMailboxes(): Promise<IMailbox[]> {
        const client: any = await this.connectToServer();
        const mailboxes: any = await client.listMailboxes();
        await client.close();
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (arr: any[]): void => {
            arr.forEach((val: any)=> {
                const { name , path } = val ;
                finalMailboxes.push({
                    name , path
                });
                iterateChildren(val.children);
            });
        };
        iterateChildren(mailboxes.children);
        return finalMailboxes;
    }
}