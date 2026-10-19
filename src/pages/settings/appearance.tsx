"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTheme } from "@/context/theme-provider";

const Appearance = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div>
          <h3 className="text-base font-semibold">
            Appearance
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Customize how the application looks. Choose a theme
            or let your system preference control it automatically.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Theme
          </Label>

          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {/* Light */}
            <div>
              <RadioGroupItem
                value="light"
                id="light"
                className="peer sr-only"
              />

              <Label
                htmlFor="light"
                className="
                  flex cursor-pointer flex-col items-center
                  justify-center gap-3 rounded-xl border
                  bg-background p-5 text-sm font-medium
                  transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-accent
                "
              >
                <Sun className="size-6" />
                <span>Light</span>
              </Label>
            </div>

            {/* Dark */}
            <div>
              <RadioGroupItem
                value="dark"
                id="dark"
                className="peer sr-only"
              />

              <Label
                htmlFor="dark"
                className="
                  flex cursor-pointer flex-col items-center
                  justify-center gap-3 rounded-xl border
                  bg-background p-5 text-sm font-medium
                  transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-accent
                "
              >
                <Moon className="size-6" />
                <span>Dark</span>
              </Label>
            </div>

            {/* System */}
            <div>
              <RadioGroupItem
                value="system"
                id="system"
                className="peer sr-only"
              />

              <Label
                htmlFor="system"
                className="
                  flex cursor-pointer flex-col items-center
                  justify-center gap-3 rounded-xl border
                  bg-background p-5 text-sm font-medium
                  transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-accent
                "
              >
                <Monitor className="size-6" />
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default Appearance;