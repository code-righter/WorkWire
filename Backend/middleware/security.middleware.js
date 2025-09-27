import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";

export const securityMiddleware = (app) => {
  // 1. Set HTTP Security Headers
  app.use(helmet());

  // 2. Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", apiLimiter);

  // 3. Sanitize data (prevent NoSQL injection)
  app.use(mongoSanitize());

  // 4. Enable CORS (restrict domains as needed)
  // 4. Enable CORS (restrict domains as needed)
const allowedOrigins = ["http://localhost:5173"];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ include OPTIONS
//   credentials: true,
// };

// app.use(cors(corsOptions));

// // ✅ Handle preflight requests
// app.options("*", cors(corsOptions));
 }
