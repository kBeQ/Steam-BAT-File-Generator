@echo off
setlocal

ECHO ====================================================
ECHO  STEP 1: SETTING UP NODE.JS ENVIRONMENT
ECHO ====================================================
ECHO.

IF NOT EXIST "node_modules" (
    ECHO 'node_modules' folder not found. Installing dependencies...
    ECHO This may take a moment.
    npm install
    IF ERRORLEVEL 1 (
        ECHO #############################################################
        ECHO #  ERROR: FAILED to install npm packages.                   #
        ECHO #  Make sure Node.js and npm are installed correctly.       #
        ECHO #############################################################
        ECHO.
        pause
        exit /b 1
    )
) ELSE (
    ECHO 'node_modules' folder found. Skipping dependency installation.
)

ECHO Environment is ready.
ECHO.

ECHO ====================================================
ECHO  STEP 2: CLEANING & BUILDING WITH VITE
ECHO ====================================================
ECHO.
ECHO Cleaning up previous build...
IF EXIST "dist" rmdir /s /q "dist"
ECHO.

ECHO Building the project for production...
npm run build
IF ERRORLEVEL 1 GOTO build_failed

ECHO.
ECHO ====================================================
ECHO  STEP 3: LAUNCHING PREVIEW SERVER
ECHO ====================================================
ECHO.
ECHO The build was successful.
ECHO A new window will open with the Vite preview server.
ECHO You can view the built application in your browser.
ECHO Close the new window to stop the server.
ECHO.

:: 'npm run preview' starts a server for the 'dist' folder.
:: We use 'start' to run it in a new, non-blocking window.
start "Vite Preview" cmd /c "npm run preview"

exit /b 0

:build_failed
ECHO #############################################################
ECHO #                   BUILD FAILED!                           #
ECHO #  An error occurred during the 'vite build' process.       #
ECHO #  Please review the messages above.                        #
ECHO #############################################################
ECHO.
pause
exit /b 1