import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPacifictime(date?: Date | string | number) {
  if (!date) {
    date = new Date();
  }
  let america_datetime_str = new Date(date).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  let date_america = new Date(america_datetime_str);
  let year = date_america.getFullYear();
  let month = ("0" + (date_america.getMonth() + 1)).slice(-2);
  let day = ("0" + date_america.getDate()).slice(-2);

  return {
    url: `${year}${month}${day}`,
    redis: `${month}/${day}/${year}`,
  };
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
