import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import Timer from './components/timer'

function App(): JSX.Element {
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false)

  useEffect(() => {
    // Set up overlay mode listener with callback
    window.api.overlayMode((isOverlay) => {
      setIsOverlayOpen(isOverlay)
    })

    // Clean up listener when component unmounts
    return (): void => {
      window.api.removeAllListeners('overlay-mode')
    }
  }, [])

  return (
    <>
      <div className={!isOverlayOpen ? 'visible' : 'invisible'}>
        <TopBar />
      </div>

      <div
        className={
          !isOverlayOpen
            ? 'bg-black bg-opacity-40 p-2 rounded-b-xl'
            : 'bg-black bg-opacity-40 p-2 rounded-xl'
        }
      >
        <Timer isOverlay={isOverlayOpen} />
      </div>
    </>
  )
}

export default App
