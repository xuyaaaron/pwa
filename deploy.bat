@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ======================================================================
echo 🚀 PWA 自动部署 (Python核心)
echo ======================================================================
echo.
echo 正在启动全自动部署脚本，无需手动输入密码...
echo.

python deploy.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 部署脚本执行出错！
    pause
    exit /b 1
)

echo.
pause
