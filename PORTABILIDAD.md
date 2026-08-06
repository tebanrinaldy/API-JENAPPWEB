# Prueba de portabilidad JenApp

## Requisitos

- .NET SDK 8 o superior.
- Node.js 20.19 o superior.
- SQL Server accesible desde el backend.
- Opcional: Ollama si se va a usar el chat.

## Backend

Restaurar y compilar:

```powershell
dotnet restore Webapi.sln
dotnet build Webapi.sln --no-restore
```

Publicar:

```powershell
dotnet publish Webapi\Webapi.csproj -c Release -o Webapi\bin\publish
```

Configurar la base de datos por variable de entorno:

```powershell
$env:ConnectionStrings__CadenaConexionDB="Server=localhost\SQLEXPRESS;Database=PersonasDB;Trusted_Connection=True;TrustServerCertificate=True"
```

Configurar Ollama si no usa el valor local por defecto:

```powershell
$env:Ollama__BaseUrl="http://localhost:11434"
```

Para publicar el frontend en otro dominio, declare los orígenes permitidos para CORS:

```powershell
$env:Cors__AllowedOrigins__0="https://tu-dominio.com"
```

Restaurar herramientas EF y aplicar migraciones en una base nueva:

```powershell
dotnet tool restore
dotnet tool run dotnet-ef database update --project Webapi\Webapi.csproj
```

Levantar API publicado:

```powershell
$env:ASPNETCORE_URLS="http://127.0.0.1:5132"
dotnet Webapi\bin\publish\Webapi.dll
```

Verificar:

- `http://127.0.0.1:5132/swagger/index.html`
- `http://127.0.0.1:5132/api/categories`

## Frontend

Crear `React\.env` desde el ejemplo:

```powershell
Copy-Item React\.env.example React\.env
```

Cambiar `VITE_API_URL` si el API esta en otra URL:

```env
VITE_API_URL=http://127.0.0.1:5132
```

Instalar, validar y compilar:

```powershell
cd React
npm ci
npm run lint
npm run build
npm run preview
```

## Nota sobre la base local

La base local `PersonasDB` puede tener tablas creadas con migraciones antiguas que ya no estan en este repo. Para una prueba limpia de portabilidad, usar una base vacia y aplicar las migraciones actuales del proyecto.
