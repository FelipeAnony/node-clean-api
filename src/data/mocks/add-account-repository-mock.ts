import { AccountModel, AddAccountModel } from '@/domain/models';

import { AddAccountRepository } from '../protocols';

class AddAccountRepositoryStub implements AddAccountRepository {
    add(data: AddAccountModel): Promise<AccountModel> {
        return Promise.resolve({} as any);
    }
}

export const makeAddAccountRepositoryStub = () => {
    return new AddAccountRepositoryStub();
};
