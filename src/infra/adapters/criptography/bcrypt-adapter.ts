import bcrypt from 'bcrypt';

import { EncrypterAdapter } from '@/data/protocols';

export class BcryptAdapter implements EncrypterAdapter {
    constructor(private salt = 12) {}

    async encrypt(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt);
    }
}
