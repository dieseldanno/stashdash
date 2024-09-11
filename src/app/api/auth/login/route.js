import { NextResponse } from "next/server";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  let body;
  try {
    body = await req.json();
    console.log(body);
    if (!body.email || !body.password) {
      throw new Error("Email and password has to be provided");
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "A valid new user object with email and password has to be provided",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    // compare passwords with bcrypt (secure way)
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!user || !isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid login credentials",
        },
        {
          status: 400,
        }
      );
    }

    const token = await signJWT({
      userId: user.id,
    });

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong, try again",
      },
      {
        status: 400,
      }
    );
  }
}
