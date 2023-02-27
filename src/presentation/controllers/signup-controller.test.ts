import { faker } from '@faker-js/faker';

import { SignUpController } from './signup-controller';

describe('SignUp controller', () => {
    it('Should return 400 if theres no name provided', () => {
        const sut = new SignUpController();
        const password = faker.internet.password(32);

        const httpRequest = {
            email: faker.internet.email(),
            password,
            passwordConfirmation: password,
        };

        const response = sut.handle(httpRequest);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new Error('Missing param: name'));
    });
});
