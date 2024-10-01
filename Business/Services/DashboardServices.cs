using AutoMapper;
using Business.Interfaces;
using Entities.Enums;
using Entities.Interfaces;
using Entities.Models;
using Entities.Response;
using Humanizer;
using Lombok.NET;
using MongoDB.Driver;

namespace Business.Services
{
    [AllArgsConstructor]
    public partial class DashboardServices : IDashboardServices
    {
        private readonly IMongoContext _crmContext;
        private readonly IMapper _mapper;

        public async Task<List<DailyOrders>> GetOrdersByDay(int month)
        {
            var filter = Builders<Order>.Filter.And(
                Builders<Order>.Filter.Gte(o => o.OrderDate, new DateTime(DateTime.Now.Year, month, 1)),
                Builders<Order>.Filter.Lte(o => o.OrderDate, new DateTime(DateTime.Now.Year, month, DateTime.DaysInMonth(DateTime.Now.Year, month)).AddDays(1)),
                Builders<Order>.Filter.Ne(o => o.OrderStateId, OrderStatuses.Deleted));

            var orders = _crmContext.Database.GetCollection<Order>(nameof(Order).Pluralize());

            var result = await orders
                .Find(filter)
                .ToListAsync();

            result = _mapper.Map<List<Order>, List<Order>>(result);

            var ordersAgroupedByDay = result.GroupBy(o => o.OrderDate.Day).ToList();

            var dailyOrdersList = new List<DailyOrders>();

            for (int i = 1; i <= DateTime.DaysInMonth(DateTime.Now.Year, month); i++)
            {

                if (ordersAgroupedByDay.All(o => o.Key != i))
                {
                    dailyOrdersList.Add(new DailyOrders
                    {
                        Id = new DayMonth
                        {
                            Day = i,
                            Month = month
                        },
                        TotalOrders = 0,
                        TotalAmount = 0,
                    });
                }
                else
                {
                    var first = ordersAgroupedByDay.First(o => o.Key == i);

                    dailyOrdersList.Add(new DailyOrders
                    {
                        Id = new DayMonth
                        {
                            Day = first.Key,
                            Month = month
                        },
                        TotalOrders = first.Count(),
                        TotalAmount = first.Sum(o => o.Total),
                    });
                }
            }

            return dailyOrdersList;
        }

        public async Task<List<MonthlyOrders>> GetOrdersByMonth(int year)
        {
            var filter = Builders<Order>.Filter.And(
                Builders<Order>.Filter.Gte(o => o.OrderDate, new DateTime(year, 1, 1)),
                Builders<Order>.Filter.Lte(o => o.OrderDate, new DateTime(year, 12, 31)),
                Builders<Order>.Filter.Ne(o => o.OrderStateId, OrderStatuses.Deleted)
            );

            var orders = _crmContext.Database.GetCollection<Order>(nameof(Order).Pluralize());

            var result = await orders.Find(filter).ToListAsync();

            result = _mapper.Map<List<Order>, List<Order>>(result);

            var ordersAgroupedByMonth = result.GroupBy(o => o.OrderDate.Month).ToList();

            var monthlyOrdersList = new List<MonthlyOrders>();

            for (int i = 1; i <= 12; i++)
            {
                if (ordersAgroupedByMonth.All(o => o.Key != i))
                {
                    monthlyOrdersList.Add(new MonthlyOrders
                    {
                        Id = new MonthYear
                        {
                            Month = i,
                            Year = year
                        },
                        TotalOrders = 0,
                        TotalAmount = 0,
                    });
                }
                else
                {
                    var first = ordersAgroupedByMonth.First(o => o.Key == i);

                    monthlyOrdersList.Add(new MonthlyOrders
                    {
                        Id = new MonthYear
                        {
                            Month = first.Key,
                            Year = year
                        },
                        TotalOrders = first.Count(),
                        TotalAmount = first.Sum(o => o.Total),
                    });
                }
            }

            return monthlyOrdersList;
        }
    }
}
