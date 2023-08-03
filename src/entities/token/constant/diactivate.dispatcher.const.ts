import { RTBlacklist } from '@token/repository';
import { Repository } from 'typeorm';


/**
 * Диспетчер для работы с блокировкой токена.
 */
const deactivateDispatcher = {
    Deactivated: async (tokenId: number, blRepo: Repository<RTBlacklist>) => {
        const blEntry = await blRepo.create({ tokenId });
        await blRepo.save(blEntry);
    },
    Error: async tokenId => { 
        throw new Error(`Error when deactivating token. Token id: ${ tokenId }`) 
    }
}


export { deactivateDispatcher };