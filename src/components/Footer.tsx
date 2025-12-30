import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
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
            <motion.a
              href="https://www.linkedin.com/company/resumate-io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg font-medium text-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(10, 102, 194, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Linkedin className="w-4 h-4" />
              Follow Us
            </motion.a>
          </nav>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm text-center md:text-right">
            © {new Date().getFullYear()} Resumate. Built by Aditya Kittad. Built to help you land interviews.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
