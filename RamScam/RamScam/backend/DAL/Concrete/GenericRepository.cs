using Microsoft.EntityFrameworkCore;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Concrete
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseEntity //:BaseEntity denmesinin sebebi sadece baseentityden tureyen nesnelerde kullanibilir olmasini istememiz
    {
        #region private variables
        private readonly AppDbContext _context;
        private readonly DbSet<TEntity> _dbSet;
        #endregion
        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }
        #region Create
        public async Task CreateAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }
        #endregion

        #region Read
        public async Task<IQueryable<TEntity>> GetAllAsync()
        {
            return  _dbSet.AsQueryable();
        }
        public async Task<IQueryable<TEntity>> GetAllUntrackedAsync()
        {
            return _dbSet.AsNoTracking();
        }

        public async Task<TEntity> GetByIdAsync(int id)
        {
            return await _dbSet
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        
        #endregion

        #region Update
        public async Task UpdateAsync(TEntity entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }
        #endregion

        #region Delete
        public async Task DeleteAsync(int id)
        {
            _dbSet.Remove(await GetByIdAsync(id));
            await _context.SaveChangesAsync();
        }


        #endregion
    }
}
