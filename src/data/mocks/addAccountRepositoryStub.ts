import { AddAccountRepository } from '../protocols';
import {
  AccountModel,
  AddAccountModel,
} from '../usecases/AddAccount/dbAddAccountProtocols';

export const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({ ...account, id: '' });
    }
  }

  return new AddAccountRepositoryStub();
};
