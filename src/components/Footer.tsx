import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Linkedin, Heart } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img 
              src={logo} 
              alt="Resumate" 
              className="h-10 w-auto"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/analyze" className="text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </Link>
            <ThemeToggle />
            <motion.a
              href="https://www.linkedin.com/company/resumate-io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-xl font-medium text-sm shadow-lg shadow-[#0A66C2]/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-4 h-4" />
              Follow Us
            </motion.a>
          </nav>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm text-center md:text-right flex items-center gap-1">
            © {new Date().getFullYear()} Resumate. Built with <Heart className="w-3 h-3 text-destructive inline" /> by Aditya Kittad
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
