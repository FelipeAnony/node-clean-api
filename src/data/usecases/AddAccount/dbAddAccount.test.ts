import { AccountModel } from '@/domain/models/accountModel';
import { AddAccount, AddAccountModel } from '@/domain/usecases/addAccount';
import { Encrypter } from '../../protocols';

class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    this.encrypter.encrypt(account.password);
    return Promise.resolve({ email: '', id: '', name: '', password: '' });
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
});
