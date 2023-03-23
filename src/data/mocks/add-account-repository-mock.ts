import { AccountModel, AddAccountModel } from '@/domain/models';

import { AddAccountRepository } from '../protocols';

class AddAccountRepositoryStub implements AddAccountRepository {
    add({ email, name }: AddAccountModel): Promise<AccountModel> {
        return Promise.resolve({ email, name, id: 'any-id' });
    }
}

export const makeAddAccountRepositoryStub = () => {
    return new AddAccountRepositoryStub();
};
