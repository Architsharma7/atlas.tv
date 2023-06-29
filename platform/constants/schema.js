// Tasks
// -> Creators -- containing the info of all the creator
// -> Users --  containing the info of user like subscribed or not
// -> Metrics -- info of each creator's total views and watch hours

// @public
// collection CreatorProfile {
//   id: string; // creator Profile ID from Lens
//   name: string;
//   channelDescription ?: string;
//   channelName ?: string;
//   profileImageUrl ?: string;
//   emailId ?: string;
//   creatorId ?: string;
//   viewMetrics?: ViewMetrics

//   constructor (id: string, name: string) {
//     this.id = id;
//     this.name = name;
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
//   hasSubscribed: boolean;
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
// }
