
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'individual',
    profilePicture: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
          navigate('/');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive"
          });
        }
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match.",
            variant: "destructive"
          });
          return;
        }
        const success = await signup(formData);
        if (success) {
          toast({
            title: "Account created!",
            description: "Your account has been successfully created.",
          });
          navigate('/');
        } else {
          toast({
            title: "Signup failed",
            description: "Please try again.",
            variant: "destructive"
          });
        }
      } else if (mode === 'forgot') {
        toast({
          title: "Reset link sent!",
          description: "Please check your email for password reset instructions.",
        });
        setMode('login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: "Welcome!",
          description: "You have been successfully logged in with Google.",
        });
        navigate('/');
      } else {
        toast({
          title: "Google login failed",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Google authentication failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profilePicture: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-walnut-800 via-mahogany-700 to-teak-800 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <img
          src=""
          alt="Taksha gift box"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center p-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <img
                src="https://github.com/AstraGenX/astragenxlogo/blob/main/%E0%A4%A4%E0%A4%95%E0%A5%8D%E0%A4%B7_logo-removebg-preview%20(1).png?raw=true"
                alt="Taksha Logo"
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-2xl leading-none">Taksha</span>
                <span className="text-sm italic opacity-90">Tradition Meets Innovation</span>
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">
              Welcome to Our Craft Community
            </h2>
            <p className="text-lg opacity-90">
              Join us in celebrating the art of meaningful gifting
            </p>
          </div>
        </div>
      </div>



      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-walnut-50/30">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-walnut-200">
            <CardHeader className="text-center pb-6">
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                <img
                  src="https://github.com/AstraGenX/astragenxlogo/blob/main/%E0%A4%A4%E0%A4%95%E0%A5%8D%E0%A4%B7_logo-removebg-preview%20(1).png?raw=true"
                  alt="Taksha Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-serif font-semibold text-xl text-walnut-800">Taksha</span>
              </div>



              {mode === 'login' && (
                <>
                  <CardTitle className="text-2xl font-serif text-walnut-800">Welcome Back</CardTitle>
                  <p className="text-muted-foreground italic">Punarmilāmaḥ</p>
                </>
              )}

              {mode === 'signup' && (
                <>
                  <CardTitle className="text-2xl font-serif text-walnut-800">Join Our Community</CardTitle>
                  <p className="text-muted-foreground italic">Svāgatam</p>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <CardTitle className="text-2xl font-serif text-walnut-800">Reset Password</CardTitle>
                  <p className="text-muted-foreground">We'll help you get back to creating</p>
                </>
              )}
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Signup Fields */}
                {mode === 'signup' && (
                  <>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                      <div className="flex items-center gap-3">
                        {formData.profilePicture && (
                          <img
                            src={formData.profilePicture}
                            alt="Profile preview"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="userType">Account Type</Label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="individual">Individual</option>
                        <option value="corporate">Corporate</option>
                        <option value="institution">Institution</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Email Field */}
                {mode !== 'forgot' ? (
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="email">Registered Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your registered email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {/* Password Fields */}
                {mode !== 'forgot' && (
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Confirm Password for Signup */}
                {mode === 'signup' && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {/* Forgot Password Link */}
                {mode === 'login' && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-saffron-600 hover:text-saffron-700 p-0"
                      onClick={() => setMode('forgot')}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-saffron-600 hover:bg-saffron-700 text-white"
                >
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Instructions'}
                </Button>

                {/* Divider */}
                {mode !== 'forgot' && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted-foreground/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                )}

                {/* Google Login */}
                {mode !== 'forgot' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-walnut-300 hover:bg-walnut-50"
                    onClick={handleGoogleLogin}
                  >
                    Continue with Google
                  </Button>
                )}
              </form>

              {/* Mode Switching */}
              <div className="mt-6 text-center text-sm">
                {mode === 'login' && (
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="text-saffron-600 hover:text-saffron-700 p-0"
                      onClick={() => setMode('signup')}
                    >
                      Sign up
                    </Button>
                  </p>
                )}

                {mode === 'signup' && (
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="text-saffron-600 hover:text-saffron-700 p-0"
                      onClick={() => setMode('login')}
                    >
                      Sign in
                    </Button>
                  </p>
                )}

                {mode === 'forgot' && (
                  <p className="text-muted-foreground">
                    Remember your password?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="text-saffron-600 hover:text-saffron-700 p-0"
                      onClick={() => setMode('login')}
                    >
                      Back to login
                    </Button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
