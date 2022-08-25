import validator from 'validator';

export const mockValidator = (value = true) => {
  const mockedIsEmail = jest.spyOn(validator, 'isEmail');
  mockedIsEmail.mockReturnValueOnce(value);

  return mockedIsEmail;
};
