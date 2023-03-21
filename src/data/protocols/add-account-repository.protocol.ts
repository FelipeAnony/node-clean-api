import { AccountModel, AddAccountModel } from '@/domain/models';

export interface AddAccountRepository {
    add(params: AddAccountModel): Promise<AccountModel>;
}
