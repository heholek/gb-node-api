/**
 * Provides single location for all routes
 */
import authRoutes from "./auth/auth-routes";
import userRoutes from "./user/user-routes";

export default [...authRoutes, ...userRoutes];
