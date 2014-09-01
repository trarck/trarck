@echo off
rem ngCore SDK make.bat usage:
rem
rem Arguments:
rem
rem combine=false            Javascript file is not combined.
rem compress=true            To minify and compress javascript files.
rem generateArchives=true    To server targets to generate content zips.
rem extendDebugLog=true      Extend the output of NgLogD() to include file name and line number by Build Script
rem extendExceptionInfo=true Extend the output of NgLogException() to include original source file information by Build Script
rem
rem e.g:
rem  make server "extendDebugLog=true" "extendExceptionInfo=true"
rem


rem Change to the current dir
rem ---------------------------------------------------------------------------
cd /d %~dp0
set CURRENT_DIR=%CD%


rem Set node.exe and jakefile path
rem ---------------------------------------------------------------------------
set EXEC_NODE=node.exe
set SERVER_JAKE=./Tools/jake/lib/jake.js -f ./Tools/prepare/ServerJakefile


rem Set port
rem ---------------------------------------------------------------------------
set SERVER_PORT=8002


rem Set task
rem ---------------------------------------------------------------------------
set MAKE_TASK=%1
if "%MAKE_TASK%" == ""          set MAKE_TASK = "server"


rem Set option
rem ---------------------------------------------------------------------------
set OPTIONS=directManifestCopy=true

rem shortcuts

rem CPR: link or copy a directory tree
rem CP: lnk or copy a file
mklink 2>nul
if "%ERRORLEVEL%" == "9009" (
    set CPR=call :cp-r
    set CP=copy :cp
) else (
    set CPR=call :lnkd
    set CP=call :lnk
)


rem execute task
rem ---------------------------------------------------------------------------
if "%MAKE_TASK%" == "server"          GOTO SERVER
if "%MAKE_TASK%" == "new-server"      GOTO NEW-SERVER
if "%MAKE_TASK%" == "link"            GOTO CREATE_LINK
if "%MAKE_TASK%" == "server-compress" GOTO SERVER_COMPRESS
if "%MAKE_TASK%" == "jake"            GOTO JAKE
if "%MAKE_TASK%" == "debug"           GOTO SERVER_DEBUG
if "%MAKE_TASK%" == "sdklinks"	      GOTO CREATE-SDK-LINKS
if "%MAKE_TASK%" == "arun"            GOTO ARUN
if "%MAKE_TASK%" == "astop"           GOTO ASTOP
if "%MAKE_TASK%" == "help"            GOTO HELP


rem Set enabled mklink command
rem ---------------------------------------------------------------------------

if "%MAKE_TASK%" == "toggle-jp" (
	GOTO TOGGLE-JP
)
if "%MAKE_TASK%" == "toggle-us" (
	GOTO TOGGLE-US
)



:SERVER
rem ---------------------------------------------------------------------------
%EXEC_NODE% %SERVER_JAKE% server suppressLegacy=true serverPort=%SERVER_PORT% %OPTIONS% %*
goto :EOF

:NEW-SERVER
rem ---------------------------------------------------------------------------
%EXEC_NODE% %SERVER_JAKE% new-server suppressLegacy=true serverPort=%SERVER_PORT% %OPTIONS% %*
goto :EOF

:JAKE
rem ---------------------------------------------------------------------------
%EXEC_NODE% ./Tools/jake/lib/jake.js -f Tools\prepare\build.jake -C %CURRENT_DIR%\%2 build suppressLegacy=true jslint=false generateArchives=true %OPTIONS%
goto :EOF


:SERVER_COMPRESS
%EXEC_NODE% %SERVER_JAKE% server suppressLegacy=true serverPort=%SERVER_PORT% %OPTIONS% compress=true %*
goto :EOF

:SERVER_DEBUG
rem ---------------------------------------------------------------------------
%EXEC_NODE% --debug %SERVER_JAKE% server suppressLegacy=true serverPort=%SERVER_PORT%
goto :EOF



rem ---------------------------------------------------------------------------
rem  Windows support. Make hard copies of symbolic links
rem ---------------------------------------------------------------------------

:TOGGLE-JP
rem ---------------------------------------------------------------------------
echo toggle-jp start ...

cd "%CURRENT_DIR%\NGCore\Client\Social\_Internal"

	%CPR% "%CURRENT_DIR%\submodules\watatsumi\code" "JP"
	%CPR% "JP" "mbg"

	%CP% "mbg\Interface\Privileged.js" "Privileged.js"

cd "%CURRENT_DIR%\NGCore\Client\Social"

	%CPR% "_Internal\JP\Interface\Public" "JP"
	%CP%  "_Internal\JP\Interface\Public.js" "JP.js"


cd "%CURRENT_DIR%\NGCore\Client\Bank"

	%CPR% "..\Social\_Internal" "_Internal"
	%CPR% "..\Social\JP" "JP"
	%CP%  "_Internal\JP\Interface\NGCore.Client.Bank.Public.js" "JP.js"

cd "%CURRENT_DIR%\NGCore\Client"

	%CP% "Social\JP.js" "Social.js"
	%CP% "Bank\JP.js" "Bank.js"

rem for dev mode
cd "%CURRENT_DIR%\submodules\watatsumi"
if "%ERRORLEVEL%" == "0" (
    %CPR% "%CURRENT_DIR%\NGCore" NGCore
    %CPR% "%CURRENT_DIR%\NGBoot" NGBoot

    %CPR% Bundles\MobageBoot mobage

    cd Bundles\MobageBoot

    %CPR% "%CURRENT_DIR%\NGCore" NGCore
)

