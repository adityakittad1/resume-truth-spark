import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Resumate" className="h-10 w-auto" />
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/analyze" className="text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </Link>
            <Link to="/generator" className="text-muted-foreground hover:text-foreground transition-colors">
              Generator
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Resumate. Built to help you land interviews.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
