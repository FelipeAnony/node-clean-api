import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('any_hash');
  },
}));

const makeSut = () => {
  const salt = 12;
  return { sut: new BcryptAdapter(salt), salt };
};

describe('Bcrypt adapter', () => {
  it('Should call Bcrypt with correct params', () => {
    const { sut, salt } = makeSut();
    const mockedBcrypt = jest.spyOn(bcrypt, 'hash');

    sut.encrypt('any-value');

    expect(mockedBcrypt).toBeCalledWith('any-value', salt);
  });

  it('Should return a hash on success', async () => {
    const { sut } = makeSut();

    const hash = await sut.encrypt('any-value');

    expect(hash).toBe('any_hash');
  });

  it('Should throw if bcrypter throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const { sut } = makeSut();

    const promise = sut.encrypt('any-value');

    expect(promise).rejects.toThrow();
  });
});
