import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

import { store } from "@/app/store";
import { playNotificationSound } from "@/features/notifications/notificationSound";

class NotificationHub {
  private connection?: HubConnection;

  async start() {
    if (this.connection) {
      if (
        this.connection.state ===
        HubConnectionState.Connected
      ) {
        return;
      }

      await this.connection.start();
      return;
    }

    const tenantId =
      store.getState().tenant.currentTenant?.id;

    if (!tenantId) {
      console.warn(
        "Cannot start notification hub: tenant not initialized.",
      );

      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(
        `${import.meta.env.VITE_API_BASE_URL}/hubs/notifications`,
        {
          accessTokenFactory: () =>
            store.getState().auth.accessToken ?? "",

          headers: {
            "X-Tenant-Id": tenantId,
          },
        },
      )
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.onreconnecting((error) => {
      console.warn(
        "Notification hub reconnecting",
        error,
      );
    });

    this.connection.onreconnected(() => {
      console.log(
        "Notification hub reconnected",
      );
    });

    this.connection.onclose((error) => {
      console.warn(
        "Notification hub closed",
        error,
      );
    });

    this.connection.on(
      "notificationReceived",
      () => {
        playNotificationSound();
      },
    );

    await this.connection.start();

    console.log(
      "Notification hub connected",
    );
  }

  stop() {
    const connection = this.connection;

    this.connection = undefined;

    return connection?.stop();
  }

  onNotification(
    handler: (data: any) => void,
  ) {
    if (!this.connection) {
      console.warn(
        "Cannot subscribe. Notification hub not started.",
      );

      return;
    }

    this.connection.on(
      "notificationReceived",
      handler,
    );
  }

  offNotification(
    handler?: (data: any) => void,
  ) {
    if (!this.connection) {
      return;
    }

    if (handler) {
      this.connection.off(
        "notificationReceived",
        handler,
      );
    } else {
      this.connection.off(
        "notificationReceived",
      );
    }
  }
}

export default new NotificationHub();