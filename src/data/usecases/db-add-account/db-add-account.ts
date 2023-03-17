import { AccountModel, AddAccountModel } from '@/domain/models';
import { AddAccount } from '@/domain/usecases';

import { EncrypterAdapter } from '@/infra/protocols';

export class DbAddAccount implements AddAccount {
    constructor(private readonly encrypter: EncrypterAdapter) {}

    add(params: AddAccountModel): Promise<AccountModel> {
        const encryptedPassword = this.encrypter.encrypt(params.password);

        return Promise.resolve({ email: 'valid-email', id: 'valid-id', name: 'valid-name' });
    }
}
