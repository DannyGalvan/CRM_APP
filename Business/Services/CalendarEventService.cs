using AutoMapper;
using Business.Interfaces;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Humanizer;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Services
{
    public partial class CalendarEventService(IMapper mapper, IMongoContext mongo, IServiceProvider serviceProvider, ILogger<CalendarEventService> logger) : EntityService<Event, EventRequest, ObjectId>(mongo, mapper, serviceProvider, logger), ICalendarEventService
    {
        private readonly IMongoContext _mongo = mongo;
        private readonly ILogger<CalendarEventService> _logger = logger;

        public List<Event> GetAllEventsByUser(ObjectId userId, DateTime start, DateTime end)
        {
            List<Event> events = [];

            try
            {
                string nameCollection = typeof(Event).Name.Pluralize();

                IMongoCollection<Event> collection = _mongo.Database.GetCollection<Event>(nameCollection);

                FilterDefinitionBuilder<Event> filterBuilder = Builders<Event>.Filter;
                FilterDefinition<Event> filter = filterBuilder.Eq("UserId", userId)
                    & filterBuilder.Gte("StartDate", start.ToUniversalTime())
                    & filterBuilder.Lte("StartDate", end.ToUniversalTime())
                    & filterBuilder.Eq("IsActive", true);

                List<Event> searchResult = collection.Find(filter).ToList();

                events = searchResult;

                return events;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los eventos del usuario {userId}", userId);

                return events;
            }
        }
    }
}
