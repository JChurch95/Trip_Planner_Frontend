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
    console.error(result.error);
    return null;
  }

  const { email, password } = result.data;
  console.log("EMAIL AND PASSWORD: ", email, password);
  console.log("TO BE CONTINUED... ");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("DATA AND ERROR: ", data, error);

  return data;
};

const Login = () => {
  const data = useActionData();

  if (!!data) {
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