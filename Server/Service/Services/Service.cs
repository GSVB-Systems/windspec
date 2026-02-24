using Contracts.Models;
using Service.Interfaces;
using Sieve.Models;

namespace Service.Services;

public class Service<T, TCreate, TUpdate>: IService<T, TCreate, TUpdate>
    where T : class
    where TCreate : class
    where TUpdate : class
{
    public Task<T?> GetByIdAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<PagedResult<T>> GetAllAsync(SieveModel? parameters)
    {
        throw new NotImplementedException();
    }

    public Task<T> CreateAsync(TCreate createDto)
    {
        throw new NotImplementedException();
    }

    public Task<T?> UpdateAsync(string id, TUpdate updateDto)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(string id)
    {
        throw new NotImplementedException();
    }
}