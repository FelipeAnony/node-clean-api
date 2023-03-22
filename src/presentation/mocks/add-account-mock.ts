import { AccountModel, AddAccountModel } from '@/domain/models';
import { AddAccount } from '@/domain/usecases';

class AddAccountStub implements AddAccount {
    async add({ email, name }: AddAccountModel): Promise<AccountModel> {
        return {
            email,
            name,
            id: 'any-id',
        };
    }
}

export const makeAddAccountStub = (): AddAccount => {
    return new AddAccountStub();
};
