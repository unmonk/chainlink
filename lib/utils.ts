import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }
  await navigator.serviceWorker.register("/serviceWorker.js");
}

export async function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }
  return navigator.serviceWorker.ready;
}
