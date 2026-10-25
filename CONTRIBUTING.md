# Contributing to NeuroPulse

Thank you for your interest in contributing to **NeuroPulse**! We welcome contributions from researchers, software engineers, and clinicians.

---

## 📌 Code of Conduct

Please be respectful, collaborative, and considerate of others. Constructive feedback and professional communication are expected across all interactions.

---

## 🛠 Development Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/stress-detection.git
cd stress-detection
```

### 2. Create a Feature Branch
Use descriptive branch names:
- `feature/signal-filtering-improvement`
- `fix/websocket-reconnect-logic`
- `docs/update-api-spec`

```bash
git checkout -b feature/your-feature-name
```

### 3. Backend Setup & Verification
```bash
cd stress-detection-system/backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python test_system.py
```

### 4. Frontend Setup & Verification
```bash
cd ../frontend
npm install
npm test -- --watchAll=false
```

---

## 📐 Coding Standards

- **Python**: Follow PEP 8 style guidelines. Ensure type hints and docstrings are added for all signal processing and ML functions.
- **React / JavaScript**: Use modern ES6+ syntax, React functional components, hooks, and clean Tailwind CSS utilities.
- **Commits**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) convention:
  - `feat: add adaptive Butterworth bandpass order selector`
  - `fix: resolve race condition in telemetry buffer ingestion`
  - `docs: update system architecture diagram`

---

## 🚀 Submitting a Pull Request

1. Ensure all tests pass.
2. Push your feature branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request against the `main` branch with a clear description of your changes, motivation, and any relevant screenshots or benchmarks.
