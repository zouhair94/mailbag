import * as path from "path";
import * as fs from "fs";

export interface IServerInfo {
    smtp: {
        host: string, port: string,
        auth: { user: string, pass: string}
    },
    imap: {
        host: string, port: string,
        auth: { user: string, pass: string}
    }
}
export let Serverinfo: IServerInfo;

const rawInfo: any= fs.readFileSync(path.join(__dirname,"../serverInfo.json"));
Serverinfo = JSON.parse(rawInfo);