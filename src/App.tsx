import Cropper from './features/cropper'
import Navbar from './components/elements/navbar'
import Footer from './components/elements/footer'

function App() {
    return (
        <div className="min-h-screen md:h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center">
                <Cropper />
            </div>
            <Footer />
        </div>
    )
}

export default App
