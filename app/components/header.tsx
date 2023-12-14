"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const authToken = localStorage.getItem("authToken");
    setAuthenticated(!!authToken);
  }, []);

  const handleLogout = () => {
    // Perform logout actions
    localStorage.removeItem("authToken");
    setAuthenticated(false);
    console.log("Utilisateur déconnecté.");
  };

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="flex justify-between items-center p-2 px-3 bg-black text-white w-full">
        <div className=" flex flex-row gap-4">
          <div className="text-sm">
            <Link href="/">Library</Link>
          </div>
          <div className="text-sm">
            <Link href="./sculpt">Sculpt</Link>
          </div>
        </div>
        <div className="flex text-sm gap-4">
          {authenticated ? (
            <p className="font-semibold cursor-pointer select-none" onClick={handleLogout}>
              Se Déconnecter
            </p>
          ) : (
            <Link href="./formulaire">
              <p className="font-semibold">Se Connecter</p>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;