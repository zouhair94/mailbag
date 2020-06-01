const ImapClient = require("emailjs-imap-client");
import {ParsedMail,simpleParser} from "mailparser";
import {IServerInfo} from "./serverInfo";


export interface ICallOptions {
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
    public async listMessages(callOptions: ICallOptions):
     Promise<IMessage[]> {
         const client: any = await this.connectToServer();
         const mailbox = await client.selectMailbox(callOptions.mailbox);
         if( mailbox.exists === 0) {
             await client.close();
             return [];
         }
         const messages: any[] = await client.listMessages(callOptions.mailbox,
            "1:*",["uid","envelope"]);
            await client.close();
            const finalMessages: IMessage[] = [];
            messages.forEach((val: any)=>{
                finalMessages.push({
                    id: val.udi , date: val.envolope.date,
                    from: val.envolope.from[0].adress,
                    subject: val.envelope.subject
                });
            });
        return finalMessages;
    }

    public async getMessageBody(callOptions: ICallOptions): Promise<any> {
        const client: any = await this.connectToServer();
        const messages: any[] = await client.listMessages(
            callOptions.mailbox, callOptions.id,
            ["body[]"], {byUid: true}
        );
        let parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);
        await client.close();  
        return parsed.text;
    }

    public async deleteMessage(callOptions: ICallOptions): Promise<any> {
        const client: any = await this.connectToServer();
        await client.deleteMessage(
            callOptions.mailbox, callOptions.id, {byUid: true}
        );
        await client.close();
    };


}