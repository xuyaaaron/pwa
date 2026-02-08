@echo off
chcp 65001 > nul
echo ======================================================================
echo 🚀 PWA 项目部署脚本
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

echo 步骤 2/3: 上传dist文件夹到服务器...
echo.
echo 执行命令: scp -r dist/* deploy@110.40.129.184:/www/wwwroot/pwa/
echo 密码: AAbb123456789
echo.

scp -r dist/* deploy@110.40.129.184:/www/wwwroot/pwa/

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 文件上传失败！请检查网络连接
    pause
    exit /b 1
)

echo.
echo ✅ 文件上传成功！
echo.

echo 步骤 3/3: 推送代码到GitHub...
echo.
git add .
git commit -m "Update: 部署于 %date% %time%"
git push

echo.
echo ======================================================================
echo ✅ 部署完成！
echo ======================================================================
echo.
echo 访问地址: http://110.40.129.184/pwa/
echo.
pause
