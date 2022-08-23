import { AddAccount } from '@/domain/usecases/addAccount';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from './signUpProtocols';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    //Ensure all required fields above are provided
    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }

    const { name, email, password, passwordConfirmation } = httpRequest.body;

    try {
      const emailIsValid = this.emailValidator.isValid(email);
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const account = this.addAccount.add({ name, email, password });

      return { statusCode: 200, body: account };
    } catch (error) {
      return serverError();
    }
  }
}
