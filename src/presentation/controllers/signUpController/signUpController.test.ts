import { SignUpController } from './signUpController';
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors';

import { AddAccount, AddAccountModel } from '@/domain/usecases/addAccount';

import { AccountModel } from '@/domain/models/accountModel';
import { EmailValidator } from './signUpProtocols';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string) {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
      };
    }
  }

  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  return {
    sut: new SignUpController(emailValidatorStub, addAccountStub),
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: '',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: '',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: '',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: '',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalidEmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 400 if a wrong confirmation password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalidEmail.com',
        password: 'any_password',
        passwordConfirmation: 'other_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  it('Should call EmailValidator with correct email param', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email);
  });

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it('Should call AddAccout with correct params', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);
    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
    });
  });

  it('Should return 500 if AddAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut();

    const AddSpy = jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it('Should return 200 if all data provided is valid', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };
    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    });
  });
});
