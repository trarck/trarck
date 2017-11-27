echo off
	set current_path=%~dp0
	if not exist %current_path%path.txt goto End
	for /f %%f in (%current_path%path.txt) do ( 
		if [%%f]==[.\] (		
			set Path_=%current_path%
			call :AddPath
		) else (
			set Path_=%current_path%%%f
			call :AddPath
		)
	)
	goto End
:AddPath
	set lastChar=%Path_:~-1%
	if [%lastChar%]==[\] set Path_=%Path_:~0,-1%
	set "RegKey=HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\Session Manager\Environment"
    for /f "tokens=2*" %%a in ('reg query "%RegKey%" /v Path 2^>nul') do set "PathAll_=%%b"
	echo %PathAll_%|find /i "%Path_%" && set IsNull=true|| set IsNull=false
	if not %IsNull%==true (
          reg add "%RegKey%" /v Path /t REG_EXPAND_SZ /d "%PathAll_%;%Path_%" /f
    )
	goto:eof
:End
pause