import { EmailValidator } from '@/presentation/protocols';

class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
        return true;
    }
}

export const makeEmailValidatorStub = (): EmailValidator => {
    return new EmailValidatorStub();
};
