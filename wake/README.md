# GriffTunes wake word ("Hey DJ")

GriffTunes listens for its wake word right in Chrome on the jukebox (`wake.js`, onnxruntime-web). Nothing leaves the computer until the wake word is heard.

- `melspectrogram.onnx`, `embedding_model.onnx`: openWakeWord's shared feature models (v0.5.1 release; github.com/dscripka/openWakeWord, Apache-2.0; the embedding model is based on Google's speech_embedding).
- `hey_jarvis.onnx`: openWakeWord's pretrained "hey jarvis" model (CC BY-NC-SA 4.0), a stand-in for testing until `hey_dj.onnx` exists.
- `hey_dj.onnx`: the custom "Hey DJ" model (trained Nov 14, 2026 with the notebook below). GriffTunes uses it automatically.

## Training "Hey DJ"

[Open train_hey_dj.ipynb in Colab](https://colab.research.google.com/github/jgriffin187/grifftunes/blob/main/wake/train_hey_dj.ipynb): Runtime → Change runtime type → T4 GPU, then Runtime → Run all (about an hour). It downloads `hey_dj.onnx` at the end.

`vendor/ort/` holds onnxruntime-web 1.31.1 (MIT license, Microsoft).
