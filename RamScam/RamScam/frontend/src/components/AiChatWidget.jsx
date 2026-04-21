import { useState, useEffect } from 'react';
import './AiChatWidget.css'; // Stil dosyasını içeri aktaralım

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(false);

  // Widget ilk açıldığında veya buton basıldığında backendden yeni bir fun fact (ilginç bilgi) çeker.
  const fetchFunFact = async () => {
    setLoading(true);
    try {
      // Senin yazdığın .NET Minimal API'ye (Köprüye) istek atıyor
      const response = await fetch("https://localhost:50793/funfact/get-fact");

      if (!response.ok) {
        throw new Error("API'den yanıt alınamadı");
      }

      const data = await response.json();
      console.log("Backendden Gelen Veri:", data); // Sıkıntıyı görmek için konsola basalım
      setFact(data.fact);
    } catch (error) {
      console.error("Fun fact çekilirken hata oluştu:", error);
      setFact("Şu an şans melekleri meşgul, yeni bilgi alamadık. Lütfen tekrar dene!");
    } finally {
      setLoading(false);
    }
  };

  // Sohbet penceresi her açıldığında yeni bir bilgi getir
  useEffect(() => {
    if (isOpen && !fact) {
      fetchFunFact();
    }
  }, [isOpen, fact]);

  return (
    <div className="ai-chat-container">
      {/* Eğer widget kapalıysa, sağ altta sadece "AI Asistan" butonu/ikonu göstersin */}
      {!isOpen && (
        <button 
          className="ai-chat-open-btn" 
          onClick={() => setIsOpen(true)}
        >
          🤖 Şans Asistanı
        </button>
      )}

      {/* Widget açıksa, fun fact kutusunu göster */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <h4>🎲 RamScam AI Asistan</h4>
            <button 
              className="ai-chat-close-btn" 
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-chat-body">
            {loading ? (
              <div className="loading-spinner">Bilgiler toplanıyor...</div>
            ) : (
              <p className="ai-chat-message">
                <strong>Biliyor muydun?</strong> <br/><br/>
                {fact}
              </p>
            )}
          </div>

          <div className="ai-chat-footer">
            <button 
              className="ai-chat-new-fact-btn" 
              onClick={fetchFunFact} 
              disabled={loading}
            >
              Başka bir bilgi ver!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}