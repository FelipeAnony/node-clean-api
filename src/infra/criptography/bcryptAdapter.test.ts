import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

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
});
