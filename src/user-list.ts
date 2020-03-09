import * as fs from 'fs';

export interface UserData {
    username: string,
    notification: boolean;
}

class UserList {

    private fileName: string = "usernames.json";
    private users: { [id: string] : UserData; } = {}

    constructor() {
        if (fs.existsSync(this.fileName))
            this.readFile();
    }


    public getUserByChatId(chatId: string) : string {
        return this.users[chatId].username;
    }

    public addUser(chatId: string, username: string) {
        if (chatId) {
            this.users[chatId] = {
                username: username.toLowerCase(),
                notification: false
            };
            this.updateFile();
        }
    }

    public editNotification(chatId: string, status: boolean) : boolean {
        if (this.users[chatId]) {
            if (this.users[chatId].notification !== status) {
                this.users[chatId].notification = status;
                this.updateFile();
            }
            return true;
        } else {
            return false;
        }
    }

    private updateFile(): void {
        fs.writeFileSync(this.fileName, JSON.stringify(this.users));
    }

    private readFile(): void {
        this.users = JSON.parse(fs.readFileSync(this.fileName).toString());
    }

}

const userList = new UserList();
export default userList;