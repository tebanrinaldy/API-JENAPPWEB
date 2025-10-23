using Webapi.Data;
using Microsoft.EntityFrameworkCore;
using Webapi.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 🔗 Conexión a la base de datos
var cadenaconexion = builder.Configuration.GetConnectionString("CadenaConexionDB");
builder.Services.AddDbContext<Connectioncontextdb>(options =>
    options.UseSqlServer(cadenaconexion));

// 🌐 CORS para permitir peticiones desde tu frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // Cambia esto si tu frontend está en Render
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// 🧩 Servicios y controladores
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

var app = builder.Build();

// 🚀 Activar Swagger SIEMPRE (no solo en desarrollo)
app.UseSwagger();
app.UseSwaggerUI();

// 🔐 Seguridad y CORS
// app.UseHttpsRedirection(); // Puedes activarlo si usas HTTPS
app.UseCors("AllowReactApp");
app.UseAuthorization();

// 🧭 Activar rutas de controladores
app.MapControllers();

app.Run();
