# detect.py

import numpy as np
import mediapipe as mp
from deepface import DeepFace
import cv2
import time
from collections import deque

SCORE_HISTORY = deque(maxlen=2)  # Stores last 2 scores
last_update_time = time.time()


# === Config ===
EYE_OPEN_THRESH = 0.2
GAZE_FORWARD_THRESH = 0.1

# Initialize MediaPipe Face Mesh
mp_face = mp.solutions.face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True)

def eye_openness_ratio(iris_landmarks, eye_landmarks):
    l = np.linalg.norm(np.array(eye_landmarks[1]) - np.array(eye_landmarks[5]))
    w = np.linalg.norm(np.array(eye_landmarks[0]) - np.array(eye_landmarks[3]))
    return l / w

def calculate_score(emotion, eye_ratio, gaze_offset):
    weights = {
        'neutral': 1.0, 'happy': 1.0, 'surprise': 0.8,
        'angry': 0.3, 'fear': 0.3, 'sad': 0.2, 'disgust': 0.2
    }
    score = weights.get(emotion, 0.5)

    # Eye openness
    score += max(0.0, min((eye_ratio - EYE_OPEN_THRESH) * 2, 1.0))

    # Gaze direction
    gaze_score = 1.0 if abs(gaze_offset) < GAZE_FORWARD_THRESH else -0.5
    score += gaze_score

    # Scale to 0–10
    return round(max(0.0, min(score * 2, 10.0)), 2)

def get_feedback(emotion, score):
    global SCORE_HISTORY, last_update_time

    current_time = time.time()
    SCORE_HISTORY.append(score)

    # Only update suggestion every 2 seconds
    if current_time - last_update_time < 2:
        return None  # No new feedback yet

    last_update_time = current_time

    avg_score = sum(SCORE_HISTORY) / len(SCORE_HISTORY)

    # Use avg_score instead of raw score
    if emotion in ['angry', 'fear', 'sad'] or avg_score < 4:
        return {
            "action": "break",
            "message": "It looks like you're stressed. Would you like to take a short break?",
            "resource": "/breathing-exercise"
        }
    elif emotion == 'neutral' or avg_score < 6:
        return {
            "action": "help",
            "message": "Looks like you might be confused. Want a quick explanation?",
            "resource": "/video-explanation"
        }
    elif avg_score > 8:
        return {
            "action": "continue",
            "message": "Great job staying focused!",
            "resource": "/next-topic"
        }
    else:
        return {
            "action": "quiz",
            "message": "Let's test your understanding with a quick quiz.",
            "resource": "/mini-quiz"
        }

def analyze_frame(frame):
    h, w, _ = frame.shape
    results = mp_face.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    if not results.multi_face_landmarks:
        return {"emotion": "No face detected", "score": 0, "feedback": None}

    mesh = results.multi_face_landmarks[0].landmark
    pts = [(int(p.x * w), int(p.y * h)) for p in mesh]

    left_eye_idx = [33, 133, 159, 145, 153, 154]
    right_eye_idx = [362, 263, 386, 374, 380, 385]
    left_iris_idx = [468, 469, 470, 471]
    right_iris_idx = [473, 474, 475, 476]

    le = [pts[i] for i in left_eye_idx]
    re = [pts[i] for i in right_eye_idx]
    li = [pts[i] for i in left_iris_idx]
    ri = [pts[i] for i in right_iris_idx]

    eye_ratio = (eye_openness_ratio(li, le) + eye_openness_ratio(ri, re)) / 2

    le_center = np.mean(le, axis=0)
    re_center = np.mean(re, axis=0)
    li_center = np.mean(li, axis=0)
    ri_center = np.mean(ri, axis=0)
    gaze_offset = ((li_center[0] - le_center[0]) + (ri_center[0] - re_center[0])) / (2 * w)

    try:
        det = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotion = det['dominant_emotion'] if not isinstance(det, list) else det[0]['dominant_emotion']
    except Exception:
        emotion = 'neutral'

    score = calculate_score(emotion, eye_ratio, gaze_offset)
    feedback = get_feedback(emotion, score)

    return {
        "emotion": emotion,
        "score": score,
        "eye_ratio": round(eye_ratio, 2),
        "gaze_offset": round(gaze_offset, 2),
        "feedback": feedback
    }