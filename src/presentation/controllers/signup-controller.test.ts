import { faker } from '@faker-js/faker';

import { MissingParamError, InvalidParamError, InternalServerError } from '@/presentation/errors';
import { SignUpController } from './signup-controller';
import { EmailValidator } from '../protocols';

const makeSignUpController = () => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    return { sut, emailValidatorStub };
};

const makeHttpRequestObject = ({
    name = faker.name.firstName(),
    email = faker.internet.email(),
    password = faker.internet.password(32),
}) => {
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
    it('Should return 400 if theres no name provided', () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ name: '' });

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('Should return 400 if theres no email provided', () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ email: '' });

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if theres no password provided', () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ password: '' });

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 400 if theres no password confirmation provided', () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        httpRequest.body.passwordConfirmation = '';
        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('passwordConfirmation'));
    });

    it('Should return 400 if password confirmation fails', () => {
        const { sut } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        httpRequest.body.passwordConfirmation = 'any-pass';
        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'));
    });

    it('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({ email: 'invalid-email' });

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });

    it('Should call email validator with correct email', () => {
        const { sut, emailValidatorStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        sut.handle(httpRequest);

        expect(isValidSpy).toBeCalledWith(httpRequest.body.email);
    });

    it('Should return 500 if emailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSignUpController();
        const httpRequest = makeHttpRequestObject({});

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new InternalServerError());
    });
});
