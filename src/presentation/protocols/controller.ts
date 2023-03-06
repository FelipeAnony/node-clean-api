import { HttpRequest, HttpResponse } from './http';

export interface Controller {
    handle(params: HttpRequest): Promise<HttpResponse>;
}
