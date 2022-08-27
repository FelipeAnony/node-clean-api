import { Encrypter } from '../protocols';

export const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string) {
      return Promise.resolve('encrypted_password');
    }
  }

  return new EncrypterStub();
};
