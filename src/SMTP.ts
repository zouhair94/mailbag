import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import {SendMailOptions,SentMessageInfo} from "nodemailer";
import { IServerInfo } from "./serverInfo";

export class Worker {
    private static serverInfo: IServerInfo;
    constructor(inServerInfo:IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    sendMessage(inOptions: SendMailOptions): Promise<string> {
        //res == resolve , reject == rej
        return new Promise((res,rej) => {
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(inOptions,(err: Error|null, info: SentMessageInfo) => {
                if (err) rej(err);
                else {
                    res()
                }
            })
        });
    }
}
