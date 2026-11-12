export type FriendsterThemeId =
  | "classic-orange"
  | "cyber-neon"
  | "glitter-star"
  | "sunset-pastel"
  | "denim-sparkle";

export type FriendsterTheme = {
  id: FriendsterThemeId;
  name: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  /** CSS background for the page behind the profile (the "skin"). */
  pattern: string;
};

export type FictionalFriend = {
  id: string;
  name: string;
  handle: string;
  location: string;
  avatar: string;
  portraitSrc: string;
  portraitPosition: string;
  tagline: string;
  aboutMe: string;
  relationshipStatus: string;
  interests: string[];
  isDefaultFriend: boolean;
};

export type Testimonial = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  recipientId: string; // "user" or friendId
  content: string;
  date: string;
  status: "pending" | "approved" | "rejected";
};

export type Bulletin = {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  title: string;
  content: string;
  date: string;
};

export type FriendsterNotification = {
  id: string;
  type: "friend_request" | "testimonial" | "bulletin" | "profile_view";
  message: string;
  time: string;
  isRead: boolean;
};

export type UserProfile = {
  displayName: string;
  status: string;
  aboutMe: string;
  location: string;
  memberSince: string;
  relationshipStatus: string;
  profileViews: number;
  themeId: FriendsterThemeId;
  avatar: string;
  portraitSrc: string;
  portraitPosition: string;
  interests: string[];
  favoriteMusic: string;
  whoIWantToMeet: string;
  profileSong: string;
};

export type FriendsterTab =
  | "profile"
  | "friends"
  | "testimonials"
  | "bulletins"
  | "museum-info";

export type FriendsterState = {
  userProfile: UserProfile;
  friendIds: string[]; // List of friend IDs the user is currently friends with
  viewingFriendId: string | null; // null means viewing own profile
  testimonials: Testimonial[];
  bulletins: Bulletin[];
  notifications: FriendsterNotification[];
  activeTab: FriendsterTab;
  isEditingProfile: boolean;
  editFormData: {
    displayName: string;
    status: string;
    aboutMe: string;
  };
};

export type FriendsterAction =
  | { type: "START_EDIT_PROFILE" }
  | { type: "CANCEL_EDIT_PROFILE" }
  | { type: "UPDATE_EDIT_FIELD"; field: "displayName" | "status" | "aboutMe"; value: string }
  | { type: "SAVE_PROFILE" }
  | { type: "SET_THEME"; themeId: FriendsterThemeId }
  | { type: "ADD_FRIEND"; friendId: string }
  | { type: "REMOVE_FRIEND"; friendId: string }
  | { type: "APPROVE_TESTIMONIAL"; testimonialId: string }
  | { type: "REJECT_TESTIMONIAL"; testimonialId: string }
  | { type: "WRITE_TESTIMONIAL"; recipientId: string; content: string }
  | { type: "POST_BULLETIN"; title: string; content: string }
  | { type: "DELETE_BULLETIN"; bulletinId: string }
  | { type: "VIEW_FRIEND"; friendId: string }
  | { type: "VIEW_MY_PROFILE" }
  | { type: "SET_TAB"; tab: FriendsterTab }
  | { type: "MARK_NOTIFICATIONS_READ" }
  | { type: "INCREMENT_VIEWS" };
