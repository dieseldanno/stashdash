import { NextResponse } from "next/server";
import { validateItemData } from "@/utils/helpers/apiHelpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get item
export async function GET(req) {
  const url = new URL(req.url);
  const categories = url.searchParams.get("category");
  const inStock = url.searchParams.get("inStock"); // true or false statement

  let filter = {};

  console.log("Categories:", categories);
  console.log("In Stock:", inStock);

  // filter category
  if (categories) {
    const categoriesArray = categories.split(",");
    filter.category = {
      in: categoriesArray,
      mode: "insensitive",
    };
  }

  // filter in stock
  if (inStock !== null) {
    filter.quantity = inStock === "true" ? { gt: 0 } : 0; // greater than 0 in stock, 0 out of stock
    console.log("Filter by Stock Status:", filter.quantity);
  }

  let items;
  try {
    items = await prisma.item.findMany({
      where: filter,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch item" },
      { status: 500 }
    );
  }

  return NextResponse.json(items);
}

//post item
export async function POST(req) {
  let body;
  try {
    body = await req.json();
    console.log("Incoming request body:", body); // Add this to log the incoming data
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
