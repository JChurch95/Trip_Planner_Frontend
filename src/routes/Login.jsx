import { Form, useActionData, Navigate, Link } from "react-router-dom";
import { z } from "zod";
import styles from "./Login.module.css";
import supabase from "../supabase";
import { motion } from "framer-motion";

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
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-24 h-24 relative mb-4"
      >
        <div className="w-full h-full animate-gradient rounded-full flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16 text-white transform translate-y-1"
          >
            <path
              fill="currentColor"
              d="M50 25
                 C 75 25, 85 40, 85 60
                 C 85 80, 70 85, 50 85
                 C 30 85, 15 80, 15 60
                 C 15 40, 25 25, 50 25"
            />
            <path
              fill="currentColor"
              d="M35 25
                 C 35 5, 10 0, 25 -5
                 C 20 -5, 15 5, 20 25
                 C 25 50, 35 35, 35 25
                 M65 25
                 C 65 5, 90 0, 75 -5
                 C 80 -5, 85 5, 80 25
                 C 75 50, 65 35, 65 25"
            />
            <circle cx="35" cy="55" r="4" fill="#333" />
            <circle cx="65" cy="55" r="4" fill="#333" />
            <path
              fill="#FF9999"
              d="M50 62
                 C 53 62, 55 64, 55 66
                 C 55 68, 53 70, 50 70
                 C 47 70, 45 68, 45 66
                 C 45 64, 47 62, 50 62"
            />
            <path
              fill="currentColor"
              d="M47 70
                 L47 74
                 L49 74
                 L49 70
                 M51 70
                 L51 74
                 L53 74
                 L53 70"
            />
            <path
              stroke="#333"
              strokeWidth="1"
              fill="none"
              d="M30 65 L15 60
                 M30 67 L15 67
                 M30 69 L15 74
                 M70 65 L85 60
                 M70 67 L85 67
                 M70 69 L85 74"
            />
            <circle cx="30" cy="65" r="3" fill="#FFB6C1" opacity="0.5" />
            <circle cx="70" cy="65" r="3" fill="#FFB6C1" opacity="0.5" />
          </svg>
        </div>
      </motion.div>

      <h1 className={styles.title}>Welcome Back! Hop back in!</h1>
      
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
            <p className={styles.registerText}>Don't have an account yet?</p>
            <Link 
              to="/registration" 
              className={`${styles.registerLink} ${styles.button}`}
            >
              Sign up now!
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;