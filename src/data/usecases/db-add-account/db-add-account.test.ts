import { faker } from '@faker-js/faker';

import { AddAccountModel } from '@/domain/models';

import { DbAddAccount } from './db-add-account';

import { EncrypterAdapter } from '@/infra/protocols';

const makeSut = () => {
    class EncrypterAdapterStub implements EncrypterAdapter {
        encrypt(value: string): Promise<string> {
            return Promise.resolve('value-encrypted');
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
    it('Should call encrypter adapter with correct password', async () => {
        const { sut, encrypter } = makeSut();

        const encrypterSpy = jest.spyOn(encrypter, 'encrypt');
        await sut.add(defaultAddAccountParams);

        expect(encrypterSpy).toBeCalledWith(password);
    });

    it('Should throws if encrypter throws', async () => {
        const { sut, encrypter } = makeSut();

        jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(() => Promise.reject(new Error()));
        const response = sut.add(defaultAddAccountParams);

        await expect(response).rejects.toThrow();
    });
});
