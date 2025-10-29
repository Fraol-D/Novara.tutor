import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import HowItWorks from './sections/HowItWorks'
import VisualSuccess from './sections/VisualSuccess'
import BookingCTA from './sections/BookingCTA'
import Testimonials from './sections/Testimonials'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-background dark:bg-background-dark text-text dark:text-text-dark font-sans transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <VisualSuccess />
        <BookingCTA />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
