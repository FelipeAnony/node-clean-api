import { AccountModel } from '@/domain/models/accountModel';
import { AddAccount, AddAccountModel } from '@/domain/usecases/addAccount';
import { Encrypter } from '../../protocols';

class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return { email: '', id: '', name: '', password: '' };
  }
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string) {
      return Promise.resolve('');
    }
  }

  return new EncrypterStub();
};

const encrypterStub = makeEncrypterStub();

const makeSut = (): DbAddAccount => {
  return new DbAddAccount(encrypterStub);
};

const accountData = {
  email: 'valid@email.com',
  name: 'valid-name',
  password: 'valid_password',
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
});
