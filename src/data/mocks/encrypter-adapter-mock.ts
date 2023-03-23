import { EncrypterAdapter } from '@/data/protocols';

class EncrypterAdapterStub implements EncrypterAdapter {
    encrypt(value: string): Promise<string> {
        return Promise.resolve('value-encrypted');
    }
}

export const makeEncrypterAdapterStub = (): EncrypterAdapter => {
    return new EncrypterAdapterStub();
};
