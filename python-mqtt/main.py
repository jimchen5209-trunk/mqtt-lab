import paho.mqtt.client as mqtt
import json
from datetime import datetime

host= "localhost"
port= 1883
keepalive= 60
username= "admin"
password= "admin"
subtopic= "monosparta/chat"

# 建立連線的函數
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

    # 每次連線之後，設定訂閱主題
    client.subscribe(subtopic, qos=0)

# 接收訊息的函數
def on_message(client, userdata, msg):
    print(f"[{msg.topic}]: {msg.payload}")
    data = json.loads(msg.payload)
    with open('log.txt', 'a', encoding='utf-8') as fs:
        fs.writelines(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {data['name']}: {data['message']}\n")

# 建立 MQTT Client 物件
client = mqtt.Client()

# 設定建立連線的函數
client.on_connect = on_connect

# 設定接收訊息的函數
client.on_message = on_message

# 設定登入帳號密碼（若無則可省略）
client.username_pw_set(username,password)

# 連線至 MQTT 伺服器（伺服器位址,連接埠）
client.connect(host, port, keepalive)

# 進入無窮處理迴圈
client.loop_forever()