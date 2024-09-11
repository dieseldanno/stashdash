import { NextResponse } from "next/server";
import { validateUserData } from "@/utils/helpers/apiHelpers";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

  // validate user data
  try {
    const { hasErrors, errors } = validateUserData(body);
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

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashed,
        name: body.name,
      },
    });

    console.log("User registered: ", user);

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
