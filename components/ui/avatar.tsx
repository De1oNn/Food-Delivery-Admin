"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

function Avatar({
  className = "", // Default to empty string if no className provided
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={`relative flex size-8 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  );
}

function AvatarImage({
  className = "",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={`aspect-square size-full ${className}`}
      {...props}
    />
  );
}

function AvatarFallback({
  className = "",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={`bg-muted flex size-full items-center justify-center rounded-full ${className}`}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
