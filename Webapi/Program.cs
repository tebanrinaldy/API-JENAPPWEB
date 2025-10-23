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
    options.AddPolicy("PermitirTodo", policy =>
    {
        policy
            .AllowAnyOrigin() 
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// 🧩 Servicios y controladores
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.WebHost.UseUrls("http://localhost:5132", "http://192.168.1.39:5132");
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("PermitirTodo");

app.UseAuthorization();

// 🧭 Activar rutas de controladores
app.MapControllers();

app.Run();
