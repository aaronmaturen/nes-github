import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<"professional" | "nes">("professional");

  useEffect(() => {
    // Check for saved theme preference or default to 'professional'
    const savedTheme = localStorage.getItem("theme") as "professional" | "nes" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "professional" ? "nes" : "professional";
    setTheme(newTheme);
    
    // Add transition class
    document.documentElement.classList.add("theme-transitioning");
    
    // Update theme
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);
  };

  return (
    <button
      onClick={toggleTheme}
      className="nes-btn is-primary"
      aria-label={`Switch to ${theme === "professional" ? "NES" : "professional"} theme`}
    >
      {theme === "professional" ? "🎮 NES Theme" : "💼 Professional"}
    </button>
  );
}