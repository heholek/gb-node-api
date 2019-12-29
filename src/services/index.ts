/**
 * Provides single location for all routes
 */
import authRoutes from "./auth/auth-routes";
import gbRoutes from "./gb/gb-routes";
import userRoutes from "./user/user-routes";

export default [...authRoutes, ...userRoutes, ...gbRoutes];
