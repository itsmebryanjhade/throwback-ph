import { describe, expect, it } from "vitest";
import {
  friendsterReducer,
  initialFriendsterState,
} from "@/lib/apps/friendster/reducer";

describe("Friendster State Reducer", () => {
  it("provides initial state with 4 default friends and 1 pending testimonial", () => {
    expect(initialFriendsterState.userProfile.displayName).toBe("Miguel (ASL)");
    expect(initialFriendsterState.userProfile.themeId).toBe("classic-orange");
    expect(initialFriendsterState.friendIds).toHaveLength(4);

    const approved = initialFriendsterState.testimonials.filter(
      (t) => t.status === "approved",
    );
    const pending = initialFriendsterState.testimonials.filter(
      (t) => t.status === "pending",
    );

    expect(approved).toHaveLength(3);
    expect(pending).toHaveLength(1);
    expect(pending[0].authorName).toBe("Dianne Morales");
  });

  it("handles profile editing workflow: start, update field, save, cancel", () => {
    let state = friendsterReducer(initialFriendsterState, {
      type: "START_EDIT_PROFILE",
    });
    expect(state.isEditingProfile).toBe(true);
    expect(state.editFormData.displayName).toBe("Miguel (ASL)");

    state = friendsterReducer(state, {
      type: "UPDATE_EDIT_FIELD",
      field: "displayName",
      value: "Miguel K. (Kamikazee Fan)",
    });
    state = friendsterReducer(state, {
      type: "UPDATE_EDIT_FIELD",
      field: "status",
      value: "listening to Urbandub · tara DotA!",
    });
    state = friendsterReducer(state, {
      type: "UPDATE_EDIT_FIELD",
      field: "aboutMe",
      value: "Updated about me text for testing.",
    });

    state = friendsterReducer(state, { type: "SAVE_PROFILE" });
    expect(state.isEditingProfile).toBe(false);
    expect(state.userProfile.displayName).toBe("Miguel K. (Kamikazee Fan)");
    expect(state.userProfile.status).toBe("listening to Urbandub · tara DotA!");
    expect(state.userProfile.aboutMe).toBe("Updated about me text for testing.");

    // Test cancel
    state = friendsterReducer(state, { type: "START_EDIT_PROFILE" });
    state = friendsterReducer(state, {
      type: "UPDATE_EDIT_FIELD",
      field: "displayName",
      value: "Unsaved Name",
    });
    state = friendsterReducer(state, { type: "CANCEL_EDIT_PROFILE" });
    expect(state.isEditingProfile).toBe(false);
    expect(state.userProfile.displayName).toBe("Miguel K. (Kamikazee Fan)");
  });

  it("updates profile themes seamlessly", () => {
    let state = friendsterReducer(initialFriendsterState, {
      type: "SET_THEME",
      themeId: "cyber-neon",
    });
    expect(state.userProfile.themeId).toBe("cyber-neon");

    state = friendsterReducer(state, {
      type: "SET_THEME",
      themeId: "glitter-star",
    });
    expect(state.userProfile.themeId).toBe("glitter-star");
  });

  it("adds and removes friends and records notifications", () => {
    // Add Janine Santos (non-default friend)
    let state = friendsterReducer(initialFriendsterState, {
      type: "ADD_FRIEND",
      friendId: "janine-santos",
    });
    expect(state.friendIds).toContain("janine-santos");
    expect(state.friendIds).toHaveLength(5);
    expect(state.notifications[0].message).toContain("Janine Santos");

    // Adding existing friend does not duplicate
    state = friendsterReducer(state, {
      type: "ADD_FRIEND",
      friendId: "janine-santos",
    });
    expect(state.friendIds).toHaveLength(5);

    // Remove friend
    state = friendsterReducer(state, {
      type: "REMOVE_FRIEND",
      friendId: "janine-santos",
    });
    expect(state.friendIds).not.toContain("janine-santos");
    expect(state.friendIds).toHaveLength(4);
  });

  it("approves and rejects received testimonials", () => {
    const pendingTesti = initialFriendsterState.testimonials.find(
      (t) => t.status === "pending",
    );
    expect(pendingTesti).toBeDefined();

    // Approve
    let state = friendsterReducer(initialFriendsterState, {
      type: "APPROVE_TESTIMONIAL",
      testimonialId: pendingTesti!.id,
    });
    const approvedItem = state.testimonials.find((t) => t.id === pendingTesti!.id);
    expect(approvedItem?.status).toBe("approved");

    // Reject
    state = friendsterReducer(initialFriendsterState, {
      type: "REJECT_TESTIMONIAL",
      testimonialId: pendingTesti!.id,
    });
    const rejectedItem = state.testimonials.find((t) => t.id === pendingTesti!.id);
    expect(rejectedItem?.status).toBe("rejected");
  });

  it("writes testimonials and posts bulletins", () => {
    // Write testimonial
    let state = friendsterReducer(initialFriendsterState, {
      type: "WRITE_TESTIMONIAL",
      recipientId: "kiko-reyes",
      content: "Solid na kaibigan! Rock on bro!",
    });
    expect(state.testimonials[0].content).toBe("Solid na kaibigan! Rock on bro!");
    expect(state.testimonials[0].recipientId).toBe("kiko-reyes");
    expect(state.notifications[0].type).toBe("testimonial");

    // Post bulletin
    state = friendsterReducer(state, {
      type: "POST_BULLETIN",
      title: "Gig Alert: Friday Night",
      content: "Watch Kamikazee live at Club Dredd!",
    });
    expect(state.bulletins[0].title).toBe("Gig Alert: Friday Night");
    expect(state.notifications[0].type).toBe("bulletin");

    // Delete bulletin
    const newBullId = state.bulletins[0].id;
    state = friendsterReducer(state, {
      type: "DELETE_BULLETIN",
      bulletinId: newBullId,
    });
    expect(state.bulletins.find((b) => b.id === newBullId)).toBeUndefined();
  });

  it("switches viewing profiles and active navigation tabs", () => {
    let state = friendsterReducer(initialFriendsterState, {
      type: "VIEW_FRIEND",
      friendId: "bea-gonzales",
    });
    expect(state.viewingFriendId).toBe("bea-gonzales");
    expect(state.activeTab).toBe("profile");

    state = friendsterReducer(state, { type: "VIEW_MY_PROFILE" });
    expect(state.viewingFriendId).toBeNull();

    state = friendsterReducer(state, {
      type: "SET_TAB",
      tab: "museum-info",
    });
    expect(state.activeTab).toBe("museum-info");

    state = friendsterReducer(state, { type: "MARK_NOTIFICATIONS_READ" });
    expect(state.notifications.every((n) => n.isRead)).toBe(true);
  });
});
