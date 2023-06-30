// Tasks
// -> Creators -- containing the info of all the creator
// -> Users --  containing the info of user like subscribed or not
// -> Metrics -- info of each creator's total views and watch hours

// @public
// collection Creators {
//    id: string;
//    creatorIds: string[] // array of all the active creator's profile Ids
//    creatorAddresses: string[] // array of all the addresses
//   constructor(id: string){
//    this.id =  id;
//   }
//
//   addCreator(creatorId: string , creatorAddress: string){
//    this.creatorIds.push(creatorId);
//    this.creatorAddresses.push(creatorAddress);
//   }
//   }

// @public
// collection CreatorProfile {
//   id: string; // creator Profile ID from Lens
//   name: string;
//   address: string;
//   channelDescription ?: string;
//   channelName ?: string;
//   profileImageUrl ?: string;
//   emailId ?: string;
//   creatorId ?: string;
//   viewMetrics?: ViewMetrics
//   videos?: string[] // Asset ID from Livepeer
//   constructor (id: string, name: string, address: string) {
//     this.id = id;
//     this.name = name;
//     this.address =  address;
//   }

//   setCreatorAbout(channelDescription: string,
//     channelName : string,
//     profileImageUrl: string,
//     emailId: string,
//     creatorId: string)
//   {
//     this.channelDescription =  channelDescription;
//     this.channelName = channelName;
//     this.profileImageUrl= profileImageUrl;
//     this.emailId = emailId;
//     this.creatorId = creatorId;
//   }
//
//  addVideos(assetId: string) {
//     this.videos.push(assetId);
//  }
// }

// @public
// collection ViewMetrics {
//   id: string; // creator Profile ID from Lens
//   totalViews?: number;
//   totalWatchHours?: number;

//   dayViews?: number;
//   dayWatchHours?: number;

//   lastUpdateTimestamp?: number;

//   constructor(id: string){
//     this.id = id;
//   }

//   updateMetrices(newTotalviews: number , newWatchHours: number, currentTimeStamp: number){
//     this.dayViews = newTotalviews - this.totalViews;
//     this.dayWatchHours = newWatchHours -  this.totalWatchHours;

//     this.totalViews =  newTotalviews;
//     this.totalWatchHours = newWatchHours;

//     this.lastUpdateTimestamp = currentTimeStamp;
//   }
// }

// @public
// collection UserProfile {
//   id: string;
//   name: string;
//   hasSubscribed?: boolean;
//   userName ?: string;
//   userEmailId ?: string;

//   constructor (id: string, name: string) {
//     this.id = id;
//     this.name = name;
//   }

//   setUserAbout(userName : string,userEmailId : string)
//   {
//     this.userName =  userName;
//     this.userEmailId = userEmailId;
//   }
//   setUserSubStatus(hasSubscribed: boolean){
//   this.hasSubscribed =  hasSubscribed ;
//   }
// }
