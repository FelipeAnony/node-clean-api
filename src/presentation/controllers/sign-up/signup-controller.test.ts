import { faker } from '@faker-js/faker';

import { AddAccountModel } from '@/domain/models';

import { MissingParamError, InvalidParamError, InternalServerError } from '@/presentation/errors';
import { SignUpController } from './signup-controller';
import { HttpRequest } from '../../protocols';

import { makeAddAccountStub, makeEmailValidatorStub } from '@/presentation/mocks';

const makeSignUpController = () => {
    const emailValidatorStub = makeEmailValidatorStub();
    const addAccountStub = makeAddAccountStub();

    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    return { sut, emailValidatorStub, addAccountStub };
};

const makeHttpRequestObject = ({
    name = faker.name.firstName(),
    email = faker.internet.email(),
    password = faker.internet.password(32),
}): HttpRequest<AddAccountModel> => {
    const passwordConfirmation = password;

    return {
        body: {
            name,
            email,
            password,
            passwordConfirmation,
        },
    };
};

describe('SignUp controller', () => {
    it('Should return 400 if theres no name provided', async () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ name: '' });

        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('Should return 400 if theres no email provided', async () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ email: '' });

        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if theres no password provided', async () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ password: '' });

        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 400 if theres no password confirmation provided', async () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        httpRequest.body!.passwordConfirmation = '';
        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('passwordConfirmation'));
    });

    it('Should return 400 if password confirmation fails', async () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        httpRequest.body!.passwordConfirmation = 'any-pass';
        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'));
    });

    it('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ email: 'invalid-email' });

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });

    it('Should call email validator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        sut.handle(httpRequest);

        expect(isValidSpy).toBeCalledWith(httpRequest.body!.email);
    });

    it('Should return 500 if emailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new InternalServerError());
    });

    it('Should calls AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        const addSpy = jest.spyOn(addAccountStub, 'add');
        sut.handle(httpRequest);

        expect(addSpy).toBeCalledWith(httpRequest.body);
    });

    it('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            return Promise.reject(new Error());
        });

        const response = await sut.handle(httpRequest);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new InternalServerError());
    });

    it('Should return the account created on addAccount success case with correct data', async () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        const { email, name } = httpRequest.body!;
        const response = await sut.handle(httpRequest);

        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(email);
        expect(response.body.name).toBe(name);
        expect(response.body.id).not.toBeUndefined();
    });
});
