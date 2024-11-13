(() => {
  let videoStream = null;
  let isStreaming = false;
  let cameraFacing = "environment";

  window.addEventListener("load", () => {
    const toggleButton = document.getElementById("toggle");
    const switchButton = document.getElementById("switchButton");
    const describeButton = document.getElementById("describeButton");

    toggleButton.addEventListener("click", handleClickToggle);
    switchButton.addEventListener("click", switchCamera);
    describeButton.addEventListener("click", handleDescribeClick);
  });

  const handleClickToggle = ({ currentTarget: toggleButton }) => {
    const handler = isStreaming ? handleCameraOff : handleCameraOn;
    handler();

    const offlineImage = document.getElementById("image_view");
    const videoView = document.getElementById("video_view");
    const infoLabel = document.getElementById("info_label");

    if (isStreaming) {
      toggleButton.innerText = "시작";
      videoView.style.display = "none";
      offlineImage.style.display = "block";
      infoLabel.innerText = '객체를 감지하려면 "시작" 버튼을 누르세요.';
    } else {
      toggleButton.innerText = "종료";
      videoView.style.display = "block";
      offlineImage.style.display = "none";
      infoLabel.innerText = '카메라를 끄고싶다면 "종료" 버튼을 누르세요.';
    }

    isStreaming = !isStreaming;
  };

  const handleCameraOff = () => {
    if (videoStream) {
      const tracks = videoStream.getTracks();
      tracks.forEach((track) => track.stop());
      videoStream = null;
    }
  };

  const handleCameraOn = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("미디어 장치가 지원되지 않습니다.");
      return;
    }

    const constraints = {
      video: {
        facingMode: cameraFacing,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(cameraInit)
      .catch((error) => {
        console.log("카메라 오류:", error);
        alert("카메라를 사용할 수 없습니다.");
      });
  };

  const cameraInit = (stream) => {
    const videoView = document.getElementById("video_view");
    videoStream = stream;
    videoView.srcObject = stream;
    videoView.play();
  };

  const switchCamera = () => {
    if (!videoStream) return; // 비디오 스트림이 없으면 종료

    const videoTracks = videoStream.getVideoTracks();
    if (videoTracks.length === 0) {
      console.log("비디오 트랙을 찾을 수 없습니다.");
      return;
    }

    const currentTrack = videoTracks[0];
    const currentFacingMode = currentTrack.getSettings().facingMode;

    if (currentFacingMode === "environment") {
      cameraFacing = "user";
    } else {
      cameraFacing = "environment";
    }

    handleCameraOff();
    handleCameraOn();
  };

  const handleDescribeClick = () => {
    // 비디오에서 한 프레임을 이미지로 캡처하여 서버로 전송
    const canvas = document.createElement("canvas");
    const videoView = document.getElementById("video_view");
    canvas.width = videoView.videoWidth;
    canvas.height = videoView.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoView, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg"); // 이미지를 base64로 변환

    // 서버에 캡처된 이미지를 전송하여 객체 설명을 요청
    fetch("/start_detection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_base64: imageData }),
    })
      .then((response) => response.json())
      .then((data) => {
        // 서버에서 메시지로 응답을 받으면
        const description = data.message;
        speakText(description); // 설명을 음성으로 변환하는 함수 호출
      })
      .catch((error) => {
        console.error("설명 가져오기 오류:", error);
        alert("설명을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.");
      });
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };
})();
