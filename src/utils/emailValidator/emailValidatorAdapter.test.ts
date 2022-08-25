import { mockValidator } from '../mocks';
import { EmailValidatorAdapter } from '.';

jest.mock('validator');

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

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
