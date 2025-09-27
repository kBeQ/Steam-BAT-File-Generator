@echo off
setlocal

ECHO ====================================================
ECHO  STEP 1: SETTING UP NODE.JS ENVIRONMENT
ECHO ====================================================
ECHO.

IF NOT EXIST "node_modules" (
    ECHO 'node_modules' folder not found. Installing dependencies...
    ECHO This may take a moment.
    CALL npm install
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
ECHO  STEP 2: CREATING A PRODUCTION BUILD
ECHO ====================================================
ECHO.
ECHO Cleaning up previous build...
IF EXIST "dist" rmdir /s /q "dist"
ECHO.

ECHO Building the project with Vite...
CALL npm run build
IF ERRORLEVEL 1 GOTO build_failed

ECHO.
ECHO ====================================================
ECHO  STEP 3: BUILD COMPLETE!
ECHO ====================================================
ECHO.
ECHO The project has been successfully built for production.
ECHO The 'dist' folder contains the self-contained files.
ECHO.
ECHO You can now upload the CONTENTS of the 'dist' folder to Itch.io.
ECHO Opening the 'dist' folder for you now...
ECHO.

:: Opens the 'dist' folder in File Explorer to show you the build output.
start "" "dist"

ECHO.
ECHO Script finished. You can close this window.
ECHO.
pause
exit /b 0

:build_failed
ECHO #############################################################
ECHO #                   BUILD FAILED!                           #
ECHO #  An error occurred during the 'npm run build' process.    #
ECHO #  Please review the error messages above.                  #
ECHO #############################################################
ECHO.
pause
exit /b 1