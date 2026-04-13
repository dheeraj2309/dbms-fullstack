import { email, z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Invalid Email'),
  password: z.string().min(6, 'Password must be alteast 6 characters long'),
});

export const StudentFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  course: z.string().min(1, 'Course is required'),
  branch: z.string().optional(),
  year: z.string().optional(),
  address: z.string().min(1, 'Address is mandatory'),
  phoneNumber: z.string().optional(),
  cgpa: z.coerce.number().min(0).max(10, 'CGPA is invalid'),
});

export const OtpSchema = z.object({
  otp: z.string().min(6).regex(/^\d+$/, 'OTP must be numeric'),
});
// we would have to define these expected data defintions, to actually tell typescript and when the actual data comes
// these lines bridges these two worlds, typescript can refer to the zod data definitons to validate what is being written
export type loginFormValues = z.infer<typeof LoginSchema>;
export type StudentFormValues = z.infer<typeof StudentFormSchema>;
