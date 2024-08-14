@echo off
setlocal

REM Set the path to Photoshop executable
set "photoshop_path=C:\Program Files\Adobe\Adobe Photoshop 2024\Photoshop.exe"

REM Set the path to your Python script
set "python_script=%~dp0split_paragraphs.py"

REM Set the path to your JSX script
set "jsx_script=%~dp0photoshop_script.jsx"

REM Check if Photoshop path exists
if not exist "%photoshop_path%" (
    echo Photoshop executable not found at %photoshop_path%
    exit /b 1
)

REM Check if Python script exists
if not exist "%python_script%" (
    echo Python script not found at %python_script%
    exit /b 1
)

REM Check if JSX script exists
if not exist "%jsx_script%" (
    echo JSX script not found at %jsx_script%
    exit /b 1
)

REM Run the Python script to split paragraphs
python "%python_script%"

REM Run the JSX script in Photoshop
start "" "%photoshop_path%" -r "%jsx_script%"

REM Pause to keep the command prompt open to view output
pause
