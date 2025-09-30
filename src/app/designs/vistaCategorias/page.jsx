"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  Clock,
  Code,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Timer,
  Terminal,
  Star,
  Code2,
  Inbox,
} from "lucide-react";
import NavbarEst from "@/app/components/navbares";
import "./eventos.css";

const Card = ({ item, isSelected, onClick }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    onClick={() => onClick(item)}
  >
    <div className="card-header">
      <BookOpen className="icon" /> Asignatura
    </div>
    <h3>{item.actividad.acodes}</h3>
    <p className="description">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam amet dolor
      ipsam porro obcaecati iste placeat rerum atque iusto, sapiente ex ipsa
      molestias distinctio reprehenderit dolorum tenetur expedita doloribus cum.
    </p>
    <div className="card-footer">
      <span>
        <Inbox className="badge" />
        informacion
      </span>
    </div>
  </div>
);

const OfferModal = ({ item, onClose }) => {
  const handleRegister = () => {
    console.log(`Registro confirmado para ${item.actividad.aticve}`);
    setTimeout(onClose, 500);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X />
        </button>
        {item.actividad.image && (
          <img src={item.actividad.image} alt={item.actividad.aticve} />
        )}
        <h2>{item.actividad.acodes}</h2>
        <div className="modal-content">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad unde
            quis libero quam suscipit aliquid aspernatur eveniet, recusandae
            perferendis praesentium vel asperiores velit nam, laudantium quos
            inventore voluptate placeat accusamus.
          </p>
          <div className="info-grid">
            <p>
              <Timer /> Horas: {item.actividad.acohrs}
            </p>
            <p>
              <Code2 /> Código: {item.actividad.acocve}
            </p>
            <p>
              <Star /> Créditos: {item.actividad.acocre}
            </p>
          </div>
        </div>
        <button className="register-btn" onClick={handleRegister}>
          Registrarme
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const carouselRef = useRef(null);
  const API_URL = "/api/act-disponibles";

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setOfertas(data);
      } catch (e) {
        setOfertas([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setSelectedId(item.id);
  };
  const handleClose = () => {
    setSelectedItem(null);
    setSelectedId(null);
  };

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape" && selectedItem) handleClose();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [selectedItem]);

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const amt = dir === "left" ? -408 : 408;
      carouselRef.current.scrollBy({ left: amt, behavior: "smooth" });
    }
  };

  return (
    <div className="dashboard-container">
      <NavbarEst />
      <main className="dashboard-main">
        <h1>Ofertas del Semestre</h1>
        <p className="subtitle">
          Explora las actividades que tenemos para ti, elige la que más te guste
          y regístrate
        </p>

        {loading ? (
          <p>Cargando...</p>
        ) : ofertas.length === 0 ? (
          <p>No hay ofertas</p>
        ) : (
          <div className="carousel-container">
            <button
              className="carousel-btn left"
              onClick={() => scrollCarousel("left")}
            >
              <ChevronLeft />
            </button>
            <div ref={carouselRef} className="carousel">
              {ofertas.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={handleOpen}
                />
              ))}
            </div>
            <button
              className="carousel-btn right"
              onClick={() => scrollCarousel("right")}
            >
              <ChevronRight />
            </button>
          </div>
        )}

        {selectedItem && (
          <OfferModal item={selectedItem} onClose={handleClose} />
        )}
      </main>
    </div>
  );
}
