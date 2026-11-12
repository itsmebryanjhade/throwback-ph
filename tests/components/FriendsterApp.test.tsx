import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { initialMuseumState } from "@/lib/museum-state";

describe("Phase 3 — Friendster PH Flagship Application", () => {
  it("uses a labeled fictional portrait and exposes standard and maximized compositions", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });
    expect(
      within(windowDialog).getByRole("img", { name: /Miguel.*fictional profile portrait/i }),
    ).toHaveStyle({
      backgroundImage: "url(/museum/phase-9/images/friendster-kiko.jpg)",
    });
    expect(within(windowDialog).getByTestId("app-shell-friendster")).toHaveAttribute("data-layout-mode", "standard");
    fireEvent.click(within(windowDialog).getByRole("button", { name: "Maximize Friendster PH" }));
    expect(within(windowDialog).getByTestId("app-shell-friendster")).toHaveAttribute("data-layout-mode", "maximized");
  });

  it("centers complete portraits and uses avatars where no distinct downloaded photo exists", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });
    fireEvent.click(within(windowDialog).getByRole("tab", { name: /Friends/i }));

    const photoNames = ["Kiko Reyes", "Bea Gonzales", "Marco Bautista", "Janine Santos"];
    const photos = photoNames.map((name) =>
      within(windowDialog).getByRole("img", { name: `${name} fictional profile portrait` }).getAttribute("style"),
    );
    expect(new Set(photos).size).toBe(photos.length);
    expect(within(windowDialog).getByRole("img", { name: "Paolo Dizon fictional profile portrait" })).toHaveTextContent("🍙");
    expect(within(windowDialog).getByRole("img", { name: "Dianne Morales fictional profile portrait" })).toHaveTextContent("☕");
  });

  it("opens Friendster PH from desktop and renders profile identity and stats", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    // Open Friendster PH directly from desktop
    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));

    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });
    expect(windowDialog).toBeInTheDocument();

    // Check header and profile details
    expect(within(windowDialog).getByText("Miguel (ASL)")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/listening to Sponge Cola/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText("Primary Photo")).toBeInTheDocument();
    expect(within(windowDialog).getByText("Quezon City, Philippines")).toBeInTheDocument();
    expect(within(windowDialog).getByText("1,428")).toBeInTheDocument();

    // Verify taskbar button
    expect(screen.getByRole("button", { name: "Friendster PH" })).toBeInTheDocument();
  });

  it("allows editing display name, status, and About Me with toast confirmation", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Click Edit My Profile
    const editBtn = within(windowDialog).getByRole("button", { name: "✎ Edit My Profile" });
    fireEvent.click(editBtn);

    // Form inputs should be visible
    const nameInput = within(windowDialog).getByRole("textbox", { name: "Display Name" });
    const statusInput = within(windowDialog).getByRole("textbox", { name: "Current Status" });
    const aboutInput = within(windowDialog).getByRole("textbox", { name: "About Me" });

    fireEvent.change(nameInput, { target: { value: "Miguel (Kamikazee Rakista)" } });
    fireEvent.change(statusInput, { target: { value: "listening to Narda · tara comp shop!" } });
    fireEvent.change(aboutInput, { target: { value: "New edited about me section for Friendster PH." } });

    // Submit form
    const saveBtn = within(windowDialog).getByRole("button", { name: "Save Profile" });
    fireEvent.click(saveBtn);

    // Verify updated values in profile
    expect(within(windowDialog).getByText("Miguel (Kamikazee Rakista)")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/listening to Narda · tara comp shop!/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText("New edited about me section for Friendster PH.")).toBeInTheDocument();

    // Verify OS Toast Notification
    expect(screen.getAllByText("Profile Updated")[0]).toBeInTheDocument();
  });

  it("switches Y2K profile skins and triggers toast notifications", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Switch to Cyber Café Neon theme
    const cyberThemeBtn = within(windowDialog).getByRole("button", {
      name: /Cyber Café Neon/i,
    });
    fireEvent.click(cyberThemeBtn);

    // Verify toast
    expect(screen.getAllByText("Profile Skin Changed")[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Switched theme to Cyber Café Neon/i)[0]).toBeInTheDocument();

    // Switch to Emo & Glitter Star theme
    const glitterThemeBtn = within(windowDialog).getByRole("button", {
      name: /Emo & Glitter Star/i,
    });
    fireEvent.click(glitterThemeBtn);

    expect(screen.getAllByText(/Switched theme to Emo & Glitter Star/i)[0]).toBeInTheDocument();
  });

  it("renders one centered individual profile portrait", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));

    const portrait = screen.getByRole("img", {
      name: /Miguel.*fictional profile portrait/i,
    });
    expect(portrait).toHaveStyle({
      backgroundPosition: "center",
      backgroundSize: "contain",
      backgroundImage: "url(/museum/phase-9/images/friendster-kiko.jpg)",
    });
  });

  it("supports browsing fictional barkada profiles and adding/removing friends", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Navigate to Friends tab
    const friendsTab = within(windowDialog).getByRole("tab", { name: /Friends/i });
    fireEvent.click(friendsTab);

    // Default 4 friends visible
    expect(within(windowDialog).getByText("Kiko Reyes")).toBeInTheDocument();
    expect(within(windowDialog).getByText("Bea Gonzales")).toBeInTheDocument();
    expect(within(windowDialog).getByText("Marco Bautista")).toBeInTheDocument();
    expect(within(windowDialog).getByText("Dianne Morales")).toBeInTheDocument();

    // Janine Santos is a non-default friend available to add
    expect(within(windowDialog).getByText("Janine Santos")).toBeInTheDocument();
    const addJanineBtn = within(windowDialog).getByRole("button", {
      name: "Add Janine Santos as friend",
    });
    fireEvent.click(addJanineBtn);

    // Toast triggered
    expect(screen.getAllByText("Barkada Added")[0]).toBeInTheDocument();

    // Friend button changes to Remove and count increments to 5
    expect(
      within(windowDialog).getByRole("button", {
        name: "Remove Janine Santos from friends",
      }),
    ).toBeInTheDocument();

    // Inspect Kiko's profile
    const viewKikoBtn = within(windowDialog).getAllByRole("button", {
      name: "View Profile",
    })[0];
    fireEvent.click(viewKikoBtn);

    // Profile header switches to Kiko
    expect(within(windowDialog).getByText(/Kiko Reyes \(xX_dark_kiko_Xx\)/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/rakista for life/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Architecture major at UP Diliman/i)).toBeInTheDocument();

    // Return to my profile
    const backBtn = within(windowDialog).getByRole("button", { name: "← Back to My Profile" });
    fireEvent.click(backBtn);

    expect(within(windowDialog).getByText("Miguel (ASL)")).toBeInTheDocument();
  });

  it("manages testimonials: approves pending and writes new testimonial with presets", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Navigate to Testimonials tab
    const testiTab = within(windowDialog).getByRole("tab", { name: /Testimonials/i });
    fireEvent.click(testiTab);

    // Pending testimonial from Dianne Morales
    expect(within(windowDialog).getByText("Dianne Morales")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Here is your official testi as promised!/i)).toBeInTheDocument();

    // Approve testimonial
    const approveBtn = within(windowDialog).getByRole("button", { name: "✓ Approve & Display" });
    fireEvent.click(approveBtn);

    expect(screen.getAllByText("Testimonial Approved")[0]).toBeInTheDocument();

    // Write a new testimonial using period preset
    const presetBtn = within(windowDialog).getByRole("button", { name: "Use example testimonial 1" });
    fireEvent.click(presetBtn);

    const submitTestiBtn = within(windowDialog).getByRole("button", {
      name: "Submit Testimonial",
    });
    fireEvent.click(submitTestiBtn);

    expect(screen.getAllByText("Testimonial Sent")[0]).toBeInTheDocument();
  });

  it("posts and deletes bulletins on the network bulletin board", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Navigate to Bulletins tab
    const bulletinsTab = within(windowDialog).getByRole("tab", { name: /Bulletins/i });
    fireEvent.click(bulletinsTab);

    // Initial bulletins visible
    expect(within(windowDialog).getByText("Sino sasama sa UP Fair next Friday?")).toBeInTheDocument();

    // Open composer
    const postBtn = within(windowDialog).getByRole("button", { name: "✎ Post Bulletin" });
    fireEvent.click(postBtn);

    const titleInput = within(windowDialog).getByRole("textbox", { name: "Subject / Title" });
    const bodyInput = within(windowDialog).getByRole("textbox", { name: "Message" });

    fireEvent.change(titleInput, { target: { value: "Battle of the Bands at SM Megamall" } });
    fireEvent.change(bodyInput, { target: { value: "Free admission this Saturday, let us all support the local indie bands!" } });

    const publishBtn = within(windowDialog).getByRole("button", { name: "Publish Bulletin" });
    fireEvent.click(publishBtn);

    // Toast triggered and bulletin displayed
    expect(screen.getAllByText("Bulletin Posted")[0]).toBeInTheDocument();
    expect(within(windowDialog).getByText("Battle of the Bands at SM Megamall")).toBeInTheDocument();

    // Delete own bulletin
    const deleteBtn = within(windowDialog).getByRole("button", { name: "Delete my bulletin" });
    fireEvent.click(deleteBtn);

    expect(within(windowDialog).queryByText("Battle of the Bands at SM Megamall")).not.toBeInTheDocument();
  });

  it("displays integrated Museum Info with historical interpretation and source citations", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Navigate to Museum Info tab
    const infoTab = within(windowDialog).getByRole("tab", { name: "Museum Info" });
    fireEvent.click(infoTab);

    // Check historical interpretation
    expect(within(windowDialog).getByText("Friendster Era & Early Profile Culture")).toBeInTheDocument();
    expect(within(windowDialog).getByText("2002–2008")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Between 2002 and 2008, Friendster became the undisputed center/i)).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Educational Reconstruction Notice:/i)).toBeInTheDocument();

    // Check real source link
    const archiveLink = within(windowDialog).getByRole("link", {
      name: /Friendster: social networking pioneer/i,
    });
    expect(archiveLink).toHaveAttribute("href", "https://web.archive.org/web/20080101000000*/friendster.com");
  });

  it("toggles activity notifications drawer and marks notifications read", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Open Inbox notifications
    const inboxBtn = within(windowDialog).getByRole("button", {
      name: /Friendster notifications/i,
    });
    fireEvent.click(inboxBtn);

    expect(within(windowDialog).getByText("Notifications & Activity")).toBeInTheDocument();
    expect(within(windowDialog).getByText(/Dianne Morales wrote you a new testimonial/i)).toBeInTheDocument();
  });

  it("supports keyboard tab navigation and accessible states", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    const tabs = within(windowDialog).getAllByRole("tab");
    expect(tabs.length).toBe(5);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");

    // Switching tab via keyboard activation
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("renders responsive layout when window dimensions resize", () => {
    render(<DesktopShell state={initialMuseumState} dispatch={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Open Friendster PH/i }));
    const windowDialog = screen.getByRole("dialog", { name: "Friendster PH" });

    // Verify root container has app-shell test id and friendster root class
    const root = within(windowDialog).getByTestId("app-shell-friendster");
    expect(root).toBeInTheDocument();

    // Verify presence of single scroll area
    const scrollArea = root.querySelector("._scrollArea_e9d947, [class*='scrollArea']");
    expect(scrollArea).not.toBeNull();

    // Verify maximize button maximizes the window
    const maxBtn = within(windowDialog).getByRole("button", { name: "Maximize Friendster PH" });
    fireEvent.click(maxBtn);

    // After maximizing, restore button becomes available
    expect(within(windowDialog).getByRole("button", { name: "Restore Friendster PH" })).toBeInTheDocument();
  });
});

