import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('any_hash');
  },
}));

const makeSut = (salt: number) => {
  return { sut: new BcryptAdapter(salt) };
};

describe('Bcrypt adapter', () => {
  it('Should call Bcrypt with correct params', () => {
    const salt = 12;
    const { sut } = makeSut(salt);
    const mockedBcrypt = jest.spyOn(bcrypt, 'hash');

    sut.encrypt('any-value');

    expect(mockedBcrypt).toBeCalledWith('any-value', salt);
  });

  it('Should return a hash on success', async () => {
    const salt = 12;
    const { sut } = makeSut(salt);

    const hash = await sut.encrypt('any-value');

    expect(hash).toBe('any_hash');
  });
});
