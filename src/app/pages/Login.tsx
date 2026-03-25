import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)'
        }}
      >
        <div className="text-center">
          <div className="mb-8">
            <div className="text-5xl font-bold mb-4 text-white">
              Design SaaS
            </div>
            <p className="text-xl text-white/90">
              Budget Management for Interior Designers
            </p>
          </div>
          
          <div className="mt-12 space-y-4 text-white/80">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <p>Professional budget proposals</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <p>Client approval workflows</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <p>Real-time cost tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-primary">
              Design SaaS
            </h1>
            <p className="text-muted-foreground">
              Budget Management for Interior Designers
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="designer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm hover:underline text-secondary"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-semibold mb-2">Demo Credentials:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Platform Admin:</strong> admin@projectclarity.com</p>
                <p><strong>Agency Admin:</strong> admin@luxeinteriors.com</p>
                <p><strong>Designer:</strong> emily@luxeinteriors.com</p>
                <p><strong>Read-Only:</strong> robert@luxeinteriors.com</p>
                <p className="mt-2 italic">Password: any</p>
              </div>
            </div>

            {/* Client Approval Portal Link */}
            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm font-semibold mb-2 text-secondary">Client Approval Portal:</p>
              <p className="text-xs text-muted-foreground mb-2">
                Access budget approvals with your secure link
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs border-secondary text-secondary hover:bg-secondary/10"
                onClick={() => navigate('/client-approval/demo-token')}
              >
                View Demo Client Dashboard
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button
              type="button"
              className="hover:underline text-secondary"
            >
              Contact sales
            </button>
          </p>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/documentation')}
              className="text-sm hover:underline text-primary"
            >
              📖 Learn more about Design SaaS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
