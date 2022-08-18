import { MissingParamError } from '../../errors/missingParamError';
import { HttpRequest, HttpResponse } from '../../protocols/http';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('Name'),
      };
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('Email'),
      };
    }

    return { statusCode: 200, body: {} };
  }
}
