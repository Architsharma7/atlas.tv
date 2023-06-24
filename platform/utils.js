import { ethers, utils } from "ethers";
import omitDeep from "omit-deep";

export function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}

export function signedTypeData(domain, types, value) {
  const signer = getSigner();
  return signer._signTypedData(
    omitDeep(domain, "__typename"),
    omitDeep(types, "__typename"),
    omitDeep(value, "__typename")
  );
}

export function splitSignature(signature) {
  return utils.splitSignature(signature);
}
