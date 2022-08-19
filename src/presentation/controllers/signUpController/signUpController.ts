import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/httpHelper';
import { Controller } from '../../protocols/controller';
import { EmailValidator } from '../../protocols/emailValidator';
import { HttpRequest, HttpResponse } from '../../protocols/http';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }

    try {
      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return { statusCode: 200, body: {} };
    } catch (error) {
      return serverError();
    }
  }
}
