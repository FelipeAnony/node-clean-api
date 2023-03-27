import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
    async hash() {
        return Promise.resolve('hashed-value');
    },
}));

const makeSut = (salt = 12) => {
    const sut = new BcryptAdapter(salt);

    return {
        sut,
    };
};

describe('Bcrypt Adapter', () => {
    it('Should calls bcrypt with correct values', async () => {
        const salt = 12;
        const { sut } = makeSut(salt);
        const bcryptSpy = jest.spyOn(bcrypt, 'hash');
        const valueToTest = 'any-value';

        await sut.encrypt(valueToTest);

        expect(bcryptSpy).toBeCalledWith(valueToTest, salt);
    });

    it('Should return a hash on success case', async () => {
        const { sut } = makeSut();
        const result = await sut.encrypt('any-value');

        expect(result).toBe('hashed-value');
    });

    it('Should throws if bcrypt throws', async () => {
        const { sut } = makeSut();
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.reject(new Error()));

        const result = sut.encrypt('any-value');

        await expect(result).rejects.toThrow();
    });
});
