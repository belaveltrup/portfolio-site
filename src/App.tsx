import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'
import KarteiPrivacy from './components/kartei/KarteiPrivacy'
import KarteiSupport from './components/kartei/KarteiSupport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/kartei/privacy" element={<KarteiPrivacy />} />
      <Route path="/projects/kartei/support" element={<KarteiSupport />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
    </Routes>
  )
}

export default App
