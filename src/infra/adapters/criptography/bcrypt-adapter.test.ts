import bcrypt from 'bcrypt';

import { EncrypterAdapter } from '@/data/protocols';

const makeSut = (salt = 12) => {
    class BcryptAdapter implements EncrypterAdapter {
        constructor(private salt = 12) {}

        async encrypt(value: string): Promise<string> {
            return await bcrypt.hash(value, this.salt);
        }
    }

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
});
