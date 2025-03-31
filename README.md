# Eye-In

**Eye-In**은 SSD_MobileNet_v2 모델을 활용하여 이미지 내 객체를 탐지하는 웹 애플리케이션입니다. 사용자는 웹 인터페이스를 통해 이미지를 업로드하고, 모델은 해당 이미지에서 객체를 식별하여 시각적으로 표시합니다.

## 주요 기능

- **이미지 업로드**: 사용자가 로컬 이미지를 선택하여 업로드할 수 있습니다.
- **객체 탐지 및 시각화**: 업로드된 이미지에서 객체를 탐지하고, 해당 객체 주위에 경계 상자를 그려 시각적으로 표시합니다.

## 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript
- **백엔드**: Python, Flask
- **모델**: TensorFlow를 사용한 SSD_MobileNet_v2

## 설치 및 실행 방법

1. **저장소 클론**:
   ```bash
   git clone https://github.com/hyun071111/eye-in.git
   ```
2. **프로젝트 디렉토리로 이동**:
   ```bash
   cd eye-in
   ```
3. **가상 환경 생성 및 활성화** (선택 사항이지만 권장됨):
   - 가상 환경 생성:
     ```bash
     python -m venv venv
     ```
   - 가상 환경 활성화:
     - Windows:
       ```bash
       venv\Scripts\activate
       ```
     - macOS/Linux:
       ```bash
       source venv/bin/activate
       ```
4. **필요한 패키지 설치**:
   ```bash
   pip install -r requirements.txt
   ```
5. **애플리케이션 실행**:
   ```bash
   python app.py
   ```
6. **웹 브라우저에서 애플리케이션 접속**:
   ```
   http://localhost:5000
   ```

## 프로젝트 구조

- **`static/`**: CSS, JavaScript, 이미지 등 정적 파일이 포함되어 있습니다.
- **`templates/`**: HTML 템플릿 파일이 위치해 있습니다.
- **`app.py`**: Flask 애플리케이션의 메인 파일로, 라우팅 및 로직을 처리합니다.
