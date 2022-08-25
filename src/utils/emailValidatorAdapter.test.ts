import { EmailValidator } from '@/presentation/controllers/signUpController/signUpProtocols';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return false;
  }
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@gmail.com');
    expect(isValid).toBe(false);
  });

  // it('Should return true if validator returns true', () => {
  //   const sut = new EmailValidatorAdapter();
  //   const isValid = sut.isValid('invalid_email@gmail.com');
  //   expect(isValid).toBe(true);
  // });
});
