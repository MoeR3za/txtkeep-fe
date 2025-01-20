export interface IUser {
    pk: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
}

export interface IUserLogin {
    access: string;
    refresh: string;
    user: IUser;
}