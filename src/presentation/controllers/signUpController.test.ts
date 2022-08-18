class SignUpController {
  handle(httpRequest: any): any {
    return {
      statusCode: 400,
    };
  }
}

const makeSut = () => {
  return new SignUpController();
};

describe('SignUp controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
