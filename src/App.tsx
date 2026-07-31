import { MotionConfig } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import BusinessHoursBar from './components/BusinessHoursBar'
import BranchSection from './components/BranchSection'
import Introduction from './components/Introduction'
import MenuSection from './components/MenuSection'
import Gallery from './components/Gallery'
import UsageGuide from './components/UsageGuide'
import GroupDining from './components/GroupDining'
import Directions from './components/Directions'
import PhoneContact from './components/PhoneContact'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import StructuredData from './components/StructuredData'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StructuredData />
      <Header />
      <main id="main-content" className="pb-20 md:pb-0">
        <Hero />
        <BusinessHoursBar />
        <BranchSection />
        <Introduction />
        <MenuSection />
        <Gallery />
        <UsageGuide />
        <GroupDining />
        <Directions />
        <PhoneContact />
      </main>
      <Footer />
      <MobileActionBar />
    </MotionConfig>
  )
}
