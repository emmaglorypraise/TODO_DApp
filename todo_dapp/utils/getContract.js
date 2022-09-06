import abi from "../abi.js";
const { ethers: etherjs } = ethers;
import {CONTRACT_ADDRESS, rpcURL} from "../constant.js"

let signerProvider = new etherjs.providers.Web3Provider(window.ethereum);
let signerA = signerProvider.getSigner(); 

const getContract = (isSigner=false, address=CONTRACT_ADDRESS, ABI=abi) => {
  let signerOrProvider = new etherjs.providers.Web3Provider(window.ethereum);
  let signer = signerOrProvider.getSigner(); 

  let provider = new etherjs.providers.JsonRpcProvider(rpcURL);

  let newProvider = isSigner ? signer : provider;
  return new etherjs.Contract(address, ABI, newProvider )
}

export default getContract;
export {signerProvider, signerA};
