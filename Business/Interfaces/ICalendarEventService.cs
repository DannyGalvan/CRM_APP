using Amazon.Runtime.Internal;
using Entities.Models;
using Entities.Request;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface ICalendarEventService : IEntityService<Event, EventRequest, ObjectId>
    {
        List<Event> GetAllEventsByUser(ObjectId userId, DateTime start, DateTime end);
    }
}