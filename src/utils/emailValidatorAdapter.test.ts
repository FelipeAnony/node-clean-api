import { EmailValidator } from '@/presentation/controllers/signUpController/signUpProtocols';
import validator from 'validator';

jest.mock('validator');

const mockValidator = (value = true) => {
  const mockedIsEmail = jest.spyOn(validator, 'isEmail');
  mockedIsEmail.mockReturnValueOnce(value);

  return mockedIsEmail;
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
    mockValidator();
    const sut = makeSut();

    const isValid = sut.isValid('valid@email');
    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const validatorSpy = mockValidator();
    const sut = makeSut();

    const email = 'any@mail.com';
    sut.isValid(email);
    expect(validatorSpy).toBeCalledWith(email);
  });
});
