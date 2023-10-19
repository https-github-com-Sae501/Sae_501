import Image from 'next/image'
import Header from './header'
import Sculpt from './sculpt'
import Footer from './footer'
import Botton from './botton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
        <Header></Header>
        <Sculpt></Sculpt>
        <Botton></Botton>
        <Footer></Footer>
    </main>
  )
}
