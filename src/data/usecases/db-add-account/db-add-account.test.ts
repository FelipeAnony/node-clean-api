import { faker } from '@faker-js/faker';

import { AddAccountModel } from '@/domain/models';

import { DbAddAccount } from './db-add-account';

import { makeEncrypterAdapterStub, makeAddAccountRepositoryStub } from '@/data/mocks';

const makeSut = () => {
    const encrypter = makeEncrypterAdapterStub();
    const addAccountRepositoryStub = makeAddAccountRepositoryStub();

    const sut = new DbAddAccount(encrypter, addAccountRepositoryStub);

    return { sut, encrypter, addAccountRepositoryStub };
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

    it('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();

        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        await sut.add(defaultAddAccountParams);

        expect(addSpy).toBeCalledWith({ ...defaultAddAccountParams, password: 'value-encrypted' });
    });

    it('Should throws if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();

        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() =>
            Promise.reject(new Error())
        );
        const response = sut.add(defaultAddAccountParams);

        await expect(response).rejects.toThrow();
    });
});
