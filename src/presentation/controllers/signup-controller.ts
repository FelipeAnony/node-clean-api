import { MissingParamError } from '@/presentation/errors';
import { HttpRequest, HttpResponse } from '@/presentation/protocols';

export class SignUpController {
    handle({ body }: HttpRequest): HttpResponse {
        if (!body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('name'),
            };
        }

        if (!body.email) {
            return {
                statusCode: 400,
                body: new MissingParamError('email'),
            };
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
