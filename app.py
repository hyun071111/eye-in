from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import base64
import io
import numpy as np
from PIL import Image
import tensorflow as tf
import tensorflow_hub as hub
import pyttsx3
import asyncio

app = Flask(__name__)
CORS(app)

# SSD 모델 로드
detector = hub.load("https://tfhub.dev/tensorflow/ssd_mobilenet_v2/2")

# 객체 이름과 한국어 번역 매핑
object_names_korean = {
    1: '사람',  # COCO 데이터셋에서 1번 클래스는 사람
    3: '자동차',  # COCO 데이터셋에서 3번 클래스는 자동차
    6: '버스',  # COCO 데이터셋에서 6번 클래스는 버스
    10: '신호등',  # COCO 데이터셋에서 10번 클래스는 신호등
    77: '휴대전화',  # COCO 데이터셋에서 77번 클래스는 휴대전화
    73: '노트북',  # COCO 데이터셋에서 73번 클래스는 노트북
    2: '자전거',  # COCO 데이터셋에서 2번 클래스는 자전거
    4: '오토바이',  # COCO 데이터셋에서 4번 클래스는 오토바이
    11: '소화전',  # COCO 데이터셋에서 11번 클래스는 소화전
    13: '정지 표지판',  # COCO 데이터셋에서 13번 클래스는 정지 표지판
    14: '벤치',  # COCO 데이터셋에서 14번 클래스는 벤치
    15: '건물',  # COCO 데이터셋에서 15번 클래스는 건물
    16: '거리 표지판',  # COCO 데이터셋에서 16번 클래스는 거리 표지판
    19: '지하철',  # COCO 데이터셋에서 19번 클래스는 지하철
    20: '공항',  # COCO 데이터셋에서 20번 클래스는 공항
    21: '항구',  # COCO 데이터셋에서 21번 클래스는 항구
    85: '시계'  # COCO 데이터셋에서 85번 클래스는 시계
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_detection', methods=['POST'])
def start_detection():
    data = request.get_json()

    # Base64로 인코딩된 이미지 디코딩
    image_data = base64.b64decode(data['image_base64'].split(',')[1])
    image = Image.open(io.BytesIO(image_data))

    # 모델에 입력할 수 있도록 이미지 전처리
    input_size = 320  # SSD 모델 입력 크기
    image = image.convert('RGB')  # 이미지를 RGB 모드로 변환
    image = image.resize((input_size, input_size))  # 이미지를 모델 입력 크기로 조정

    image_array = np.array(image)  # 이미지를 배열로 변환
    image_array = np.expand_dims(image_array, axis=0)  # 배치 차원 추가
    image_array = image_array.astype(np.uint8)  # SSD 모델의 입력에 맞게 dtype 변경

    # 이미지 분류
    results = detector(image_array)

    # 인식 결과 확인
    detected_classes = results['detection_classes'][0].numpy()
    detected_scores = results['detection_scores'][0].numpy()
    detected_boxes = results['detection_boxes'][0].numpy()

    # 클래스 ID와 한국어 이름을 매핑하고 인식된 객체를 리스트에 추가
    recognized_objects = []
    for i, detected_class in enumerate(detected_classes):
        if detected_scores[i] >= 0.5 and detected_class in object_names_korean:
            recognized_objects.append(object_names_korean[detected_class])

    # 분류된 객체에 대한 설명을 한국어 음성으로 출력
    if recognized_objects:
        message = ', '.join(recognized_objects) + '입니다'
        asyncio.run(speakText(message))  # 비동기 호출로 변경
        return jsonify({'message': message})
    else:
        return jsonify({'message': '인식된 객체가 없습니다.'})

async def speakText(text):
    engine = pyttsx3.init(driverName='sapi5')
    engine.setProperty('rate', 150)
    engine.say(text)

if __name__ == '__main__':
    app.run(debug=True, port=8000)
