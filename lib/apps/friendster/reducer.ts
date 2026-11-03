import {
  FICTIONAL_PROFILES,
  INITIAL_BULLETINS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TESTIMONIALS,
  INITIAL_USER_PROFILE,
} from "./data";
import type {
  Bulletin,
  FriendsterAction,
  FriendsterState,
  Testimonial,
} from "./types";

export const initialFriendsterState: FriendsterState = {
  userProfile: INITIAL_USER_PROFILE,
  friendIds: FICTIONAL_PROFILES.filter((p) => p.isDefaultFriend).map((p) => p.id),
  viewingFriendId: null,
  testimonials: INITIAL_TESTIMONIALS,
  bulletins: INITIAL_BULLETINS,
  notifications: INITIAL_NOTIFICATIONS,
  activeTab: "profile",
  isEditingProfile: false,
  editFormData: {
    displayName: INITIAL_USER_PROFILE.displayName,
    status: INITIAL_USER_PROFILE.status,
    aboutMe: INITIAL_USER_PROFILE.aboutMe,
  },
};

export function friendsterReducer(
  state: FriendsterState,
  action: FriendsterAction,
): FriendsterState {
  switch (action.type) {
    case "START_EDIT_PROFILE":
      return {
        ...state,
        isEditingProfile: true,
        editFormData: {
          displayName: state.userProfile.displayName,
          status: state.userProfile.status,
          aboutMe: state.userProfile.aboutMe,
        },
      };

    case "CANCEL_EDIT_PROFILE":
      return {
        ...state,
        isEditingProfile: false,
      };

    case "UPDATE_EDIT_FIELD":
      return {
        ...state,
        editFormData: {
          ...state.editFormData,
          [action.field]: action.value,
        },
      };

    case "SAVE_PROFILE":
      return {
        ...state,
        isEditingProfile: false,
        userProfile: {
          ...state.userProfile,
          displayName: state.editFormData.displayName.trim() || state.userProfile.displayName,
          status: state.editFormData.status.trim() || state.userProfile.status,
          aboutMe: state.editFormData.aboutMe.trim() || state.userProfile.aboutMe,
        },
      };

    case "SET_THEME":
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          themeId: action.themeId,
        },
      };

    case "ADD_FRIEND": {
      if (state.friendIds.includes(action.friendId)) return state;
      const friend = FICTIONAL_PROFILES.find((f) => f.id === action.friendId);
      const newFriendIds = [...state.friendIds, action.friendId];
      const newNotification = friend
        ? {
            id: `notif-${Date.now()}`,
            type: "friend_request" as const,
            message: `You are now friends with ${friend.name} (${friend.handle})!`,
            time: "Just now",
            isRead: false,
          }
        : null;

      return {
        ...state,
        friendIds: newFriendIds,
        notifications: newNotification
          ? [newNotification, ...state.notifications]
          : state.notifications,
      };
    }

    case "REMOVE_FRIEND":
      return {
        ...state,
        friendIds: state.friendIds.filter((id) => id !== action.friendId),
      };

    case "APPROVE_TESTIMONIAL":
      return {
        ...state,
        testimonials: state.testimonials.map((testi) =>
          testi.id === action.testimonialId ? { ...testi, status: "approved" } : testi,
        ),
      };

    case "REJECT_TESTIMONIAL":
      return {
        ...state,
        testimonials: state.testimonials.map((testi) =>
          testi.id === action.testimonialId ? { ...testi, status: "rejected" } : testi,
        ),
      };

    case "WRITE_TESTIMONIAL": {
      const recipient = FICTIONAL_PROFILES.find((p) => p.id === action.recipientId);
      const newTestimonial: Testimonial = {
        id: `testi-${Date.now()}`,
        authorId: "user",
        authorName: state.userProfile.displayName,
        authorAvatar: state.userProfile.avatar,
        recipientId: action.recipientId,
        content: action.content,
        date: "Just now",
        status: "approved",
      };

      const newNotification = {
        id: `notif-${Date.now()}`,
        type: "testimonial" as const,
        message: `Your testimonial for ${recipient?.name || "your friend"} was sent!`,
        time: "Just now",
        isRead: false,
      };

      return {
        ...state,
        testimonials: [newTestimonial, ...state.testimonials],
        notifications: [newNotification, ...state.notifications],
      };
    }

    case "POST_BULLETIN": {
      const newBulletin: Bulletin = {
        id: `bull-${Date.now()}`,
        authorName: state.userProfile.displayName,
        authorHandle: "me",
        authorAvatar: state.userProfile.avatar,
        title: action.title,
        content: action.content,
        date: "Just now",
      };

      const newNotification = {
        id: `notif-${Date.now()}`,
        type: "bulletin" as const,
        message: `Your bulletin "${action.title}" was posted to your network.`,
        time: "Just now",
        isRead: false,
      };

      return {
        ...state,
        bulletins: [newBulletin, ...state.bulletins],
        notifications: [newNotification, ...state.notifications],
      };
    }

    case "DELETE_BULLETIN":
      return {
        ...state,
        bulletins: state.bulletins.filter((b) => b.id !== action.bulletinId),
      };

    case "VIEW_FRIEND":
      return {
        ...state,
        viewingFriendId: action.friendId,
        activeTab: "profile",
      };

    case "VIEW_MY_PROFILE":
      return {
        ...state,
        viewingFriendId: null,
        activeTab: "profile",
      };

    case "SET_TAB":
      return {
        ...state,
        activeTab: action.tab,
      };

    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };

    case "INCREMENT_VIEWS":
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          profileViews: state.userProfile.profileViews + 1,
        },
      };

    default:
      return state;
  }
}
