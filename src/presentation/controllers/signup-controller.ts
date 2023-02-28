import { MissingParamError } from '@/presentation/errors';
import { HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest } from '@/presentation/helpers';

export class SignUpController {
    handle({ body }: HttpRequest): HttpResponse {
        if (!body.name) return badRequest(new MissingParamError('name'));
        if (!body.email) return badRequest(new MissingParamError('email'));

        return {
            statusCode: 200,
            body: {},
        };
    }
}
