import { Doc } from "./_generated/dataModel";

export type League =
  | "NFL"
  | "NBA"
  | "MLB"
  | "NHL"
  | "COLLEGE-FOOTBALL"
  | "MBB"
  | "WBB"
  | "WNBA"
  | "MLS"
  | "PLL"
  | "NWSL"
  | "NBAS"
  | "EPL"
  | "RPL"
  | "ARG"
  | "TUR"
  | "CSL"
  | "NBAG"
  | "FRIENDLY"
  | "UFL"
  | "PGA";

declare module "*.json" {
  const value: any;
  export default value;
}
