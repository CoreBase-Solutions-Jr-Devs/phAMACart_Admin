import { Mail, UserIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useTypedSelector } from "@/app/hook";

const Account = () => {
  const { user } = useTypedSelector(
    (store) => store.auth,
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div>
          <h3 className="text-base font-semibold">
            Account
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            View your account information and security details.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="account-name">
              Name
            </Label>

            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="account-name"
                value={user?.unique_name || "Unknown"}
                readOnly
                className="pl-9"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="account-email">
              Email address
            </Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="account-email"
                value={user?.email || "Unknown"}
                readOnly
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Account;