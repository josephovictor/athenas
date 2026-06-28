"use server";

import { prisma } from "@/lib/prisma";

export async function getCoordinator() {
  return prisma.coordinator.findFirst({
    include: { user: true },
  });
}
