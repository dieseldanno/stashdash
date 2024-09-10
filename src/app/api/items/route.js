import { NextResponse } from "next/server";
import { validateItemData } from "@/utils/helpers/apiHelpers";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get item
export async function GET(req) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  let items = [];

  if (search) {
    items = await prisma.item.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
  } else {
    items = await prisma.item.findMany();
  }

  return NextResponse.json(items);
}

//post item
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        message: "A valid JSON object has to be sent",
      },
      {
        status: 400,
      }
    );
  }

  //   const userId = req.headers.get("userId");
  //   console.log("User ", userId, " making the request");

  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    return NextResponse.json(
      {
        message: errors,
      },
      {
        status: 400,
      }
    );
  }

  let newItem;
  try {
    newItem = await prisma.item.create({
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        category: body.category,
      },
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "Invalid data sent for item creation",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(newItem, {
    status: 201,
  });
}
