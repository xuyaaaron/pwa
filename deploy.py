import os
import subprocess
import time

# 配置信息
HOST = "110.40.129.184"
USER = "root"
PASSWORD = "AAbb1234567"
LOCAL_DIST = "dist"
REMOTE_TMP = "/tmp/pwa_dist"
LOCAL_BACKEND = "../2X/backend/api_server.py"
REMOTE_BACKEND_TMP = "/tmp/api_server_new.py"
REMOTE_BACKEND_DIR = "/home/deploy/web/2X/backend"
REMOTE_BACKEND_FILE = f"{REMOTE_BACKEND_DIR}/api_server.py"
REMOTE_LOG_FILE = f"{REMOTE_BACKEND_DIR}/api.log"

def deploy():
    print("🚀 PWA 全自动部署脚本 (Python版)")
    print("========================================")
    
    try:
        import paramiko
        from scp import SCPClient
    except ImportError:
        print("正在安装必要库...")
        os.system("pip install paramiko scp")
        import paramiko
        from scp import SCPClient

    # 1. 构建前端
    print("\n步骤 1/5: 构建前端 (npm run build)...")
    build_res = subprocess.run("npm run build", shell=True)
    if build_res.returncode != 0:
        print("❌ 前端构建失败！")
        return
    print("✅ 前端构建成功")

    # 2. 连接服务器
    print("\n步骤 2/5: 连接服务器...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(HOST, username=USER, password=PASSWORD)
    except Exception as e:
        print(f"❌ 连接失败: {e}")
        return

    # 3. 上传文件
    print("\n步骤 3/5: 上传文件...")
    try:
        with SCPClient(ssh.get_transport()) as scp:
            print(f"上传前端 -> {REMOTE_TMP}")
            scp.put(LOCAL_DIST, recursive=True, remote_path=REMOTE_TMP)
            print(f"上传后端 -> {REMOTE_BACKEND_TMP}")
            scp.put(LOCAL_BACKEND, REMOTE_BACKEND_TMP)
        print("✅ 上传完成")
    except Exception as e:
        print(f"❌ 上传失败: {e}")
        print("请检查前端 dist 目录是否存在，或者后端文件路径是否正确。")
        return

    # 4. 部署与重启
    print("\n步骤 4/5: 服务器部署与重启...")
    commands = [
        # 前端
        "mkdir -p /www/wwwroot/pwa",
        f"cp -r {REMOTE_TMP}/* /www/wwwroot/pwa/",
        "chmod -R 755 /www/wwwroot/pwa",
        
        # 后端
        f"mkdir -p {REMOTE_BACKEND_DIR}",
        f"cp {REMOTE_BACKEND_TMP} {REMOTE_BACKEND_FILE}",
        
        # 安装依赖
        "pip3 install flask flask-cors",
        
        # 重启服务
        "pkill -f api_server.py || true",
        f"nohup python3 {REMOTE_BACKEND_FILE} > {REMOTE_LOG_FILE} 2>&1 &",
        
        # 清理
        f"rm -rf {REMOTE_TMP} {REMOTE_BACKEND_TMP}"
    ]
    
    for cmd in commands:
        print(f"执行: {cmd}")
        ssh.exec_command(cmd)
        time.sleep(1)

    # 5. 检查状态
    print("\n步骤 5/5: 检查后端服务状态...")
    time.sleep(3)
    stdin, stdout, stderr = ssh.exec_command("ps -ef | grep api_server.py | grep -v grep")
    process = stdout.read().decode().strip()
    
    if process:
        print(f"✅ 后端服务已启动:\n{process}")
        print("\n🎉 部署成功！网页数据同步功能已恢复。")
    else:
        print("❌ 警告：后端服务未启动！")
        print("正在读取错误日志...")
        stdin, stdout, stderr = ssh.exec_command(f"cat {REMOTE_LOG_FILE}")
        print(stdout.read().decode())

    ssh.close()
    print("\n部署脚本执行完毕。")

if __name__ == "__main__":
    deploy()
