@echo off
chcp 65001 > nul
echo ======================================================================
echo 🚀 PWA 项目部署脚本 (仿 2X 模式)
echo ======================================================================
echo.

echo 步骤 1/3: 本地构建项目...
echo.
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 构建失败！请检查错误信息
    pause
    exit /b 1
)

echo.
echo ✅ 构建成功！
echo.

echo 步骤 2/3: 上传构建文件到服务器临时目录...
echo.
echo 执行命令: scp -r dist deploy@110.40.129.184:/tmp/pwa_dist
echo 密码: AAbb123456789
echo.

REM 尝试先删除远程的临时目录以防万一（这一步如果失败可以忽略）
REM ssh deploy@110.40.129.184 "rm -rf /tmp/pwa_dist"

scp -r dist deploy@110.40.129.184:/tmp/pwa_dist

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 文件上传失败！请检查网络连接或密码
    pause
    exit /b 1
)

echo.
echo ✅ 文件上传成功！已上传到 /tmp/pwa_dist
echo.

echo ======================================================================
echo 步骤 3/3: 请SSH连接服务器完成最终部署
echo ======================================================================
echo.
echo 请执行以下命令连接服务器：
echo.
echo ssh deploy@110.40.129.184
echo.
echo 密码: AAbb123456789
echo.
echo ======================================================================
echo 连接后，请复制并执行以下命令来完成部署：
echo ======================================================================
echo.
echo # 1. 准备目录(如果不存在)
echo sudo mkdir -p /www/wwwroot/pwa
echo.
echo # 2. 清理旧文件
echo sudo rm -rf /www/wwwroot/pwa/*
echo.
echo # 3. 部署新文件
echo sudo cp -r /tmp/pwa_dist/* /www/wwwroot/pwa/
echo.
echo # 4. 清理临时文件
echo rm -rf /tmp/pwa_dist
echo.
echo # 5. (可选) 设置权限，假设Web服务器用户是 www
echo sudo chown -R www:www /www/wwwroot/pwa
echo.
echo ======================================================================
echo.
pause
