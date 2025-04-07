function TopBar(): JSX.Element {
  const handleClose = (): void => window.electron.ipcRenderer.send('close')
  const handleMinimize = (): void => window.electron.ipcRenderer.send('minimize')
  const handleMaximize = (): void => window.electron.ipcRenderer.send('maximize')

  return (
    <>
      <div
        className="rounded-t-xl bg-gray-400 w-screen h-5"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      ></div>
      <div className="bg-gray-400 w-screen h-3"> </div>
      <div id="control-buttons" className="text-stone-200 absolute top-1 right-0 pe-2">
        <button id="close" className="pe-2" onClick={handleClose}>
          &#128473;
        </button>
        <button id="maximize" className="pe-2" onClick={handleMaximize}>
          &#128471;
        </button>
        <button id="minimize" className="pe-2" onClick={handleMinimize}>
          &#128469;
        </button>
      </div>
    </>
  )
}

export default TopBar
