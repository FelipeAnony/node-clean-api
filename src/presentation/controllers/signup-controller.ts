import { MissingParamError } from '@/presentation/errors';
import { HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest } from '@/presentation/helpers';

export class SignUpController {
    handle({ body }: HttpRequest): HttpResponse {
        const requiredParams = ['name', 'email'];

        for (const field of requiredParams) {
            if (!body[field]) return badRequest(new MissingParamError(field));
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
