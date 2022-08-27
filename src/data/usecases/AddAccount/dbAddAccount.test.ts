import { makeAddAccountRepositoryStub, makeEncrypterStub } from '@/data/mocks';
import { DbAddAccount } from './dbAddAccount';

const addAccountRepositoryStub = makeAddAccountRepositoryStub();
const encrypterStub = makeEncrypterStub();
const accountData = {
  email: 'valid@email.com',
  name: 'valid-name',
  password: 'valid_password',
};

const makeSut = (): DbAddAccount => {
  return new DbAddAccount(encrypterStub, addAccountRepositoryStub);
};

describe('DbAddAccount usecase', () => {
  it('Should call encripter with correct password', async () => {
    const sut = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.add(accountData);

    expect(encryptSpy).toBeCalledWith(accountData.password);
  });

  it('Should throw if encrypter throws', async () => {
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const sut = makeSut();

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const sut = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(accountData);

    expect(addSpy).toBeCalledWith({
      ...accountData,
      password: 'encrypted_password',
    });
  });
});
