import React, { useEffect } from "react";
import { AtlasCreatorSubscriptionComponent } from "../../components/SuperfluidSub";
import { useRouter } from "next/router";

const Checkout = () => {
  const router = useRouter();
  const address = router.query;
  // add other query Params

  useEffect(() => {}, [address]);
  return (
    <div>
      <AtlasCreatorSubscriptionComponent
        flowRate={"2"}
        creatorAddress={"0x7BDa037dFdf9CD9Ad261D27f489924aebbcE71Ac"}
        creatorName={"John harris"}
      ></AtlasCreatorSubscriptionComponent>
    </div>
  );
};

export default Checkout;
