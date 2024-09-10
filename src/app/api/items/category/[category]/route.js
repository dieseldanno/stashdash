import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, options) {
  const url = new URL(req.url);
  const { category } = options.params;
  const search = url.searchParams.get("search");
  let items = [];
  if (search) {
    items = await prisma.item.findMany({
      where: {
        category: {
          equals: category,
          mode: "insensitive",
        },
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  } else {
    items = await prisma.item.findMany({
      where: {
        category: {
          equals: category,
          mode: "insensitive",
        },
      },
    });
  }

  return NextResponse.json(items);
}
