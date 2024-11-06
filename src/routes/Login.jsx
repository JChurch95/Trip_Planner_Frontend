import { Form, useActionData, Navigate, Link } from "react-router-dom";
import { z } from "zod";
import styles from "./Login.module.css";
import supabase from "../supabase";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid Email")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password Too Short"),
});

export const action = async ({ request }) => {
  const formData = await request.formData();
  const result = await LoginSchema.safeParseAsync({
    email: formData.get("username"),
    password: formData.get("password"),
  });

  if (!result.success) {
    console.error('Validation error:', result.error);
    return null;
  }

  const { email, password } = result.data;
  console.log("Login attempt for email:", email);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return null;
    }

    console.log("Login successful:", {
      user: data.user,
      session: data.session
    });

    // Store token in sessionStorage immediately after successful login
    if (data.session?.access_token) {
      sessionStorage.setItem("sb-access-token", data.session.access_token);
      console.log("Token stored in session storage:", data.session.access_token);
    }

    return data;
  } catch (error) {
    console.error("Unexpected login error:", error);
    return null;
  }
};

const Login = () => {
  const data = useActionData();

  if (!!data) {
    console.log("Redirecting after successful login");
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back! Please Sign In</h1>
      
      <div className={styles.formContainer}>
        <Form
          action="/login"
          method="post"
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>Your Email Address</span>
              <input
                className={styles.input}
                name="username"
                type="email"
                placeholder="you@supercoolhuman.com"
                autoComplete="email"
                required
              />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>Password</span>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="Enter password here"
                autoComplete="new-password"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className={styles.button}
          >
            Login
          </button>

          <div className={styles.registerPrompt}>
            <p>Don't have an account yet?</p>
            <Link to="/registration" className={styles.registerLink}>
              Create an account
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;