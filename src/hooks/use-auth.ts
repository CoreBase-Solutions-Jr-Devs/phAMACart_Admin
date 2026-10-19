import { useEffect } from "react";

import {
  notificationReceived,
} from "@/features/notifications/notificationSlice";

import {
  RootState,
  store,
} from "@/app/store";

import {
  useGetCurrentUserQuery,
} from "@/features/auth/authAPI";

import { useSelector } from "react-redux";

import notificationHub from "@/features/notifications/notificationHub";

const useAuth = () => {
  const {
    isAuthenticated,
    isInitialized,
    refreshToken,
  } = useSelector(
    (state: RootState) =>
      state.auth,
  );

  const currentTenant =
    useSelector(
      (state: RootState) =>
        state.tenant.currentTenant,
    );

  /**
   * IMPORTANT:
   *
   * Do NOT skip the request just because
   * isAuthenticated is false.
   *
   * If a refresh token exists, we need to make
   * a request so baseQueryWithReauth can refresh
   * the expired access token.
   */
  const shouldInitialize =
    !isInitialized &&
    !!refreshToken;

  const query =
    useGetCurrentUserQuery(
      undefined,
      {
        skip:
          !isAuthenticated &&
          !shouldInitialize,

        refetchOnMountOrArgChange:
          true,
      },
    );

  /**
   * Notification SignalR connection.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      notificationHub.stop();
      return;
    }

    /**
     * Wait for tenant resolution.
     */
    if (!currentTenant?.id) {
      return;
    }

    const handleNotification = (
      notification: any,
    ) => {
      store.dispatch(
        notificationReceived(
          notification,
        ),
      );
    };

    const connect = async () => {
      try {
        await notificationHub.start();

        notificationHub.onNotification(
          handleNotification,
        );
      } catch (error) {
        console.error(
          "Failed to connect notification hub:",
          error,
        );
      }
    };

    connect();

    return () => {
      notificationHub.offNotification(
        handleNotification,
      );

      notificationHub.stop();
    };
  }, [
    isAuthenticated,
    currentTenant?.id,
  ]);

  return query;
};

export default useAuth;