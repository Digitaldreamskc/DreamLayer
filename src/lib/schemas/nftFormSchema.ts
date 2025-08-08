import * as z from "zod";

export const nftFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  dynamic: z.boolean().default(true),
  attributes: z.number().min(1).max(10),
  chain: z.enum(["solana", "base"]),
});

export type NFTFormData = z.infer<typeof nftFormSchema>;
