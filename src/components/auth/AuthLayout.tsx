import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
              <Shield className="h-10 w-10 text-primary group-hover:text-secondary transition-colors" />
              <span className="text-3xl font-bold text-gradient">CTFifty</span>
            </Link>
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 gradient-primary relative">
        <div className="flex flex-col justify-center items-center text-center px-12 text-white">
          <div className="max-w-md">
            <h3 className="text-4xl font-bold mb-4">
              Master Cybersecurity Skills
            </h3>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of security professionals honing their skills through practical challenges.
            </p>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="opacity-80">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="opacity-80">Challenges</div>
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="opacity-80">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="opacity-80">Available</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>
    </div>
  );
};

export default AuthLayout;