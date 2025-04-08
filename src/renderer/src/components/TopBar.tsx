import { useEffect, useState } from 'react'

function TopBar(): JSX.Element {
  const handleClose = (): void => window.api.close()
  const handleMinimize = (): void => window.api.minimize()
  const handleMaximize = (): void => window.api.maximize()
  const handleCheckUpdate = (): void => window.api.checkUpdate()
  const handleForceUpdate = (): void => window.api.forceUpdate()

  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    const version = window.api.appVersion()
    console.log(`V${version}`)
    setVersion(`V${version}`)
  }, [])

  return (
    <>
      <div
        className="rounded-t-xl bg-red-400 w-screen h-8"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      ></div>
      <div
        id="control-buttons"
        className="text-stone-200 absolute top-1 right-0 pe-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {process.env.NODE_ENV === 'development' && (
          <>
            <button
              id="check-update"
              className="pe-2 hover:text-blue-200"
              onClick={handleCheckUpdate}
              title="Check for Updates"
            >
              🔄
            </button>
            <button
              id="force-update"
              className="pe-2 hover:text-blue-200"
              onClick={handleForceUpdate}
              title="Force Update"
            >
              ⚡
            </button>
          </>
        )}
        <button id="minimize" className="pe-2" onClick={handleMinimize}>
          &#128469;
        </button>

        <button id="maximize" className="pe-2" onClick={handleMaximize}>
          &#128471;
        </button>
        <button id="close" className="pe-2" onClick={handleClose}>
          &#128473;
        </button>
      </div>
      <div className="text-stone-200 absolute top-1 left-0 ps-2">{version}</div>
    </>
  )
}

export default TopBar
