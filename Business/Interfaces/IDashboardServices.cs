using Entities.Response;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface IDashboardServices
    {
        public Task<List<MonthlyOrders>> GetOrdersByMonth(int year);

        public Task<List<DailyOrders>> GetOrdersByDay(int month);
    }
}
