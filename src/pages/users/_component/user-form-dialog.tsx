import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  useGetUserByIdQuery,
  useGetRolesQuery,
  useUpdateUserMutation,
} from "@/features/users/usersAPI";

import { User } from "@/features/users/usersType";
import { parseError } from "@/lib/parse-error";

/* =========================
   SCHEMA
========================= */

const schema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  roleIds: z.array(z.string()),
  forcePasswordChange: z.boolean(),
  accessFromAnyNetwork: z.boolean(),
  expiryDate: z.string(),
  emailConfirmationRequired: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* =========================
   HELPERS
========================= */

const toDateInputValue = (date?: string | null) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

/* =========================
   COMPONENT
========================= */

export const UserFormDialog = ({
  user,
  open,
  onOpenChange,
}: Props) => {
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateUserMutation();

  /*
   * Fetch the fresh user whenever the dialog is opened.
   */
  const {
    data: userData,
    isFetching,
  } = useGetUserByIdQuery(user?.id ?? "", {
    skip: !open || !user?.id,
  });

  const freshUser = userData?.user;

  /*
   * Roles
   */
  const {
    data: rolesResponse,
    isLoading: rolesLoading,
  } = useGetRolesQuery(
    {
      pageIndex: 0,
      pageSize: 100,
    },
    {
      skip: !open,
    }
  );

  const roles = rolesResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "",
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      roleIds: [],
      forcePasswordChange: true,
      accessFromAnyNetwork: false,
      expiryDate: "",
      emailConfirmationRequired: true,
    },
  });

  const selectedRoleIds = watch("roleIds");

  /* =========================
     FILL FORM
  ========================= */

  const fillForm = (source: User) => {
    reset({
      userName: source.userName ?? "",
      email: source.email ?? "",
      phoneNumber: source.phoneNumber ?? "",
      firstName: source.firstName ?? "",
      lastName: source.lastName ?? "",
      dateOfBirth: toDateInputValue(source.dateOfBirth),
      roleIds: source.roleIds ?? [],

      forcePasswordChange: source.forcePasswordChange ?? false,
      accessFromAnyNetwork: source.accessFromAnyNetwork ?? false,
      expiryDate: toDateInputValue(source.expiryDate),
      // Not editable after creation; kept so the shared schema validates.
      emailConfirmationRequired: false,
    });
  };

  /*
   * Initial user from the table.
   */
  useEffect(() => {
    if (open && user) {
      fillForm(user);
    }
  }, [open, user]);

  /*
   * Replace the table user with the fresh GET-by-ID result.
   */
  useEffect(() => {
    if (open && freshUser) {
      fillForm(freshUser);
    }
  }, [open, freshUser]);

  /* =========================
     ROLE TOGGLE
  ========================= */

  const handleRoleChange = (
    roleId: string,
    checked: boolean
  ) => {
    const current = selectedRoleIds ?? [];

    if (checked) {
      setValue(
        "roleIds",
        [...current, roleId],
        { shouldValidate: true }
      );
    } else {
      setValue(
        "roleIds",
        current.filter((id) => id !== roleId),
        { shouldValidate: true }
      );
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) return;

    try {
      await updateUser({
        id: user.id,
        body: {
          userName: data.userName.trim(),
          email: data.email.trim(),
          phoneNumber: data.phoneNumber.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),

          // Omitted fields are left unchanged on the server.
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString()
            : undefined,

          roleIds: data.roleIds,

          forcePasswordChange: data.forcePasswordChange,
          accessFromAnyNetwork: data.accessFromAnyNetwork,

          // An unchanged expiry date is not re-sent (the server rejects past dates).
          ...(data.expiryDate
            ? data.expiryDate !==
              toDateInputValue(freshUser?.expiryDate ?? user.expiryDate)
              ? { expiryDate: new Date(`${data.expiryDate}T23:59:59`).toISOString() }
              : {}
            : { clearExpiryDate: true }),
        },
      }).unwrap();

      toast.success("User updated successfully.");

      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 relative"
        >
          {isFetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              Loading user...
            </div>
          )}

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Input
                placeholder="First Name"
                {...register("firstName")}
              />

              {errors.firstName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Last Name"
                {...register("lastName")}
              />

              {errors.lastName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Username"
                {...register("userName")}
              />

              {errors.userName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Phone Number"
                {...register("phoneNumber")}
              />

              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="date"
                {...register("dateOfBirth")}
              />

              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>

          {/* =========================
              ROLES
          ========================= */}

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Roles
              </h3>

              <p className="text-sm text-muted-foreground">
                Select the roles assigned to this user.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-md border p-4 md:grid-cols-2">
              {rolesLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading roles...
                </p>
              ) : roles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No roles available.
                </p>
              ) : (
                roles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(
                          role.id,
                          checked === true
                        )
                      }
                    />

                    <span className="text-sm">
                      {role.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* =========================
              ACCESS SETTINGS
          ========================= */}

          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              Access Settings
            </h3>

            <label className="flex items-center gap-2">
              <Checkbox
                checked={watch("forcePasswordChange")}
                onCheckedChange={(checked) =>
                  setValue(
                    "forcePasswordChange",
                    checked === true
                  )
                }
              />

              <span className="text-sm">
                Force password change
              </span>
            </label>

            <label className="flex items-center gap-2">
              <Checkbox
                checked={watch("accessFromAnyNetwork")}
                onCheckedChange={(checked) =>
                  setValue(
                    "accessFromAnyNetwork",
                    checked === true
                  )
                }
              />

              <span className="text-sm">
                Allow access from any network
              </span>
            </label>

            {freshUser && (
              <p className="text-xs text-muted-foreground">
                Email{" "}
                {freshUser.emailConfirmed ? "confirmed" : "not confirmed yet"}
                {freshUser.isLockedOut &&
                  " · locked after failed sign-ins (unlock it from the users list)"}
              </p>
            )}
          </div>

          {/* =========================
              EXPIRY
          ========================= */}

          <div>
            <Input
              type="date"
              {...register("expiryDate")}
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Account expiry date (optional)
            </p>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isUpdating ||
                isFetching ||
                rolesLoading
              }
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};