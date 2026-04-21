// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { PencilIcon, XIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import MultiFileUploader, {
//   UploadFileItem,
// } from "@/components/upload/MultiFileUploader";

// import { parseError } from "@/lib/parse-error";

// import {
//   useGetCompanyProfileQuery,
//   useUpdateCompanyProfileMutation,
// } from "@/features/companyProfile/companyProfileAPI";

// import {
//   companyProfileSchema,
//   type CompanyProfileFormValues,
// } from "@/features/companyProfile/schema";
// import type { CompanyProfile } from "@/features/companyProfile/companyProfileType";

// import { PhonesSection } from "@/pages/companyprofile/_component/phone-section";  
// import { EmailsSection } from "@/pages/companyprofile/_component/email-section";
// import { AddressesSection } from "@/pages/companyprofile/_component/addresses-section";
// import { GooglePlaceSection } from "@/pages/companyprofile/_component/google-place-section";

// /* =========================
//    HELPERS
// ========================= */
// const toDefaultValues = (
//   profile?: CompanyProfile
// ): CompanyProfileFormValues => ({
//   name: profile?.name ?? "",
//   logoUrl: profile?.logoUrl ?? "",
//   chatLink: profile?.chatLink ?? "",
//   phones: profile?.phones ?? [],
//   emails: profile?.emails ?? [],
//   addresses: profile?.addresses ?? [],
//   googlePlaceAddress: profile?.googlePlaceAddress ?? null,
// });

// /* =========================
//    COMPONENT
// ========================= */
// export const CompanyProfileForm = () => {
//   const [editMode, setEditMode] = useState(false);
//   const [logoFiles, setLogoFiles] = useState<UploadFileItem[]>([]);

//   const { data: profile, isFetching } = useGetCompanyProfileQuery();
//   const [updateProfile, { isLoading: isSaving }] =
//     useUpdateCompanyProfileMutation();

//   const methods = useForm<CompanyProfileFormValues>({
//     resolver: zodResolver(companyProfileSchema),
//     defaultValues: toDefaultValues(),
//   });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty },
//   } = methods;

//   /* Re-hydrate form whenever server data arrives / edit mode toggles */
//   useEffect(() => {
//     reset(toDefaultValues(profile));
//     setLogoFiles(
//       profile?.logoUrl
//         ? [{ id: "logo", file: null, preview: profile.logoUrl }]
//         : []
//     );
//   }, [profile, editMode, reset]);

//   const cancel = () => {
//     reset(toDefaultValues(profile));
//     setEditMode(false);
//   };

//   const onSubmit = async (data: CompanyProfileFormValues) => {
//     try {
//       const logoFile = logoFiles[0]?.file ?? undefined;

//       await updateProfile({
//         id: profile?.id ?? "",
//         ...data,
//         logoFile: logoFile ? [logoFile] : null,
//       }).unwrap();

//       toast.success("Company profile updated.");
//       setEditMode(false);
//     } catch (err) {
//       toast.error(parseError(err));
//     }
//   };

//   const readOnly = !editMode;

//   /* =========================
//      UI
//   ========================= */
//   if (isFetching && !profile) {
//     return (
//       <div className="py-16 flex items-center justify-center text-muted-foreground">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <FormProvider {...methods}>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-8 pb-24 relative"
//       >
//         {/* ===== Header / action bar ===== */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold">
//               {profile?.name ?? "Company profile"}
//             </h2>
//             {profile?.clientId != null && (
//               <p className="text-xs text-muted-foreground">
//                 Client ID: {profile.clientId}
//               </p>
//             )}
//           </div>

//           {!editMode ? (
//             <Button type="button" onClick={() => setEditMode(true)}>
//               <PencilIcon className="h-4 w-4" /> Edit
//             </Button>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={cancel}
//                 disabled={isSaving}
//               >
//                 <XIcon className="h-4 w-4" /> Cancel
//               </Button>
//               <Button type="submit" disabled={isSaving || !isDirty}>
//                 {isSaving ? "Saving..." : "Save changes"}
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===== Basic info ===== */}
//         <section className="space-y-3">
//           <h3 className="text-sm font-semibold">Basic info</h3>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label className="text-xs">Name</Label>
//               <Input disabled={readOnly} {...register("name")} />
//               {errors.name && (
//                 <p className="text-xs text-destructive">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Label className="text-xs">Chat link</Label>
//               <Input
//                 disabled={readOnly}
//                 placeholder="https://..."
//                 {...register("chatLink")}
//               />
//               {errors.chatLink && (
//                 <p className="text-xs text-destructive">
//                   {errors.chatLink.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs">Logo</Label>
//             <MultiFileUploader
//               value={logoFiles}
//               onChange={(f) => setLogoFiles(f.slice(0, 1))}
//               // If your uploader supports a disabled prop, pass `disabled={readOnly}`.
//             />
//           </div>
//         </section>

//         {/* ===== Contact ===== */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <PhonesSection readOnly={readOnly} />
//           <EmailsSection readOnly={readOnly} />
//         </div>

//         {/* ===== Addresses ===== */}
//         <AddressesSection readOnly={readOnly} />
//         <GooglePlaceSection readOnly={readOnly} />

//         {/* ===== Users (read-only summary) =====
//             Linking/unlinking users is typically a separate flow, so we just show
//             a summary here. Wire this up to a UsersManager component if needed. */}
//         {profile?.users && profile.users.length > 0 && (
//           <section className="space-y-2">
//             <h3 className="text-sm font-semibold">Linked users</h3>
//             <ul className="text-sm text-muted-foreground list-disc pl-5">
//               {profile.users.map((u) => (
//                 <li key={u.userId}>
//                   {u.userId} — <span className="font-medium">{u.role}</span>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}
//       </form>
//     </FormProvider>
//   );
// };