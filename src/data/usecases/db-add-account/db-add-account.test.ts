import { AddAccountModel, AccountModel } from '@/domain/models';
import { AddAccount } from '@/domain/usecases';

import { EncrypterAdapter } from '@/infra/protocols';
import { faker } from '@faker-js/faker';

const makeSut = () => {
    class EncrypterAdapterStub implements EncrypterAdapter {
        encrypt(value: string): string {
            return 'value-encrypted';
        }
    }

    class DbAddAccount implements AddAccount {
        constructor(private readonly encrypter: EncrypterAdapter) {}

        add(params: AddAccountModel): Promise<AccountModel> {
            const encryptedPassword = this.encrypter.encrypt(params.password);

            return Promise.resolve({ email: 'valid-email', id: 'valid-id', name: 'valid-name' });
        }
    }

    const encrypter = new EncrypterAdapterStub();
    const sut = new DbAddAccount(encrypter);

    return { sut, encrypter };
};

const password = faker.internet.password();

const defaultAddAccountParams: AddAccountModel = {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password,
    passwordConfirmation: password,
};

describe('DbAddAccount Usecase', () => {
    it('Should call encrypter adapter with correct password', () => {
        const { sut, encrypter } = makeSut();

        const encrypterSpy = jest.spyOn(encrypter, 'encrypt');
        sut.add(defaultAddAccountParams);

        expect(encrypterSpy).toBeCalledWith(password);
    });
});
