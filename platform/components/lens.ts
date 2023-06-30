import { appId, LensConfig, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const lensConfig: LensConfig = {
  appId: appId("Atlastv"), // the publications will be tagged with this AppID
  sources: [appId("Atlastv")], // the Publications will be filtered by this AppId
  bindings: wagmiBindings(),
  environment: development,
};

const API_URL = "https://api-mumbai.lens.dev";

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;
export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

export { lensConfig };
