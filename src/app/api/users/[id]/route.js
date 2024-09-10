import { NextResponse } from "next/server";
import { object404Respsonse } from "@/utils/helpers/apiHelpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, options) {
  const { id } = options.params;
  const userId = req.headers.get("userId");

  try {
    if (id != userId) {
      throw new Error();
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(userId),
      },
    });
    console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    console.log("user", userId, error);
    return object404Respsonse(NextResponse, "User");
  }
}
