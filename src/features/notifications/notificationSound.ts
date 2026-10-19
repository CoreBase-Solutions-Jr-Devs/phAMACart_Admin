import notificationMp3 from "@/assets/sounds/info.mp3";

const audio = new Audio(notificationMp3);

export const playNotificationSound = () => {
  audio.currentTime = 0;
  audio.play().catch((err) => {
    // Browsers block autoplay until the user has interacted with the page
    console.warn("Notification sound blocked:", err);
  });
};