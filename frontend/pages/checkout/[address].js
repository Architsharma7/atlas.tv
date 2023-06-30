import React, { useEffect } from "react";
import { AtlasCreatorSubscriptionComponent } from "../../components/SuperfluidSub";
import { useRouter } from "next/router";

const Checkout = () => {
  const router = useRouter();
  const address = router.query;

  return (
    <div>
      <AtlasCreatorSubscriptionComponent
        flowRate={"4"}
        creatorAddress={
          address ? address : "0x898d0DBd5850e086E6C09D2c83A26Bb5F1ff8C33"
        }
        creatorName={"Angry Bro"}
      ></AtlasCreatorSubscriptionComponent>
    </div>
  );
};

export default Checkout;
