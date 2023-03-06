import { AddAccount } from '@/domain/usecases';

import { EmailValidator } from '@/infra/protocols';

import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest, internalServerError } from '@/presentation/helpers';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';

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

            const newAccount = this.addAccount.add(body);

            return {
                statusCode: 200,
                body: newAccount,
            };
        } catch (error) {
            return internalServerError();
        }
    }
}
