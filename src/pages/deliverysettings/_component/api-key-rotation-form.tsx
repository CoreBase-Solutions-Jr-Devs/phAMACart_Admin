// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "sonner";
// import { Eye, EyeOff, KeyRound } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import { parseError } from "@/lib/parse-error";
// import { useRotateDeliveryApiKeyMutation } from "@/features/deliverysettings/deliverySettingsAPI";

// const schema = z.object({
//   apiKey: z
//     .string()
//     .min(20, "API key looks too short to be a Google Maps key."),
// });

// type FormValues = z.infer<typeof schema>;

// interface Props {
//   apiKeyLast4?: string | null;
// }

// const ApiKeyRotationForm = ({ apiKeyLast4 }: Props) => {
//   const [show, setShow] = useState(false);
//   const [rotateApiKey, { isLoading }] = useRotateDeliveryApiKeyMutation();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isValid, isDirty },
//   } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     mode: "onChange",
//     defaultValues: { apiKey: "" },
//   });

//   const onSubmit = async (data: FormValues) => {
//     try {
//       await rotateApiKey({ apiKey: data.apiKey }).unwrap();
//       toast.success("API key rotated.");
//       reset({ apiKey: "" });
//       setShow(false);
//     } catch (err) {
//       toast.error(parseError(err));
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2">
//         <KeyRound className="h-4 w-4 text-muted-foreground" />
//         <h3 className="text-sm font-semibold">Google Maps API Key</h3>
//       </div>

//       <p className="text-xs text-muted-foreground">
//         Current key:{" "}
//         {apiKeyLast4 ? (
//           <span className="font-mono">•••• {apiKeyLast4}</span>
//         ) : (
//           <span className="italic">none configured</span>
//         )}
//       </p>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//         <div className="space-y-1.5">
//           <label className="text-xs font-medium text-muted-foreground">
//             New API key
//           </label>

//           <div className="relative">
//             <Input
//               type={show ? "text" : "password"}
//               placeholder="AIza..."
//               autoComplete="off"
//               {...register("apiKey")}
//               className="pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShow((s) => !s)}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//               aria-label={show ? "Hide key" : "Show key"}
//             >
//               {show ? (
//                 <EyeOff className="h-4 w-4" />
//               ) : (
//                 <Eye className="h-4 w-4" />
//               )}
//             </button>
//           </div>

//           {errors.apiKey && (
//             <p className="text-xs text-red-500">{errors.apiKey.message}</p>
//           )}
//         </div>

//         <div className="flex justify-stretch sm:justify-end">
//           <Button
//             type="submit"
//             size="sm"
//             variant="outline"
//             disabled={!isDirty || !isValid || isLoading}
//             className="w-full sm:w-auto"
//           >
//             {isLoading ? "Rotating..." : "Rotate key"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ApiKeyRotationForm;