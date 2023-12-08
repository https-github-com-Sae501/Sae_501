import Header from "./components/header"
import Footer from "./components/footer"
import 'tailwindcss/tailwind.css';
import './styles/globals.css';

export default function RootLayout({children}){
    return(
        <html lang="en">
            <body className="flex min-h-screen flex-col">
                <main className="h-full w-full grow relative">{children}</main>
            </body>
        </html>
    )
  
  }