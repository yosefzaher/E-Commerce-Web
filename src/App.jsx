import { Outlet } from 'react-router-dom'
import Footer from './Components/Footer/Footer'
import Navbar from './Components/Navbar/Navbar'
import { ToastContainer } from 'react-toastify'


function App() {
  return (
    <div className='min-vh-100 d-flex flex-column'>
      <ToastContainer draggable />
      <Navbar />

      <main className="flex-fill ">
        <Outlet />
      </main>

      <Footer />
    </div>

  )
}

export default App
