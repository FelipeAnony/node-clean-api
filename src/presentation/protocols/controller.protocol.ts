import { HttpRequest, HttpResponse } from './http.protocol';

export interface Controller {
    handle(params: HttpRequest): Promise<HttpResponse>;
}
