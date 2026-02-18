"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  Award,
  GraduationCap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

:root {
  --blue-primary:  #1b396a;
  --blue-dark:     #142a50;
  --blue-hover:    #8eafef;
  --blue-light:    #e8eef8;
  --blue-mid:      #c8d8f0;
  --yellow-accent: #fe9e10;
  --yellow-dark:   #d4800a;
  --yellow-light:  #fff4e0;
  --white:         #ffffff;
  --text-dark:     #333333;
  --txt2:          #5a6a85;
  --txt3:          #9aaabe;
  --bg:            #f0f4fb;
  --card:          #ffffff;
  --card2:         #f5f8ff;
  --brd:           #dce5f5;
  --sh-sm: 0 1px 4px rgba(27,57,106,.07);
  --sh-md: 0 4px 20px rgba(27,57,106,.12);
  --sh-lg: 0 10px 40px rgba(27,57,106,.16);
  --r-sm:10px; --r-md:16px; --r-lg:22px; --r-xl:28px;
  --g-primary: linear-gradient(135deg,#2d5ba8,#1b396a);
  --g-yellow:  linear-gradient(135deg,#ffbe57,#fe9e10);
  --g-hover:   linear-gradient(135deg,#b8cef6,#8eafef);
  --g-dark:    linear-gradient(135deg,#2d5ba8,#142a50);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.db{
  font-family:'Montserrat',sans-serif;
  color:var(--text-dark);min-height:100vh;
  background:var(--bg);
  background-image:
    radial-gradient(ellipse at 8% 55%,rgba(142,175,239,.13) 0%,transparent 55%),
    radial-gradient(ellipse at 92% 12%,rgba(254,158,16,.08) 0%,transparent 50%),
    radial-gradient(ellipse at 50% 92%,rgba(27,57,106,.06) 0%,transparent 50%);
  padding:2rem 2.5rem;
}
.db-main{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:1.75rem;}

.db-loading{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:var(--bg);font-family:'Montserrat',sans-serif;
}
.db-spinner-wrap{text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem;}
.db-spinner{
  width:52px;height:52px;border-radius:50%;
  border:4px solid var(--blue-mid);border-top-color:var(--blue-primary);
  animation:db-spin .75s linear infinite;
}
@keyframes db-spin{to{transform:rotate(360deg);}}
.db-loading p{color:var(--txt2);font-size:.9375rem;font-weight:500;}

.db-header{
  background:transparent;
  padding:.5rem 0 .25rem;
  display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
}
.db-header-date{font-size:.75rem;color:var(--txt3);margin-bottom:.35rem;letter-spacing:.4px;font-weight:600;text-transform:uppercase;}
.db-header h2{font-size:1.875rem;font-weight:800;color:var(--blue-primary);letter-spacing:-.5px;margin-bottom:.3rem;}
.db-header p{color:var(--txt2);font-size:.875rem;font-weight:500;}
.db-header-logo{
  width:72px;height:72px;object-fit:contain;flex-shrink:0;
  background:var(--card);border-radius:var(--r-md);padding:.5rem;
  border:1px solid var(--brd);box-shadow:var(--sh-sm);
}

.db-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;}
.db-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem;}

.db-stat{
  background:var(--card);border-radius:var(--r-lg);
  padding:1.5rem 1.75rem;border:1px solid var(--brd);
  box-shadow:var(--sh-sm);
  transition:box-shadow .25s,transform .25s;
  display:flex;flex-direction:column;gap:.5rem;
  position:relative;overflow:hidden;
}
.db-stat:hover{box-shadow:var(--sh-md);transform:translateY(-3px);}
.db-stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  border-radius:var(--r-lg) var(--r-lg) 0 0;
}
.db-stat.s-primary::before { background:var(--g-primary); }
.db-stat.s-yellow::before  { background:var(--g-yellow); }
.db-stat.s-hover::before   { background:var(--g-hover); }
.db-stat.s-dark::before    { background:var(--g-dark); }

.db-stat-icon{
  width:42px;height:42px;border-radius:var(--r-sm);
  display:flex;align-items:center;justify-content:center;margin-bottom:.25rem;
}
.ic-primary { background:var(--blue-light);  color:var(--blue-primary); }
.ic-yellow  { background:var(--yellow-light); color:var(--yellow-dark); }
.ic-hover   { background:#eaf0fb;             color:#3a6bbf; }
.ic-dark    { background:var(--blue-light);   color:var(--blue-dark); }

.db-stat-val{font-size:2.125rem;font-weight:800;color:var(--blue-primary);line-height:1;}
.db-stat-lbl{font-size:.8rem;font-weight:600;color:var(--txt2);}
.db-stat-sub{font-size:.75rem;color:var(--txt3);margin-top:.1rem;font-weight:500;}

.db-charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}

.db-chart-card{
  background:var(--card);border-radius:var(--r-xl);
  padding:1.75rem 2rem;border:1px solid var(--brd);
  box-shadow:var(--sh-sm);transition:box-shadow .25s;
}
.db-chart-card:hover{box-shadow:var(--sh-md);}

.db-chart-title{display:flex;align-items:center;gap:.5rem;margin-bottom:1.5rem;}
.db-chart-title h3{font-size:.9375rem;font-weight:700;color:var(--blue-primary);}
.db-chart-icon{
  width:32px;height:32px;border-radius:var(--r-sm);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}

.db-donut-wrap{display:flex;align-items:center;gap:1.5rem;}
.db-legend{display:flex;flex-direction:column;gap:.625rem;flex:1;}
.db-legend-item{display:flex;align-items:center;gap:.5rem;}
.db-legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.db-legend-label{font-size:.78rem;color:var(--txt2);font-weight:600;flex:1;}
.db-legend-val{font-size:.8125rem;font-weight:800;color:var(--blue-primary);}

.db-total-box{
  margin-top:1rem;padding:.875rem 1rem;
  background:var(--blue-light);border-radius:var(--r-sm);border:1px solid var(--blue-mid);
}
.db-total-box .tbl{font-size:.72rem;color:var(--txt2);margin-bottom:.2rem;font-weight:600;text-transform:uppercase;letter-spacing:.3px;}
.db-total-box .tbv{font-size:1.375rem;font-weight:800;color:var(--blue-primary);}
.db-total-box .tbs{font-size:.72rem;color:var(--txt3);font-weight:500;}

.db-tip{
  background:var(--white);border:1.5px solid var(--brd);border-radius:var(--r-sm);
  padding:.625rem 1rem;box-shadow:var(--sh-md);
  font-family:'Montserrat',sans-serif;font-size:.8rem;
}
.db-tip-label{font-weight:700;color:var(--blue-primary);margin-bottom:.2rem;}
.db-tip-val{color:var(--txt2);font-weight:500;}

@media(max-width:1024px){
  .db-grid-4{grid-template-columns:repeat(2,1fr);}
  .db-charts-grid{grid-template-columns:1fr;}
}
@media(max-width:600px){
  .db{padding:1rem;}
  .db-grid-4,.db-grid-2,.db-charts-grid{grid-template-columns:1fr;}
  .db-header{flex-direction:column;align-items:flex-start;}
  .db-header h2{font-size:1.375rem;}
  .db-donut-wrap{flex-direction:column;}
}
`;

const C_TIPO = ["#1b396a", "#8eafef", "#fe9e10", "#c8d8f0"];
const C_SEXO = ["#1b396a", "#fe9e10"];
const C_GROUP = ["#1b396a", "#8eafef"];
const BAR_COL = "#8eafef";

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tip">
      <p className="db-tip-label">{label ?? payload[0]?.name}</p>
      <p className="db-tip-val">{payload[0]?.value} estudiantes</p>
    </div>
  );
};

const Donut = ({ data, colors, height = 190 }) => (
  <ResponsiveContainer width={height} height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={height * 0.27}
        outerRadius={height * 0.43}
        paddingAngle={3}
        dataKey="cantidad"
        strokeWidth={0}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i % colors.length]} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          background: "#fff",
          border: "1.5px solid #dce5f5",
          borderRadius: 10,
          fontFamily: "Montserrat",
          fontSize: 12,
          boxShadow: "0 4px 20px rgba(27,57,106,.12)",
        }}
        formatter={(v, n) => [v, n]}
      />
    </PieChart>
  </ResponsiveContainer>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActividades: 0,
    totalEstudiantes: 0,
    totalHombres: 0,
    totalMujeres: 0,
    primerSemestre: 0,
    segundoSemestreEnAdelante: 0,
  });
  const [dataTipo, setDataTipo] = useState([]);
  const [dataSexo, setDataSexo] = useState([]);
  const [dataSem, setDataSem] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const obtenerTipo = (cod, nom, des) => {
    const up = `${nom || ""} ${des || ""}`.toUpperCase();
    if ((cod || "").toUpperCase() === "D") return "DEPORTIVA";
    if (
      [
        "FUTBOL",
        "SOCCER",
        "VOLEIBOL",
        "VOLLEYBALL",
        "BEISBOL",
        "BASEBALL",
        "SOFTBOL",
        "SOFTBALL",
        "BASQUETBOL",
        "BASKETBALL",
        "ATLETISMO",
        "NATACION",
        "SWIMMING",
        "TENIS",
        "TENNIS",
        "AJEDREZ",
        "CHESS",
      ].some((p) => up.includes(p))
    )
      return "DEPORTIVA";
    if (
      [
        "TUTORIA",
        "TALLER TALENTO",
        "TICS",
        "TECNOLOGIA",
        "CONGRESO",
        "INVESTIGACION",
        "RALLY",
      ].some((p) => up.includes(p))
    )
      return "OTRA";
    if (
      [
        "ACT CIVICAS",
        "ACTIVIDAD CIVICA",
        "ESCOLTA",
        "CENTRO DE ACOPIO",
        "CARRERA ALBATROS",
      ].some((p) => up.includes(p))
    )
      return "CIVICA";
    if (
      [
        "ACT CULTURALES",
        "ACT ARTISTICAS",
        "MUSICA",
        "DANZA",
        "ARTES VISUALES",
        "ALTAR",
        "CLUB DE LECTURA",
        "BANDA DE GUERRA",
      ].some((p) => up.includes(p))
    )
      return "CULTURAL";
    if ((cod || "").toUpperCase() === "C") return "CULTURAL";
    return "OTRA";
  };

  const cargar = async () => {
    const df = {
      totalActividades: 0,
      totalEstudiantes: 0,
      totalHombres: 0,
      totalMujeres: 0,
      primerSemestre: 0,
      segundoSemestreEnAdelante: 0,
    };
    try {
      setLoading(true);

      const r1 = await fetch("/api/act-disponibles", { cache: "no-store" });
      if (!r1.ok) throw new Error("Error al cargar actividades");
      const ofertas = await r1.json();
      if (!Array.isArray(ofertas)) {
        setStats(df);
        return;
      }

      const r2 = await fetch("/api/inscripciones", { cache: "no-store" });

      // ✅ NO lanzar error — normalizar a array vacío si falla
      const raw = r2.ok ? await r2.json() : [];
      if (!r2.ok) {
        console.warn(
          "⚠️ API inscripciones respondió:",
          r2.status,
          "— mostrando solo actividades",
        );
      }
      const ins = Array.isArray(raw) ? raw : [];
      console.log("📊 Inscripciones cargadas:", ins.length);

      const insPorAct = {};
      ins.forEach((i) => {
        const id = i?.actividadId;
        if (id) {
          insPorAct[id] = insPorAct[id] || [];
          insPorAct[id].push(i);
        }
      });

      const aT = {
        CIVICA: new Set(),
        CULTURAL: new Set(),
        DEPORTIVA: new Set(),
        OTRA: new Set(),
      };
      ofertas.forEach((o) => {
        const lista = insPorAct[o.actividadId] || [];
        const tipo = obtenerTipo(
          o.actividad?.aticve,
          o.actividad?.aconco,
          o.actividad?.acodes,
        );
        if (lista.length) aT[tipo].add(o.actividadId);
      });

      // Deduplicar estudiantes por aluctr
      const estudiantesMap = new Map();
      ins.forEach((i) => {
        const ctrl = i.estudiante?.aluctr;
        if (!ctrl) return;
        if (!estudiantesMap.has(ctrl)) {
          const sexo = i.estudiante?.alusex;
          // ✅ calnpe primero — igual que login/perfil
          const semRaw = i.estudiante?.calnpe ?? i.estudiante?.alusme;
          const sem = semRaw != null ? semRaw.toString() : "N/A";
          estudiantesMap.set(ctrl, { sexo, sem });
        }
      });

      const uAll = new Set();
      const uSexo = { M: new Set(), F: new Set() };
      let porSem = {},
        prim = 0,
        seg = 0;

      estudiantesMap.forEach(({ sexo, sem }, ctrl) => {
        uAll.add(ctrl);
        if (sexo === 1) uSexo.M.add(ctrl);
        else if (sexo === 2) uSexo.F.add(ctrl);
        if (sem !== "N/A") {
          porSem[sem] = (porSem[sem] || 0) + 1;
          const n = parseInt(sem);
          if (n === 1) prim++;
          else if (n >= 2 && !isNaN(n)) seg++;
        }
      });

      setStats({
        totalActividades: ofertas.length,
        totalEstudiantes: uAll.size,
        totalHombres: uSexo.M.size,
        totalMujeres: uSexo.F.size,
        primerSemestre: prim,
        segundoSemestreEnAdelante: seg,
      });
      setDataTipo([
        { nombre: "Cívicas", cantidad: aT.CIVICA.size },
        { nombre: "Culturales", cantidad: aT.CULTURAL.size },
        { nombre: "Deportivas", cantidad: aT.DEPORTIVA.size },
        { nombre: "Otras", cantidad: aT.OTRA.size },
      ]);
      setDataSexo([
        { nombre: "Hombres", cantidad: uSexo.M.size },
        { nombre: "Mujeres", cantidad: uSexo.F.size },
      ]);
      setDataSem(
        Object.entries(porSem)
          .filter(([k]) => !k.includes("-") && !isNaN(parseInt(k)))
          .map(([s, c]) => ({ semestre: `${s}°`, cantidad: c }))
          .sort((a, b) => parseInt(a.semestre) - parseInt(b.semestre)),
      );
      setDataGroup([
        { nombre: "1er Semestre", cantidad: prim },
        { nombre: "2do Semestre+", cantidad: seg },
      ]);
    } catch (e) {
      console.error("❌ Error en cargar:", e);
      setStats(df);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="db-loading">
        <style>{CSS}</style>
        <div className="db-spinner-wrap">
          <div className="db-spinner" />
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );

  return (
    <div className="db">
      <style>{CSS}</style>
      <main className="db-main">
        <div className="db-header">
          <div>
            <p className="db-header-date">
              {new Date().toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h2>Estadísticas de Inscripciones</h2>
            <p>Datos en tiempo real · Actividades extraescolares</p>
          </div>
          <img
            src="/imagenes/logosin.gif"
            alt="Logo"
            className="db-header-logo"
          />
        </div>

        <div className="db-grid-4">
          <div className="db-stat s-primary">
            <div className="db-stat-icon ic-primary">
              <Calendar size={20} />
            </div>
            <div className="db-stat-val">{stats.totalActividades}</div>
            <div className="db-stat-lbl">Actividades Ofertadas</div>
          </div>
          <div className="db-stat s-yellow">
            <div className="db-stat-icon ic-yellow">
              <Users size={20} />
            </div>
            <div className="db-stat-val">{stats.totalEstudiantes}</div>
            <div className="db-stat-lbl">Total Inscritos</div>
          </div>
          <div className="db-stat s-hover">
            <div className="db-stat-icon ic-hover">
              <Users size={20} />
            </div>
            <div className="db-stat-val">{stats.totalHombres}</div>
            <div className="db-stat-lbl">Hombres</div>
          </div>
          <div className="db-stat s-dark">
            <div className="db-stat-icon ic-dark">
              <Users size={20} />
            </div>
            <div className="db-stat-val">{stats.totalMujeres}</div>
            <div className="db-stat-lbl">Mujeres</div>
          </div>
        </div>

        <div className="db-grid-2">
          <div className="db-stat s-primary">
            <div className="db-stat-icon ic-primary">
              <GraduationCap size={20} />
            </div>
            <div className="db-stat-val">{stats.primerSemestre}</div>
            <div className="db-stat-lbl">Estudiantes 1er Semestre</div>
            <div className="db-stat-sub">Alumnos de nuevo ingreso</div>
          </div>
          <div className="db-stat s-yellow">
            <div className="db-stat-icon ic-yellow">
              <GraduationCap size={20} />
            </div>
            <div className="db-stat-val">{stats.segundoSemestreEnAdelante}</div>
            <div className="db-stat-lbl">Estudiantes 2do Semestre+</div>
            <div className="db-stat-sub">Del 2° al 12° semestre</div>
          </div>
        </div>

        <div className="db-charts-grid">
          <div className="db-chart-card">
            <div className="db-chart-title">
              <div className="db-chart-icon ic-primary">
                <Award size={16} />
              </div>
              <h3>Actividades por Tipo</h3>
            </div>
            <div className="db-donut-wrap">
              <Donut
                data={dataTipo.map((d) => ({ ...d, name: d.nombre }))}
                colors={C_TIPO}
              />
              <div className="db-legend">
                {dataTipo.map((d, i) => (
                  <div key={i} className="db-legend-item">
                    <div
                      className="db-legend-dot"
                      style={{ background: C_TIPO[i] }}
                    />
                    <span className="db-legend-label">{d.nombre}</span>
                    <span className="db-legend-val">{d.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="db-chart-card">
            <div className="db-chart-title">
              <div className="db-chart-icon ic-yellow">
                <Users size={16} />
              </div>
              <h3>Estudiantes por Género</h3>
            </div>
            <div className="db-donut-wrap">
              <Donut
                data={dataSexo.map((d) => ({ ...d, name: d.nombre }))}
                colors={C_SEXO}
              />
              <div className="db-legend">
                {dataSexo.map((d, i) => (
                  <div key={i} className="db-legend-item">
                    <div
                      className="db-legend-dot"
                      style={{ background: C_SEXO[i] }}
                    />
                    <span className="db-legend-label">{d.nombre}</span>
                    <span className="db-legend-val">{d.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="db-charts-grid">
          <div className="db-chart-card">
            <div className="db-chart-title">
              <div className="db-chart-icon ic-hover">
                <GraduationCap size={16} />
              </div>
              <h3>Estudiantes por Semestre</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={dataSem}
                barCategoryGap="38%"
                margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#dce5f5"
                  vertical={false}
                />
                <XAxis
                  dataKey="semestre"
                  tick={{
                    fontSize: 11,
                    fill: "#5a6a85",
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: "#9aaabe",
                    fontFamily: "Montserrat",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<Tip />}
                  cursor={{ fill: "rgba(27,57,106,.05)" }}
                />
                <Bar dataKey="cantidad" fill={BAR_COL} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="db-chart-card">
            <div className="db-chart-title">
              <div className="db-chart-icon ic-primary">
                <TrendingUp size={16} />
              </div>
              <h3>1er Semestre vs 2do+</h3>
            </div>
            <div className="db-donut-wrap">
              <Donut
                data={dataGroup.map((d) => ({ ...d, name: d.nombre }))}
                colors={C_GROUP}
              />
              <div className="db-legend">
                {dataGroup.map((d, i) => (
                  <div key={i} className="db-legend-item">
                    <div
                      className="db-legend-dot"
                      style={{ background: C_GROUP[i] }}
                    />
                    <span className="db-legend-label">{d.nombre}</span>
                    <span className="db-legend-val">{d.cantidad}</span>
                  </div>
                ))}
                <div className="db-total-box">
                  <p className="tbl">Total</p>
                  <p className="tbv">
                    {dataGroup.reduce((s, d) => s + d.cantidad, 0)}
                  </p>
                  <p className="tbs">estudiantes registrados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
