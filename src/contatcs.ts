import * as path from "path";
const Datastore = require("nedb");


export interface IContact {
    _id?: number, name: string, email: string
};


export class Worker {
    private db: Nedb;
    constructor() {
        this.db = Datastore({
            filename: path.join(__dirname,"contacts.db"),
            autoload: true
        });
    }
    public listContacts(): Promise<IContact[]|Error> {
        return new Promise((rej,res)=>{
            this.db.find({},(err: Error, docs: IContact[])=>{
                if(err) {
                    rej(err);
                }else {
                    res(docs)
                }
            });
        });
    }
}