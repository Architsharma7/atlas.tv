import { appId, LensConfig, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

const lensConfig: LensConfig = {
  appId: appId("Atlas.tv"), // the publications will be tagged with this AppID
  sources: [appId("Atlas.tv")], // the Publications will be filtered by this AppId
  bindings: wagmiBindings(),
  environment: development,
};

export { lensConfig };
