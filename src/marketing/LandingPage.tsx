import Navbar from '../components/Navbar'
import Hero from '../sections/Hero'
import HowItWorks from '../sections/HowItWorks'
import DiagnosticBenefits from '../sections/DiagnosticBenefits'
import QualityTutors from '../sections/QualityTutors'
import Pricing from '../sections/Pricing'
import BookingCTA from '../sections/BookingCTA'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="manuscript-surface transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <DiagnosticBenefits />
        <QualityTutors />
        <Pricing />
        <BookingCTA />
      </main>
      <Footer />
    </div>
  )
}
