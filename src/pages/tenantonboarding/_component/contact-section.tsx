import { Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PhoneEntry, EmailEntry } from "@/features/companyProfile/companyProfileType";

interface ContactSectionProps {
  phones: PhoneEntry[];
  emails: EmailEntry[];
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
  onUpdatePhone: (
    index: number,
    key: keyof PhoneEntry,
    value: string,
  ) => void;
  onSetPrimaryPhone: (index: number) => void;
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onUpdateEmail: (index: number, value: string) => void;
  onSetPrimaryEmail: (index: number) => void;
}

export function ContactSection({
  phones,
  emails,
  onAddPhone,
  onRemovePhone,
  onUpdatePhone,
  onSetPrimaryPhone,
  onAddEmail,
  onRemoveEmail,
  onUpdateEmail,
  onSetPrimaryEmail,
}: ContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Phone numbers and email addresses associated with the company.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Phones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Phone numbers</Label>
            <Button type="button" variant="outline" size="sm" onClick={onAddPhone}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          {phones.length === 0 && (
            <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
              No phone numbers added.
            </p>
          )}
          {phones.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <Input
                className="w-20"
                placeholder="KE"
                value={phone.countryCode}
                onChange={(event) =>
                  onUpdatePhone(index, "countryCode", event.target.value)
                }
              />
              <Input
                placeholder="+2547XXXXXXXX"
                value={phone.number}
                onChange={(event) =>
                  onUpdatePhone(index, "number", event.target.value)
                }
              />
              <Button
                type="button"
                variant={phone.isPrimary ? "default" : "ghost"}
                size="icon"
                onClick={() => onSetPrimaryPhone(index)}
                title="Set as primary"
                aria-label="Set as primary phone"
              >
                <Star className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemovePhone(index)}
                aria-label="Remove phone"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Emails */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Email addresses</Label>
            <Button type="button" variant="outline" size="sm" onClick={onAddEmail}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          {emails.length === 0 && (
            <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
              No email addresses added.
            </p>
          )}
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="email"
                placeholder="info@example.com"
                value={email.address}
                onChange={(event) => onUpdateEmail(index, event.target.value)}
              />
              <Button
                type="button"
                variant={email.isPrimary ? "default" : "ghost"}
                size="icon"
                onClick={() => onSetPrimaryEmail(index)}
                title="Set as primary"
                aria-label="Set as primary email"
              >
                <Star className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveEmail(index)}
                aria-label="Remove email"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}