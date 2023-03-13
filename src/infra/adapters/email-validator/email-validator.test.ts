import { EmailValidator } from '@/infra/protocols';

const makeSut = () => {
    class ValidatorStub {
        validate(email: string): boolean {
            return true;
        }
    }

    class EmailValidatorAdapter implements EmailValidator {
        constructor(private readonly validator: any) {}

        isValid(email: string): boolean {
            return this.validator.validate(email);
        }
    }

    const validatorStub = new ValidatorStub();
    const sut = new EmailValidatorAdapter(validatorStub);

    return { sut, validatorStub };
};

describe('EmailValidator Adapter', () => {
    it('Should return false if validator returns false', () => {
        const { sut, validatorStub } = makeSut();

        jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(false);

        const emailIsValid = sut.isValid('invalid-email');
        expect(emailIsValid).toBe(false);
    });

    it('Should return true if validator returns true', () => {
        const { sut, validatorStub } = makeSut();

        jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(true);

        const emailIsValid = sut.isValid('valid-email');
        expect(emailIsValid).toBe(true);
    });
});
