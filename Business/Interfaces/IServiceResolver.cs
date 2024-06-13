using Entities.Models;
using Entities.Request;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface IServiceResolver
    {
        dynamic GetService(string catalogue);
    }
}
