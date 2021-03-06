import * as fs from 'fs';
import bot from '.';

export interface UserData {
    username: string,
    notificationMarks: boolean;
    notificationRemember: boolean;
}

class UserList {

    private fileName: string = "usernames.json";
    private users: { [id: string]: UserData; } = {}
    private fileNeedsUpdate = false;


    constructor() {
        if (fs.existsSync(this.fileName))
            this.readFile();


        setInterval(() => {
            if (this.fileNeedsUpdate) {
                let json: string = JSON.stringify(this.users)
                fs.writeFileSync(this.fileName, json)
                bot.sendFile("1051666657", this.fileName)
                console.log("File updated");

                this.fileNeedsUpdate = false;
            }

        }, 10000)

    }


    private fileToUpdate(): void {
        this.fileNeedsUpdate = true;
    }

    private readFile(): void {
        this.users = JSON.parse(fs.readFileSync(this.fileName).toString());
    }


    public getUserByChatId(chatId: string | undefined): string | undefined {
        if (chatId && this.users[chatId])
            return this.users[chatId].username;
        else
            return undefined;
    }

    public addUser(chatId: string, username: string): void {
        if (chatId) {
            this.users[chatId] = {
                username: username.toLowerCase(),
                notificationMarks: false,
                notificationRemember: false,
            };
            this.fileToUpdate();
        }
    }

    public editNotificationVoti(chatId: string | undefined, status: boolean): void {
        
        if (!chatId) {
            return
        }

        if (!this.users[chatId])
            this.addUser(chatId, "")


        if (this.users[chatId].notificationMarks !== status) {
            this.users[chatId].notificationMarks = status;
            this.fileToUpdate();
        }
    }

    public editNotificationRemember(chatId: string | undefined, status: boolean): void {
        if (!chatId) {
            return
        }

        if (!this.users[chatId])
            this.addUser(chatId, "")

        if (this.users[chatId].notificationRemember !== status) {
            this.users[chatId].notificationRemember = status;
            this.fileToUpdate();
        }
    }

    public getNotificationVoti(chatId: string | undefined): boolean {
        if (!chatId) {
            return false;
        }

        if (this.users[chatId])
            return this.users[chatId].notificationMarks;
        return false;
    }

    public getNotificationRemember(chatId: string | undefined): boolean {
        if (chatId && this.users[chatId])
            return this.users[chatId].notificationRemember;
        return false;
    }

    public getUserWithNotificationVoti(): { username: string, chatId: string }[] {
        const res: { username: string, chatId: string }[] = [];
        for (let u in this.users) {
            if (this.users[u].notificationMarks)
                res.push({ username: this.users[u].username, chatId: u });
        }

        return res;
    }

    public getUserToRemember(): { username: string, chatId: string }[] {
        const res: { username: string, chatId: string }[] = [];
        for (let u in this.users) {
            if (this.users[u].notificationRemember)
                res.push({ username: this.users[u].username, chatId: u });
        }

        return res;
    }

    public removeUsername(chatId: string | undefined): void {
        if (!chatId) {
            return;
        }

        if (this.users[chatId]) {
            delete this.users[chatId]
            this.fileToUpdate();
        }

    }
}


const userList = new UserList();
export default userList;