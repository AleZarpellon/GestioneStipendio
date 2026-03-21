!macro customUnInstall
  MessageBox MB_YESNO "Vuoi eliminare anche i dati dell'applicazione (database)?" IDNO NoDelete
    RMDir /r "$LOCALAPPDATA\GestioneStipendio"
  NoDelete:
!macroend