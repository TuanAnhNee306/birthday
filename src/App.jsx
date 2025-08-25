import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// --- Thành phần Trái tim rơi ---
const FallingHearts = () => {
  const createHeart = useCallback(() => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2s -> 5s
    heart.innerHTML = "💖"; // Sử dụng emoji đa dạng hơn
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 5000); // Xóa sau 5 giây
  }, []);

  useEffect(() => {
    const interval = setInterval(createHeart, 300);
    return () => clearInterval(interval);
  }, [createHeart]);

  return null;
};

// --- Thành phần Hộp ảnh kỷ niệm ---
const PhotoGallery = ({ onClose }) => {
  // Sử dụng 12 ảnh thật của bạn trong thư mục public/anh
  const images = [
    "/anh/z6901028511360_634c24b6a18c45c823c21a36b626712c.jpg",
    "/anh/z6901028513548_6bc036132adacb02df25b01c8e3b7e98.jpg",
    "/anh/z6901028516988_eafaba767efdd4cfa974f47543a4c2e7.jpg",
    "/anh/z6901028523292_4aba787e7b5e917b546e7e6b5d86120a.jpg",
    "/anh/z6901028526036_7ae63c2c0c3c2ca7a0b36b7059e53df2.jpg",
    "/anh/z6901028526962_c39c436b479d7ecab54433688c73d136.jpg",
    "/anh/z6901028527248_e41ecbcde3c4add21c329eb5ebb003da.jpg",
    "/anh/z6901028530042_970c96a0130be25699c30f4fd044400b.jpg",
    "/anh/z6901028534553_aa5e0e57f828ca6675e7598b754ca479.jpg",
    "/anh/z6901028538471_fa4e062ce43d37cdc240d89216e9c9b9.jpg",
    "/anh/z6901028539490_3f813bc1d02889bc7a33f59af7a12dd4.jpg",
    "/anh/z6901028539641_6a7621bbc3ed2d87d43bc05153b515cc.jpg",
    "/anh/z6915849289803_03f4e555ae060f26b667bb72a47341cd.jpg",
  ];

  return (
    <div className="gallery-overlay" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Hộp Kỷ Niệm 📸</h2>
        <div className="gallery-grid">
          {images.map((src, index) => (
            <img key={index} src={src} alt={`Kỷ niệm ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Thành phần Lời chúc với hiệu ứng gõ từng ký tự mượt mà ---
const TypedMessage = ({ messages }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (msgIdx < messages.length) {
      if (charIdx < messages[msgIdx].length) {
        const timeout = setTimeout(() => {
          setCurrentText((prev) => prev + messages[msgIdx][charIdx]);
          setCharIdx((c) => c + 1);
        }, 40); // tốc độ gõ từng ký tự
        return () => clearTimeout(timeout);
      } else {
        // Khi xong một câu, thêm hiệu ứng mờ dần
        setTimeout(() => {
          setDisplayedMessages((prev) => [...prev, currentText]);
          setCurrentText("");
          setMsgIdx((i) => i + 1);
          setCharIdx(0);
        }, 600); // thời gian chờ giữa các câu
      }
    }
  }, [charIdx, msgIdx, messages, currentText]);

  return (
    <div className="message-container">
      {displayedMessages.map((msg, i) => (
        <p key={i} className="typed-line fade-in">
          {msg}
        </p>
      ))}
      {currentText && <p className="typed-line typing">{currentText}</p>}
    </div>
  );
};

function PasswordGate({ onSuccess }) {
  const [values, setValues] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputs = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ];

  useEffect(() => {
    if (values.every((v) => v !== "")) {
      const pass = values.join("");
      if (pass === "2808") {
        onSuccess();
      } else {
        setError("Sai mật khẩu rồi nhé!");
        setValues(["", "", "", ""]);
        inputs[0].current.focus();
      }
    }
  }, [values, onSuccess, inputs]);

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/, "");
    if (val) {
      const newValues = [...values];
      newValues[i] = val;
      setValues(newValues);
      if (i < 3) inputs[i + 1].current.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      inputs[i - 1].current.focus();
    }
  };

  return (
    <div className="password-overlay">
      <div className="password-modal">
        <h2>Nhập mật khẩu để vào trang 🎂</h2>
        <h4>GỢI Ý LÀ NGÀY SINH CỦA AI ĐÓ</h4>
        <div className="iphone-pass">
          {values.map((v, i) => (
            <input
              key={i}
              ref={inputs[i]}
              type="tel" // Đổi từ "password" sang "tel"
              maxLength={1}
              value={v}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="iphone-pass-input"
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <p className="password-error">{error}</p>}
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLetterOpen, setLetterOpen] = useState(false);
  const [audio] = useState(
    new Audio(
      import.meta.env.BASE_URL + "public/nhac/happy-birthday-to-you-370804.mp3"
    )
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Lời chúc để hiển thị
  const wishes =
    "Chúc bbi của anh một tuổi mới... Luôn xinh đẹp, rạng rỡ và ngập tràn hạnh phúc. Cảm ơn em vì đã đến bên anh, và biến mỗi ngày của anh đều trở nên đặc biệt. Yêu bbi nhiều lắm lun aaaaa! ❤️";

  // Chức năng bật/tắt nhạc
  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.loop = true;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleOpenLetter = () => {
    setLetterOpen(true);
    if (!isPlaying) {
      toggleMusic();
    }
  };

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="birthday-container">
      <FallingHearts />

      <div className="content">
        {!isLetterOpen ? (
          <>
            <div className="title-container">
              <h1 className="main-title">Gửi Như Thảo !</h1>
              <p className="subtitle">
                Anh có một món quà nhỏ muốn gửi đến em...
              </p>
            </div>
            <button className="open-letter-btn" onClick={handleOpenLetter}>
              📩 Mở thư
            </button>
          </>
        ) : (
          <div className="letter-content">
            <div className="scroll-paper">
              <h2 className="letter-title">
                Chúc Mừng Sinh Nhật Bé Yêu Của Anh! 🎂
              </h2>
              <TypedMessage messages={[wishes]} />
            </div>

            <button
              className="gallery-button"
              onClick={() => setShowGallery(true)}
            >
              💖 Kỷ niệm chúng mình 💖
            </button>
          </div>
        )}
      </div>

      <button className="music-toggle" onClick={toggleMusic}>
        {isPlaying ? "Tắt nhạc 🔇" : "Bật nhạc 🎵"}
      </button>

      {showGallery && <PhotoGallery onClose={() => setShowGallery(false)} />}
    </div>
  );
}

export default App;
