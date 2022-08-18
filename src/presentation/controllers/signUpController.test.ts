class SignUpController {
  handle(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: Name'),
      };
    }
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
});
