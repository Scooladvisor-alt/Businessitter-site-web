"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();
const getServerYear = () => null;

/** Année courante, calculée dans le navigateur (jamais figée au moment du build). */
export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getYear, getServerYear);
  return year ? <>{year} </> : null;
}
