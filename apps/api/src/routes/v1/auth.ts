import { Hono } from 'hono';
import signupRouter from '../../modules/auth/signup.ts';
import verificationRouter from '../../modules/auth/verification.ts';
import loginRouter from '../../modules/auth/login.ts';
import logoutRouter from '../../modules/auth/logout.ts';
import recoveryRouter from '../../modules/auth/recovery.ts';
import activationRouter from '../../modules/auth/activation.ts';
import meRouter from '../../modules/auth/me.ts';
import claimRouter from '../../modules/auth/order-claim.ts';

const authRouter = new Hono();

// Auth routes
const routes = authRouter
  .route('/signup', signupRouter)
  .route('/verify-email', verificationRouter)
  .route('/login', loginRouter)
  .route('/logout', logoutRouter)
  .route('/', recoveryRouter) // Has /forgot-password and /reset-password
  .route('/activation', activationRouter)
  .route('/claim-order', claimRouter)
  .route('/', meRouter); // Mounts at /me

export default routes;
