import { InternalServerError } from '../errors';
import { HttpResponse } from '../protocols';

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
});

export const internalServerError = (): HttpResponse => ({
    statusCode: 500,
    body: new InternalServerError(),
});
