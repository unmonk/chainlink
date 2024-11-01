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
  | "EPL"
  | "RPL"
  | "ARG"
  | "TUR"
  | "CSL"
  | "NBAG"
  | "FRIENDLY"
  | "UFL";

declare module "*.json" {
  const value: any;
  export default value;
}
