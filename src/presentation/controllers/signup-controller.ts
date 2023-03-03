import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest, internalServerError } from '@/presentation/helpers';

export class SignUpController implements Controller {
    constructor(private readonly emailValidator: EmailValidator) {}

    handle({ body }: HttpRequest): HttpResponse {
        try {
            const requiredParams = ['name', 'email', 'password', 'passwordConfirmation'];

            for (const field of requiredParams) {
                if (!body[field]) return badRequest(new MissingParamError(field));
            }

            const emailIsValid = this.emailValidator.isValid(body.email);
            if (!emailIsValid) return badRequest(new InvalidParamError('email'));
        } catch (error) {
            return internalServerError();
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
