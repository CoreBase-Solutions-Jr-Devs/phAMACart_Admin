import { apiClient } from "@/app/api-client";
import notificationHub from "@/features/notifications/notificationHub";
import { notificationReceived } from "@/features/notifications/notificationSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useNotificationHub(
  enabled: boolean
) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) {
      notificationHub.stop();
      return;
    }

    notificationHub.start();

    notificationHub.onNotification(
      notification => {
        dispatch(
          notificationReceived(notification)
        );

        dispatch(
          apiClient.util.invalidateTags([
            "notifications",
          ])
        );
      }
    );

    return () => {
      notificationHub.offNotification();
    };
  }, [enabled, dispatch]);
}