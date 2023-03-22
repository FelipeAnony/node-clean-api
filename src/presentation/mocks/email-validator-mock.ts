import { EmailValidator } from '@/infra/protocols';

class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
        return true;
    }
}

export const makeEmailValidatorStub = (): EmailValidator => {
    return new EmailValidatorStub();
};
