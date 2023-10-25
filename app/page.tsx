import Header from './components/header'
import Sculpt from './components/sculpt'
import Footer from './components/footer'
import Botton from './components/bottonSave'
import BottonRefresh from './components/bottonRefresh'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
        <Header></Header>
        <Sculpt></Sculpt>
        <Botton></Botton>
        <BottonRefresh></BottonRefresh>
        <Footer></Footer>
    </main>
  )
}