import { AccountModel, AddAccountModel } from '@/domain/models';
import { AddAccount } from '@/domain/usecases';

import { AddAccountRepository, EncrypterAdapter } from '@/data/protocols';

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly encrypter: EncrypterAdapter,
        private readonly addAccountRepository: AddAccountRepository
    ) {}

    async add({
        email,
        name,
        password,
        passwordConfirmation,
    }: AddAccountModel): Promise<AccountModel> {
        const encryptedPassword = await this.encrypter.encrypt(password);

        return await this.addAccountRepository.add({
            email,
            name,
            password: encryptedPassword,
            passwordConfirmation,
        });
    }
}
