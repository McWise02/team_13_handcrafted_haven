'use server'; 

import { RegisterState } from "../definitions/form-states";
import { registerSchema } from "../validation/auth";
import bcrypt from "bcrypt";
import { createUser } from "../data/auth";
import { EmailAlreadyExistsError} from "../definitions/errors";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { redirect } from "next/navigation";


export async function registerUser(
  
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  
  const rawData = {
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
    confirmPassword: String(formData.get('confirmPassword') || ''),
    firstName: String(formData.get('firstName')),
    lastName: String(formData.get('lastName'))
  };

  const parsed = await registerSchema.safeParseAsync(rawData);

  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();

    return {
      message: 'Please fix the errors below.',
      errors: {
        ...fieldErrors,
        _form: formErrors.length ? formErrors : undefined,
      },
    };
  }

  const data = parsed.data;

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    await createUser({
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    return {
      message: 'Account created successfully!',
      errors: {},
    };
    
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return {
        message: 'There were problems with your submission.',
        errors: {
          email: ['An account with this email already exists.'],
        },
      };
    }

    console.error('Error creating user:', err);
    return {
      message: 'Something went wrong while creating your account.',
      errors: {
        _form: ['Unexpected error. Please try again later.'],
      },
    };
  }
  
}




export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  // Your authentication logic here (copied from original file)
  try {
    await signIn('credentials', formData);
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }

  
}
