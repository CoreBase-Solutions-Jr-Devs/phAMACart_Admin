import { useMemo, useState } from "react";

import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useCreateUserMutation,
  useGetRolesQuery,
} from "@/features/users/usersAPI";

import { User } from "@/features/users/usersType";

interface Props {
  children: React.ReactNode;
  onUserCreated?: (user: User) => void;
}

const initialForm = {
  userName: "",
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  temporaryPassword: "",
  dateOfBirth: "",
  roleIds: [] as string[],
  forcePasswordChange: true,
  accessFromAnyNetwork: false,
  expiryDate: "",
  emailConfirmationRequired: true,
};

const CreateUserFormDialog = ({
  children,
  onUserCreated,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createUser, { isLoading: isCreatingUser }] =
    useCreateUserMutation();

  const {
    data: rolesResponse,
    isLoading: rolesLoading,
  } = useGetRolesQuery({
    pageIndex: 0,
    pageSize: 20,
  });

  const roles = rolesResponse?.data ?? [];

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedRoles = useMemo(
    () => new Set(form.roleIds),
    [form.roleIds]
  );

  /* =========================
     FIELD UPDATE
  ========================= */

  const updateField = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  /* =========================
     ROLE TOGGLE
  ========================= */

  const toggleRole = (roleId: string) => {
    setForm((current) => {
      const exists = current.roleIds.includes(roleId);

      return {
        ...current,
        roleIds: exists
          ? current.roleIds.filter((id) => id !== roleId)
          : [...current.roleIds, roleId],
      };
    });

    setErrors((current) => {
      const next = { ...current };
      delete next.roleIds;
      return next;
    });
  };

  /* =========================
     RESET
  ========================= */

  const resetForm = () => {
    setForm({
      ...initialForm,
      roleIds: [],
    });

    setErrors({});
    setShowPassword(false);
  };

  /* =========================
     DIALOG
  ========================= */

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open && !isCreatingUser) {
      resetForm();
    }
  };

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {
    const validationErrors: Record<string, string> = {};

    if (!form.userName.trim()) {
      validationErrors.userName = "Username is required";
    }

    if (!form.email.trim()) {
      validationErrors.email = "Email address is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      validationErrors.email = "Invalid email address";
    }

    if (!form.phoneNumber.trim()) {
      validationErrors.phoneNumber =
        "Phone number is required";
    }

    if (!form.firstName.trim()) {
      validationErrors.firstName =
        "First name is required";
    }

    if (!form.lastName.trim()) {
      validationErrors.lastName =
        "Last name is required";
    }

    if (!form.temporaryPassword) {
      validationErrors.temporaryPassword =
        "Temporary password is required";
    } else if (form.temporaryPassword.length < 8) {
      validationErrors.temporaryPassword =
        "Password must be at least 8 characters";
    }

    if (!form.roleIds.length) {
      validationErrors.roleIds =
        "At least one role is required";
    }

    if (form.expiryDate) {
      const expiry = new Date(form.expiryDate);

      if (expiry <= new Date()) {
        validationErrors.expiryDate =
          "Expiry date must be in the future";
      }
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!validate()) {
      toast.error(
        "Please correct the highlighted fields."
      );

      return;
    }

    try {
      const result = await createUser({
        userName: form.userName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        temporaryPassword: form.temporaryPassword,

        dateOfBirth: form.dateOfBirth
          ? new Date(
              form.dateOfBirth
            ).toISOString()
          : new Date(0).toISOString(),

        roleIds: form.roleIds,

        forcePasswordChange:
          form.forcePasswordChange,

        accessFromAnyNetwork:
          form.accessFromAnyNetwork,

        expiryDate: form.expiryDate
          ? new Date(
              form.expiryDate
            ).toISOString()
          : null,

        emailConfirmationRequired:
          form.emailConfirmationRequired,
      }).unwrap();

      toast.success(
        "User created successfully."
      );

      /*
       * Notify UsersTable about the newly
       * created user.
       */
      if (result?.user) {
        onUserCreated?.(result.user);
      }

      /*
       * Close create dialog.
       */
      setIsOpen(false);

      /*
       * Reset create form.
       */
      resetForm();
    } catch (error: any) {
      const problem = error?.data;

      if (problem?.errors) {
        const backendErrors: Record<
          string,
          string
        > = {};

        Object.entries(problem.errors).forEach(
          ([field, messages]) => {
            backendErrors[field] =
              Array.isArray(messages)
                ? messages.join(", ")
                : String(messages);
          }
        );

        setErrors(backendErrors);
      }

      toast.error(
        problem?.detail ||
          problem?.title ||
          "Failed to create user."
      );
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent
        className="
          w-[95vw]
          max-w-5xl
          p-7
          sm:max-w-5xl
          max-h-[90vh]
          overflow-y-auto
        "
        aria-describedby={undefined}
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl">
            Create User
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                Basic Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* First Name */}

              <div className="space-y-1.5">
                <Label htmlFor="firstName">
                  First Name
                </Label>

                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    updateField(
                      "firstName",
                      e.target.value
                    )
                  }
                  placeholder="John"
                />

                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}

              <div className="space-y-1.5">
                <Label htmlFor="lastName">
                  Last Name
                </Label>

                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    updateField(
                      "lastName",
                      e.target.value
                    )
                  }
                  placeholder="Doe"
                />

                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Username */}

              <div className="space-y-1.5">
                <Label htmlFor="userName">
                  Username
                </Label>

                <Input
                  id="userName"
                  value={form.userName}
                  onChange={(e) =>
                    updateField(
                      "userName",
                      e.target.value
                    )
                  }
                  placeholder="john.doe"
                />

                {errors.userName && (
                  <p className="text-xs text-destructive">
                    {errors.userName}
                  </p>
                )}
              </div>

              {/* Email */}

              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="john@example.com"
                />

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}

              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">
                  Phone Number
                </Label>

                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    updateField(
                      "phoneNumber",
                      e.target.value
                    )
                  }
                  placeholder="+254712345678"
                />

                {errors.phoneNumber && (
                  <p className="text-xs text-destructive">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Date of Birth */}

              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth">
                  Date of Birth
                </Label>

                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    updateField(
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                />

                {errors.dateOfBirth && (
                  <p className="text-xs text-destructive">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* =========================
              PASSWORD + ROLES
          ========================= */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* PASSWORD */}

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Initial Password
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="temporaryPassword">
                    Temporary Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="temporaryPassword"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        form.temporaryPassword
                      }
                      onChange={(e) =>
                        updateField(
                          "temporaryPassword",
                          e.target.value
                        )
                      }
                      placeholder="Enter temporary password"
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                      "
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters.
                  </p>

                  {errors.temporaryPassword && (
                    <p className="text-xs text-destructive">
                      {errors.temporaryPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="forcePasswordChange"
                    checked={
                      form.forcePasswordChange
                    }
                    onCheckedChange={(checked) =>
                      updateField(
                        "forcePasswordChange",
                        checked === true
                      )
                    }
                  />

                  <Label
                    htmlFor="forcePasswordChange"
                    className="cursor-pointer"
                  >
                    Force password change on first
                    login
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* ROLES */}

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Roles
                </CardTitle>
              </CardHeader>

              <CardContent>
                {rolesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading roles...
                  </div>
                ) : roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No roles are available.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-md
                          border
                          p-3
                          transition-colors
                          hover:bg-muted/40
                        "
                      >
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles.has(
                            role.id
                          )}
                          onCheckedChange={() =>
                            toggleRole(role.id)
                          }
                        />

                        <Label
                          htmlFor={`role-${role.id}`}
                          className="cursor-pointer text-sm"
                        >
                          {role.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {errors.roleIds && (
                  <p className="mt-3 text-xs text-destructive">
                    {errors.roleIds}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* =========================
              ACCESS CONFIGURATION
          ========================= */}

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                Access Configuration
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Any Network */}

              <div className="flex items-start gap-3">
                <Checkbox
                  id="accessFromAnyNetwork"
                  checked={
                    form.accessFromAnyNetwork
                  }
                  onCheckedChange={(checked) =>
                    updateField(
                      "accessFromAnyNetwork",
                      checked === true
                    )
                  }
                />

                <div className="space-y-1">
                  <Label
                    htmlFor="accessFromAnyNetwork"
                    className="cursor-pointer"
                  >
                    Any network
                  </Label>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Allow authentication from any
                    network.
                  </p>
                </div>
              </div>

              {/* Email Confirmation */}

              <div className="flex items-start gap-3">
                <Checkbox
                  id="emailConfirmationRequired"
                  checked={
                    form.emailConfirmationRequired
                  }
                  onCheckedChange={(checked) =>
                    updateField(
                      "emailConfirmationRequired",
                      checked === true
                    )
                  }
                />

                <div className="space-y-1">
                  <Label
                    htmlFor="emailConfirmationRequired"
                    className="cursor-pointer"
                  >
                    Email confirmation
                  </Label>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Require email confirmation.
                  </p>
                </div>
              </div>

              {/* Account Expiry */}

              <div className="space-y-1.5">
                <Label htmlFor="expiryDate">
                  Account Expiry
                </Label>

                <Input
                  id="expiryDate"
                  type="datetime-local"
                  value={form.expiryDate}
                  onChange={(e) =>
                    updateField(
                      "expiryDate",
                      e.target.value
                    )
                  }
                />

                {errors.expiryDate && (
                  <p className="text-xs text-destructive">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreatingUser}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isCreatingUser ||
                rolesLoading
              }
            >
              {isCreatingUser && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {isCreatingUser
                ? "Creating User..."
                : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateUserFormDialog };
