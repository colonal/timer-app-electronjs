!macro customInit
  ; Check if the app is already installed
  ReadRegStr $R0 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\{${APP_GUID}}" "UninstallString"
  StrCmp $R0 "" done

  ; If installed, ask user if they want to uninstall the previous version
  MessageBox MB_YESNO|MB_ICONQUESTION "A previous version of ${PRODUCT_NAME} is already installed. Would you like to uninstall it first?" IDYES uninst IDNO done

  uninst:
    ; Run the uninstaller
    ExecWait '$R0 _?=$INSTDIR'
  done:
!macroend

!macro customInstall
  ; Create update directory if it doesn't exist
  CreateDirectory "$APPDATA\${APP_GUID}\Update"
  
  ; Set permissions for the update directory
  AccessControl "$APPDATA\${APP_GUID}\Update" /S=1 /G="Users" /E=1 /R=1
!macroend

!macro customUnInstall
  ; Clean up update files
  RMDir /r "$APPDATA\${APP_GUID}\Update"
!macroend 