import validator from 'validator';

import { EmailValidator } from '@/presentation/controllers/signUpController/signUpProtocols';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
