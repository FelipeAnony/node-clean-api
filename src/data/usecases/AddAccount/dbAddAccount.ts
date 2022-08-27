import { Encrypter } from '@/data/protocols';
import { AccountModel } from '@/domain/models/accountModel';
import { AddAccount, AddAccountModel } from '@/domain/usecases/addAccount';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return { email: '', id: '', name: '', password: '' };
  }
}
