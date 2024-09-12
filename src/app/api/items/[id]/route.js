import { NextResponse } from "next/server";
import {
  object404Respsonse,
  validateItemData,
} from "@/utils/helpers/apiHelpers";
import { verifyJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, options) {
  const id = options.params.id;

  try {
    const item = await prisma.item.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return object404Respsonse(NextResponse, "Item");
  }
}

// update item
export async function PUT(req, options) {
  const id = options.params.id;

  // get token
  const token = req.headers.get("authorization")?.split(" ")[1]; // split from bearer and just get token

  // verify token
  try {
    const verifyToken = await verifyJWT(token);
    if (!verifyToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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

  try {
    const updatedItem = await prisma.item.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        category: body.category,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// delete item
export async function DELETE(req, options) {
  const id = options.params.id;

  // get token
  const token = req.headers.get("authorization")?.split(" ")[1];

  // verify token
  try {
    const verifyToken = await verifyJWT(token);
    if (!verifyToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return object404Respsonse(NextResponse, "Item");
  }
}
