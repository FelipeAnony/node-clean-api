export interface EncrypterAdapter {
    encrypt(value: string): Promise<string>;
}
