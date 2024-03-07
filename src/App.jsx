import { css } from "../styled-system/css";
import { createWorker } from "tesseract.js";
import { useState } from "react";
import { Upload, MoveLeft, Copy } from "lucide-react";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false); // Estado para controlar a exibição do texto
  const [tooltipText, setTooltipText] = useState(""); // Estado para controlar o texto do tooltip
  const [showTooltip, setShowTooltip] = useState(false); // Estado para controlar a exibição do tooltip

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setText(""); // Limpa o texto ao selecionar uma nova imagem
      setShowText(false); // Oculta o texto ao selecionar uma nova imagem
    }
  };

  const recognizeText = async () => {
    // Verifica se já há texto antes de processar novamente
    if (text) return;

    setLoading(true);
    try {
      const worker = await createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const {
        data: { text },
      } = await worker.recognize(selectedImage);
      setText(text);
      setShowText(true); // Exibe o texto após o reconhecimento

      await worker.terminate();
    } catch (error) {
      console.error("Error recognizing text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextClick = () => {
    navigator.clipboard.writeText(text);
    setTooltipText("Texto Copiado"); 
    setShowTooltip(true); 
    setTimeout(() => {
      setShowTooltip(false); 
    }, 1000);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setText(""); // Limpa o texto ao fazer o drop da imagem
      setShowText(false); // Oculta o texto ao fazer o drop da imagem
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleGenerateNewText = () => {
    setSelectedImage(null);
    setText("");
    setShowText(false); // Oculta o texto ao gerar novo texto
  };

  const chooseStyle = css({
    bg: "#ccc3",
    w: "full",
    md: { w: "1/3" },
    h: "300px",
    color: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: "1rem 4rem",
    fontSize: "2xl",
    border: "3px dashed #FF3D00",
    rounded: "2xl",
    cursor: "pointer",
    transition: "background-color .3s ease-in , color .3s ease-out",
    _hover: {
      bg: "#ccc2",
      color: "#f1f1f1",
    },
  });

  return (
    <div className={css({ p: "1rem" })}>
      <div className="loadingText">
        <span>Scanner Image to Text</span>
      </div>
      <main
        className={css({
          h: "screen",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "2.5rem",
            w: "full",
          })}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label htmlFor="img-recognaction" className={chooseStyle}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <Upload
                className={css({
                  bg: "transparent",
                  color: "#FF3D00",
                  w: "35px",
                  h: "35px",
                })}
              />
            )}
          </label>
          <input
            type="file"
            id="img-recognaction"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {loading && <span className="loader"></span>}
          {/* Renderiza o botão apenas se não houver texto */}
          {!text && (
            <button
              onClick={recognizeText}
              disabled={!selectedImage || loading}
              className="button"
            >
              Recognize Text
            </button>
          )}
          {/* Renderiza o texto apenas se houver texto */}
          {showText && (
            <div
              className={css({
                
                  w: "1/2",
                  h: "150px",
                 
               
              })}
            >
              {text}
              <div
                className={css({
                  position: "relative",
                  cursor: "pointer",
                  bg: "transparent",

                })}
                onClick={handleTextClick}
              >
                <Copy
                  className={css({
                    bg: "transparent",
                    cursor: "pointer",
                  })}
                />
                {showTooltip && (
                  <span
                    className={css({
                      position: "absolute",
                      backgroundColor: "#FF3D00",
                      color: "white",
                      fontSize: '12px',
                      padding: "5px",
                      borderRadius: "4px",
                      w:'90px',
                    
                      bottom: "130%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    })}
                  >
                    {tooltipText}
                  </span>
                )}
              </div>
            </div>
          )}
          {/* Renderiza o botão apenas se houver texto */}
          {showText && (
            <button onClick={handleGenerateNewText} className="button">
              <MoveLeft className={css({ bg: "transparent" })} /> Generate New
              Text
            </button>
          )}
           <footer
        className={css({
          fontSize: "18px",
          mt:'50px',
          color: "#fff",
          textAlign: "center",
        })}
      >
        <h1 className={css({})}>
          Made with{" "}
          <span className={css({ color: "#FF3D00", fontSize: "24px" , position: 'fixed' })}>
            {" "}
            &#128148;{" "}
          </span>{" "}
          ve João Fernando
        </h1>
      </footer>
        </div>
        
      </main>
     
    </div>
  );
}

export default App;
