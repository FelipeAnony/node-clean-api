import { SignUpController } from './signUpController';

const makeSut = () => {
  return new SignUpController();
};

describe('SignUp controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: '',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: Name'));
  });

  it('Should return 400 if no email is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: '',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: Email'));
  });
});
