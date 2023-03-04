export interface AddAccountModel {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface AccountModel {
    name: string;
    email: string;
    id: string;
}
