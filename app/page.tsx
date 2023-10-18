import Header from './header';
import Footer from './footer';
import Sculpt from './sculpt';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
        <Header></Header>
        <Sculpt></Sculpt>
        <Footer></Footer>
    </main>
  )
}
  
