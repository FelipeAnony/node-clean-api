import { AccountModel, AddAccountModel } from '../models';

export interface AddAccount {
    add(params: AddAccountModel): Promise<AccountModel>;
}
