"use client";
import {useEffect} from "react";
export function ServiceWorker(){useEffect(()=>{navigator.serviceWorker?.register("/sw.js");},[]);return null;}
