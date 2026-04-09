using RamScam.backend.DAL.Entities;

namespace RamScam.backend.DAL.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        /// <summary>
        /// @brief returns all entities as queryable
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<TEntity>> GetAllAsync(); //uses IEnumarable because of we want to take all the data to the memory when data is so big and u want to filter that data u could use IQueryable


        /// <summary>
        /// @brief returns requested entity as entity
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<TEntity?> GetByIdAsync(int requestedEntitiesId);

        /// <summary>
        /// @brief creates new entity in database 
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Task CreateAsync(TEntity entityToCreate);


        /// <summary>
        /// @brief updates entity in database by Id. it has entity parametere because of generic pattern
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        Task UpdateAsync(TEntity entityToPutAsCurrent);

        /// <summary>
        /// @brief deletes entity from database by Id. it has entity parametere because of generic pattern
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteAsync(int entityIdToDelete);
    }
}
