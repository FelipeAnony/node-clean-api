import { faker } from '@faker-js/faker';
import { MissingParamError } from '@/presentation/errors';

import { SignUpController } from './signup-controller';

const makeSignUpController = () => {
    return new SignUpController();
};

describe('SignUp controller', () => {
    it('Should return 400 if theres no name provided', () => {
        const sut = makeSignUpController();
        const password = faker.internet.password(32);

        const httpRequest = {
            body: {
                email: faker.internet.email(),
                password,
                passwordConfirmation: password,
            },
        };

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('Should return 400 if theres no email provided', () => {
        const sut = makeSignUpController();
        const password = faker.internet.password(32);

        const httpRequest = {
            body: {
                name: faker.name.firstName(),
                password,
                passwordConfirmation: password,
            },
        };

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if theres no password provided', () => {
        const sut = makeSignUpController();
        const password = faker.internet.password(32);

        const httpRequest = {
            body: {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                passwordConfirmation: password,
            },
        };

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 400 if theres no password confirmation provided', () => {
        const sut = makeSignUpController();
        const password = faker.internet.password(32);

        const httpRequest = {
            body: {
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password,
            },
        };

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('passwordConfirmation'));
    });
});
