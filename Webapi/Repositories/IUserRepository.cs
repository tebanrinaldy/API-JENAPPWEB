using Webapi.Models;

namespace Webapi.Repositories
{
    public interface IUserRepository: IRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
    }
}
