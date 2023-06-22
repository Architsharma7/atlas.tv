import React from 'react'
import {
    AtlasSubscriptionComponent,
    AtlasCreatorSubscriptionComponent,
  } from "../components/SuperfluidSub";

const Stream = () => {
  return (
    <div>
         <AtlasSubscriptionComponent></AtlasSubscriptionComponent>
          <AtlasCreatorSubscriptionComponent
            flowRate={"2"}
            creatorAddress={"0x7BDa037dFdf9CD9Ad261D27f489924aebbcE71Ac"}
            creatorName={"John harris"}
          ></AtlasCreatorSubscriptionComponent>
    </div>
  )
}

export default Stream