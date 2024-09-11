export function validateItemData(data) {
  let errors = {};
  if (!data.name) {
    errors.name = "Name is required";
  }
  if (!data.description) {
    errors.description = "Description is required";
  }
  if (data.quantity === undefined || data.quantity === null) {
    errors.quantity = "Quantity is required";
  } else if (data.quantity < 0) {
    errors.quantity = "Quantity must be more than 0";
  }
  if (!data.category) {
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
  if (!data.name) {
    errors.name = "Name is required";
  }
  if (!data.email) {
    errors.email = "Email is required";
  }
  if (!data.password) {
    errors.password = "Password is required";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return { hasErrors, errors };
}
