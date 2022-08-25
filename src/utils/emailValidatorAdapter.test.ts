import { EmailValidator } from '@/presentation/controllers/signUpController/signUpProtocols';
import validator from 'validator';

jest.mock('validator');

const mockValidator = (value: boolean) => {
  const mockedIsEmail = jest.spyOn(validator, 'isEmail');
  mockedIsEmail.mockReturnValueOnce(value);
};

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    mockValidator(false);
    const sut = makeSut();

    const isValid = sut.isValid('invalid-email');
    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    mockValidator(true);
    const sut = makeSut();

    const isValid = sut.isValid('valid@email');
    expect(isValid).toBe(true);
  });
});
