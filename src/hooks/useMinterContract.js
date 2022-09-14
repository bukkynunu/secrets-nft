import {useContract} from './useContract';
import SecretNFTAbi from '../contracts/SecretNFT.json';
import SecretContractAddress from '../contracts/SecretAddress.json';


// export interface for NFT contract
export const useMinterContract = () => useContract(SecretNFTAbi.abi, SecretContractAddress.SecretNFT);