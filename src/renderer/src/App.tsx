import { useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import Timer from './components/timer'

function App(): JSX.Element {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('overlay=mode', () => {
      setIsOverlayOpen(!isOverlayOpen)
    })

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('overlay=mode')
    }
  })
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
