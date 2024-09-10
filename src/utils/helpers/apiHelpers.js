export function validateItemData(data) {
  let errors = {};
  if (!data.name || typeof data.name !== "string") {
    errors.name = "Name is required";
  }
  if (!data.description || typeof data.description !== "string") {
    errors.description = "Description is required";
  }
  if (!data.quantity || typeof data.quantity !== "number") {
    errors.quantity = "Quantity is required";
  }
  if (!data.category || typeof data.category !== "string") {
    errors.category = "Category is required";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}

export function object404Respsonse(response, model = "") {
  return response.json(
    {
      message: `${model} not found`,
    },
    {
      status: 404,
    }
  );
}

export async function validateJSONData(req) {
  let body;
  try {
    // parse incoming data to json
    body = await req.json();
    return [false, body];
  } catch (error) {
    return [true, null];
  }
}

export async function validateUserData(data) {
  let errors = {};
  if (!data.name || typeof data.name !== "string") {
    errors.name = "Name is required";
  }
  if (!data.email || typeof data.email !== "string") {
    errors.email = "Email is required";
  }
  if (!data.password || typeof data.password !== "string") {
    errors.password = "Quantity is required";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return [hasErrors, errors];
}
