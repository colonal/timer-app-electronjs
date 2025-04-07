!include "MUI2.nsh"
!include "FileFunc.nsh"

; General
Name "Timer App Updater"
OutFile "updater.exe"
RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\Timer App Updater"

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Language
!insertmacro MUI_LANGUAGE "English"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Create update directory
  CreateDirectory "$APPDATA\com.electron.app\Update"
  
  ; Download and install the latest version
  nsExec::ExecToLog 'powershell.exe -Command "& {Invoke-WebRequest -Uri \"https://github.com/example.com/timer-app/releases/latest/download/timer-app-setup.exe\" -OutFile \"$APPDATA\com.electron.app\Update\timer-app-setup.exe\"}"'
  Pop $0
  
  ; Run the installer
  ExecWait '"$APPDATA\com.electron.app\Update\timer-app-setup.exe" /S'
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Timer App Updater"
  CreateShortCut "$SMPROGRAMS\Timer App Updater\Timer App Updater.lnk" "$INSTDIR\updater.exe"
  CreateShortCut "$SMPROGRAMS\Timer App Updater\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  
  ; Write uninstall information to Add/Remove Programs
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Timer App Updater" \
                   "DisplayName" "Timer App Updater"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Timer App Updater" \
                   "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Timer App Updater" \
                   "DisplayIcon" "$INSTDIR\updater.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Timer App Updater" \
                   "Publisher" "Your Company"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Timer App Updater" \
                   "DisplayVersion" "1.0.0"
SectionEnd

Section "Uninstall"
  ; Remove files and directories
  Delete "$INSTDIR\updater.exe"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\Timer App Updater\Timer App Updater.lnk"
  Delete "$SMPROGRAMS\Timer App Updater\Uninstall.lnk"
  RMDir "$SMPROGRAMS\Timer App Updater"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Timer App Updater"
  
  ; Clean up update directory
  RMDir /r "$APPDATA\com.electron.app\Update"
SectionEnd 