cd "%CURRENT_DIR%"

echo toggle-jp done
goto :COPY_NGCORE_TO_SAMPLES

:TOGGLE-US
rem ---------------------------------------------------------------------------
echo toggle-us start ...

cd NGCore/Client/Social/_Internal

cd "%CURRENT_DIR%\NGCore\Client\Social\_Internal"

	%CPR% "%CURRENT_DIR%\submodules\narwhal\code" "US"
	%CPR% "US" "mbg"

	%CP% "mbg\Interface\Privileged.js" "Privileged.js"

cd "%CURRENT_DIR%\NGCore\Client\Social"

	%CPR% "_Internal\US\Interface\Public" "US"
	%CP%  "_Internal\US\Interface\NGCore.Client.Social.Public.js" "US.js"


cd "%CURRENT_DIR%\NGCore\Client\Bank"

	%CPR% "..\Social\_Internal" "_Internal"
	%CPR% "..\Social\US" "US"
	%CP%  "_Internal\US\Interface\NGCore.Client.Bank.Public.js" "US.js"

cd "%CURRENT_DIR%\NGCore\Client"

	%CP% "Social\US.js" "Social.js"
	%CP% "Bank\US.js" "Bank.js"

rem for dev mode
cd "%CURRENT_DIR%\submodules\narwhal"
if "%ERRORLEVEL%" == "0" (
    cd Bundles\MobageBoot
    
    %CPR% "%CURRENT_DIR%\NGCore" NGCore
    %CPR% "NGCore\Client\Social\_Internal\US\Assets" Assets
)

echo toggle-us done
goto :COPY_NGCORE_TO_SAMPLES

:COPY_NGCORE_TO_SAMPLES
rem ---------------------------------------------------------------------------

cd "%CURRENT_DIR%"
echo copy NGCore/ to sample apps
for /D %%S IN ("%CURRENT_DIR%\Samples\*") DO (
    echo processing [%%S]
	cd "%%S"
	%CPR% "%CURRENT_DIR%\NGCore" NGCore
	cd "%CURRENT_DIR%"
)
for /D %%S IN ("%CURRENT_DIR%\Samples\SocialJP\*") DO (
    echo processing [%%S]
	cd "%%S"
	%CPR% "%CURRENT_DIR%\NGCore" NGCore
	cd "%CURRENT_DIR%"
)


cd "%CURRENT_DIR%"

if exist Tests/Lib (
    echo copy NGCore/ to Tests/Lib
    cd Tests/Lib
    %CPR% "%CURRENT_DIR%\NGCore" NGCore
    cd "%CURRENT_DIR%"
)

goto :END


rem ---------------------------------------------------------------------------
rem  ARUN / ASTOP   
rem ---------------------------------------------------------------------------


:ARUN
rem ---------------------------------------------------------------------------
set MYPACKAGEID=com.mobage.ww
rem set MYPACKAGEID=com.mobage.jp
set MYPORT=8002
set MYNATIVELOG=false
rem Run local Android build with given ngCore game path.
rem Ex: make arun game=Samples/Launcher

ipconfig | findstr /c:"IP Address" /c:"IPv4" > ip.txt
for /f "eol=, delims=:, tokens=2-3" %%i IN (ip.txt) DO (
	
	set MYIP=%%i
	echo start %MYIP% %3
	adb shell "am start -a %MYPACKAGEID%.RUN -e server http://%MYIP: =%:%MYPORT% -e game %3 -e nativeLog %MYNATIVELOG%"
	goto :END

)

:ASTOP
rem ---------------------------------------------------------------------------
set MYPACKAGEID=com.mobage.ww
rem set MYPACKAGEID=com.mobage.jp
rem Stop running ngCore activity.

adb shell "am broadcast -a %MYPACKAGEID%.STOP"
goto :END


:HELP
rem ---------------------------------------------------------------------------
echo help:                   ## Show this help.
echo server:                 ## Run server.  Set port with arg port=xxxx.
echo new-server:             ## Run new server.  Set port with arg port=xxxx.
echo server-compress:        ## Run server with code minification/obfuscation.
echo toggle-jp:              ## Switch to JP Social implementation.
echo toggle-us:              ## Switch to US Social implementation.
echo arun:                   ## Run local Android build with given ngCore game path.
echo                         ## Ex: make arun game=Samples/Launcher
echo                         ## Stop running ngCore activity.

goto :END

:END
cd %CURRENT_DIR%
goto :EOF

rem subroutine section

rem makes a symlink for a directory
:lnkd
    if exist "%1" (
        call :rm-rf "%2"
        mklink /D "%2" "%1"
    )
exit /b

rem makes a symlink for a file
:lnk
    if exist "%1" (
        call :rm-rf "%2"
        mklink "%2" "%1"
    )
exit /b

:cp-r
    if exist "%1" (
        call :rm-rf "%2"
        xcopy /H /E /I /K /Q /Y "%1" "%2"
    )
exit /b

:cp
    if exist "%1" (
        call :rm-rf "%2"
        copy /B /Y "%1" "%2"
    )
exit /b

:rm-rf
    if exist "%1" del /F /Q /A:s "%1" 2>nul
    if exist "%1" rmdir /S /Q "%1" 2>nul
    if exist "%1" del /F /Q "%1" 2>nul
exit /b
