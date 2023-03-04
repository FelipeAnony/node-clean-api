import { InvalidParamError, MissingParamError } from '@/presentation/errors';

import {
    AddAccount,
    Controller,
    EmailValidator,
    HttpRequest,
    HttpResponse,
} from '@/presentation/protocols';

import { badRequest, internalServerError } from '@/presentation/helpers';

export class SignUpController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount
    ) {}

    handle({ body }: HttpRequest): HttpResponse {
        try {
            const requiredParams = ['name', 'email', 'password', 'passwordConfirmation'];

            for (const field of requiredParams) {
                if (!body[field]) return badRequest(new MissingParamError(field));
            }

            const { password, passwordConfirmation, email } = body;

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'));
            }

            const emailIsValid = this.emailValidator.isValid(email);
            if (!emailIsValid) return badRequest(new InvalidParamError('email'));

            this.addAccount.add(body);
        } catch (error) {
            return internalServerError();
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
