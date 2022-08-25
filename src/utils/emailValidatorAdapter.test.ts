import { EmailValidator } from '@/presentation/controllers/signUpController/signUpProtocols';
import validator from 'validator';

jest.mock('validator');

const mockedIsEmail = jest.spyOn(validator, 'isEmail');
mockedIsEmail.mockReturnValue(true);

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    mockedIsEmail.mockReturnValueOnce(false);
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid-email');
    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid@email');
    expect(isValid).toBe(true);
  });
});
