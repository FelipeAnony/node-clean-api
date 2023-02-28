import { MissingParamError } from '@/presentation/errors';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest } from '@/presentation/helpers';

export class SignUpController implements Controller {
    handle({ body }: HttpRequest): HttpResponse {
        const requiredParams = ['name', 'email', 'password', 'passwordConfirmation'];

        for (const field of requiredParams) {
            if (!body[field]) return badRequest(new MissingParamError(field));
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
