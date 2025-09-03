# Sistema de Gestión de Estudiantes

## 📖 Descripción del Proyecto

Sistema web desarrollado para la gestión de información de estudiantes universitarios, incluyendo datos personales, carreras y autenticación. El proyecto utiliza tecnologías modernas como Prisma ORM, Supabase y Visual Studio con JavaScript.

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js con Prisma ORM
- **Base de Datos**: PostgreSQL (Supabase)
- **Frontend**: HTML, CSS, JavaScript
- **Herramientas**: Visual Studio, npm

## 📋 Características

- ✅ Gestión de información de estudiantes
- ✅ Sistema de autenticación
- ✅ Relación estudiantes-carreras
- ✅ Interfaz de usuario intuitiva
- ✅ Base de datos con más de 15,000 registros reales

## 🗃️ Estructura de la Base de Datos

### Tablas Principales:

1. **estudiantes**
   - Información personal completa de estudiantes
   - Clave primaria: `aluctr` (número de control)
   - Campos: nombre, apellidos, datos personales, contacto

2. **carrera**
   - Catálogo de carreras disponibles
   - Clave primaria: `carcve` (código de carrera)
   - Campos: `carnom` (nombre de carrera), detalles académicos

3. **estudicarr**
   - Tabla de relación estudiantes-carreras
   - Permite múltiples carreras por estudiante
   - Claves foráneas: `aluctr`, `carcve`

4. **authStudents**
   - Sistema de autenticación
   - Relación con estudiantes mediante matrícula

### Relaciones:
- Un estudiante puede tener múltiples carreras
- Una carrera puede tener múltiples estudiantes
- Relación muchos a muchos a través de `estudicarr`

## ⚙️ Configuración e Instalación

### Prerrequisitos:
- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación:

1. **Clonar el repositorio:**
   ```bash
   git clone [url-del-repositorio]
   cd sistema-estudiantes
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   # Supabase Database URLs
   DATABASE_URL="postgresql://[usuario]:[password]@aws-0-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://[usuario]:[password]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
   
   # Opcional: otras variables de entorno
   JWT_SECRET="tu-clave-secreta"
   PORT=3000
   ```

4. **Sincronizar base de datos:**
   ```bash
   npx prisma db push
   ```

5. **Generar cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

6. **Iniciar el servidor:**
   ```bash
   npm start
   # o
   npm run dev
   ```

## 📂 Estructura del Proyecto

```
proyecto/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.js               # Datos de prueba (opcional)
├── src/
│   ├── controllers/          # Lógica de negocio
│   ├── routes/              # Rutas de la API
│   ├── middleware/          # Middleware personalizado
│   └── utils/               # Utilidades
├── public/
│   ├── css/                 # Estilos
│   ├── js/                  # JavaScript frontend
│   └── index.html           # Página principal
├── .env                     # Variables de entorno
├── package.json             # Dependencias del proyecto
└── README.md               # Este archivo
```

## 🔧 Configuración de Base de Datos

### Nota Técnica:

Este proyecto utiliza `prisma db push` en lugar del sistema tradicional de migraciones debido a:

- **Base de datos existente**: Contiene más de 15,000 registros reales importados desde archivos CSV
- **Preservación de datos críticos**: Los datos no pueden perderse durante el desarrollo
- **Compatibilidad con Supabase**: Optimizado para trabajar con Supabase PostgreSQL
- **Enfoque pragmático**: Adecuado para desarrollo universitario y prototipado rápido

### Comandos Útiles:

```bash
# Sincronizar cambios del schema
npx prisma db push

# Generar cliente actualizado
npx prisma generate

# Visualizar base de datos
npx prisma studio

# Ver estado del schema
npx prisma db pull
```

## 🚀 Uso del Sistema

### Funcionalidad Principal:

Al hacer login, el sistema muestra:

```
Bienvenido [Nombre del Estudiante]
Número de control: [número de control]
Carrera: [nombre de la carrera]
```

### Ejemplo de consulta:

```javascript
// Obtener información completa del estudiante
const estudiante = await prisma.estudiantes.findUnique({
  where: { aluctr: '21760458' },
  include: {
    carreras: {
      include: {
        carrera: {
          select: { carnom: true }
        }
      }
    }
  }
});

// Construir mensaje de bienvenida
const nombreCompleto = `${estudiante.alunom} ${estudiante.aluapp} ${estudiante.aluapm}`.trim();
const carrera = estudiante.carreras[0]?.carrera?.carnom || 'Sin carrera';
```

## 🔐 Sistema de Autenticación

- Tabla `authStudents` para credenciales
- Campo `matricula` conecta con `aluctr` de estudiantes
- Verificación de contraseñas hasheadas
- Sistema de códigos de verificación por email

## 📊 Datos del Sistema

- **15,000+ registros** de estudiantes reales
- Datos importados desde archivos CSV institucionales
- Información completa: personal, académica y de contacto
- Catálogo completo de carreras universitarias

## 🐛 Solución de Problemas

### Error de conexión a Supabase:
```bash
# Verificar variables de entorno
echo $DATABASE_URL

# Probar conexión
npx prisma db pull
```

### Error de schema desincronizado:
```bash
# Re-sincronizar
npx prisma db push --force-reset  # ⚠️ Solo en desarrollo
```

### Problemas con el cliente Prisma:
```bash
# Limpiar y regenerar
rm -rf node_modules/.prisma
npx prisma generate
```

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Frida Arroyo y Aileen Cruz]
- **Institución**: [Instituto Tecnologico de Ensenada]
- **Asesor**: [Antonio Macklish]

## 📝 Notas del Proyecto

### Decisiones Técnicas:

1. **Uso de `db push`**: Elegido por compatibilidad con datos existentes
2. **Estructura de relaciones**: Diseñada para flexibilidad (múltiples carreras por estudiante)
3. **Preservación de datos**: Prioridad en mantener los 15,000 registros existentes

### Futuras Mejoras:

- [ ] Implementar sistema de roles
- [ ] Añadir reportes en PDF
- [ ] Crear dashboard administrativo
- [ ] Implementar notificaciones
- [ ] Añadir exportación de datos

## 📄 Licencia

Este proyecto es desarrollado con fines académicos para el Instituto Tecnologico de Ensenada.

---

## 🆘 Soporte

Para dudas o problemas:
- 📧 Email: [al21760457@ite.edu.mx]
- 📱 WhatsApp: []
- 🐙 GitHub Issues: [url-del-repositorio/issues]

---

**Última actualización**: [2/09/2025]