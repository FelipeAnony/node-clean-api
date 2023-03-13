import validator from 'validator';

import { EmailValidator } from '@/infra/protocols';
import { faker } from '@faker-js/faker';

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true;
    },
}));

const makeSut = () => {
    class EmailValidatorAdapter implements EmailValidator {
        isValid(email: string): boolean {
            return validator.isEmail(email);
        }
    }

    const sut = new EmailValidatorAdapter();

    return { sut };
};

describe('EmailValidator Adapter', () => {
    it('Should return false if validator returns false', () => {
        const { sut } = makeSut();

        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

        const emailIsValid = sut.isValid('invalid-email');
        expect(emailIsValid).toBe(false);
    });

    it('Should return true if validator returns true', () => {
        const { sut } = makeSut();

        const emailIsValid = sut.isValid('valid-email');
        expect(emailIsValid).toBe(true);
    });

    it('Should calls validator with correct email value', () => {
        const { sut } = makeSut();
        const email = faker.internet.email();

        const isValidSpy = jest.spyOn(validator, 'isEmail');

        sut.isValid(email);
        expect(isValidSpy).toBeCalledWith(email);
    });
});
