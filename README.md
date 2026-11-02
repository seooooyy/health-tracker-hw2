# Health Tracker

키와 몸무게로 BMI를 계산하고 날짜별 건강 기록을 관리하는 한국어 웹앱입니다. FastAPI가 웹 화면을 제공하며, BMI 계산과 기록 관리는 브라우저에서 처리합니다.

## 주요 기능

- 키(cm), 몸무게(kg)를 입력해 BMI 계산
- 성인 참고 범위와 BMI 단계 안내
- 날짜별 기록을 브라우저 `localStorage`에 저장하고 목록 표시
- 저장된 기록의 BMI 변화 그래프 표시
- 기록 삭제 및 같은 날짜 기록 갱신
- 키와 몸무게 입력값 검증

BMI 기록은 서버로 전송되지 않습니다. 기록은 저장한 브라우저와 웹사이트 주소에 연결되며, 브라우저 사이트 데이터를 삭제하면 함께 사라집니다. BMI는 건강 진단이 아닌 참고 지표입니다.

## 프로젝트 구성

```text
app/
  __init__.py
  main.py
static/
  index.html
  styles.css
  app.js
requirements.txt
render.yaml
.gitignore
README.md
```

## Windows 설치 및 실행

Python 3.10 이상을 설치한 뒤 PowerShell에서 프로젝트 폴더로 이동합니다.

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

PowerShell 실행 정책 때문에 가상환경 활성화가 차단되면 가상환경의 실행 파일을 직접 사용할 수 있습니다.

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

브라우저에서 <http://127.0.0.1:8000>을 엽니다. 상태 확인 주소는 <http://127.0.0.1:8000/health>, API 문서는 <http://127.0.0.1:8000/docs>입니다.

## GitHub에 올리기

기존 GitHub 저장소에 README와 초기 커밋이 있다면 해당 저장소를 먼저 clone한 다음, 이 폴더의 파일을 clone한 작업 폴더에 복사합니다. 기존 `.git` 폴더를 유지하면 기존 커밋 이력이 이어집니다. README에 보존할 내용이 있으면 이 README의 프로젝트 안내와 합쳐 주세요. 새로 Git을 초기화하거나 기존 이력을 강제로 덮어쓸 필요가 없습니다.

```powershell
git clone https://github.com/<OWNER>/<REPOSITORY>.git
```

이후 `upload` 폴더의 **내용물**을 clone한 저장소 폴더에 복사하고 변경 사항을 확인한 뒤 커밋 및 Push합니다. GitHub에서 새 저장소를 만들 경우에는 이 폴더의 내용물을 올리고 저장소의 기본 브랜치를 설정하면 됩니다.

## Render 배포

1. GitHub에 프로젝트 파일을 올립니다.
2. Render 대시보드에서 **New + → Blueprint**를 선택하고 GitHub 저장소를 연결합니다.
3. 저장소의 `render.yaml`을 확인하고 서비스를 생성합니다.

Blueprint가 아닌 Web Service를 직접 설정하는 경우 다음 값을 사용합니다.

- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/health`

배포 후 Render가 제공하는 URL을 브라우저에서 엽니다. 사용자 기록은 브라우저 로컬 저장소에 있으므로 서버 재배포나 다른 기기와 기록을 공유하지 않습니다.
